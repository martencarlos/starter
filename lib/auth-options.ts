// lib/auth-options.ts
import { query, queryOne } from '@/lib/db';
import { roleService } from '@/lib/services/role-service';

import { compare } from 'bcryptjs';
import crypto from 'crypto';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

async function createSessionRecord(userId: string, sessionToken: string | null | undefined) {
    try {
        // Generate a session token if not provided
        const token = sessionToken || crypto.randomBytes(32).toString('hex');

        // Set expiry to 30 days from now (matching your JWT session config)
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);

        // Create the session record
        await query(
            `INSERT INTO user_sessions (user_id, session_token, expires_at)
            VALUES ($1, $2, $3)`,
            [userId, token, expiresAt]
        );

        return true;
    } catch (error) {
        console.error('Error creating session record:', error);

        return false;
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Email and password required');
                }

                // Find user by email
                const result = await query<{
                    id: string;
                    email: string;
                    password: string;
                    name: string;
                    email_verified: boolean; // Make sure this field is used
                }>('SELECT * FROM users WHERE email = $1', [credentials.email]);

                const user = result[0];

                if (!user) {
                    throw new Error('No user found');
                }

                // Check if password matches
                const passwordMatch = await compare(credentials.password, user.password);

                if (!passwordMatch) {
                    throw new Error('Invalid credentials');
                }

                // Check if email is verified
                if (!user.email_verified) {
                    throw new Error('Please verify your email before signing in');
                }

                await createSessionRecord(user.id, null); // Pass null to generate a new token

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name
                    // email_verified and created_at will be fetched in jwt callback
                };
            }
        })
    ],
    pages: {
        signIn: '/login',
        error: '/login'
    },
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60 // 30 days
    },
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider === 'google') {
                // Check if this OAuth account already exists in our database
                const existingUser = await query<{ id: string }>(
                    'SELECT id FROM users WHERE oauth_provider = $1 AND oauth_id = $2',
                    [account.provider, account.providerAccountId]
                );

                if (existingUser.length === 0 && user.email) {
                    // Check if user with this email already exists
                    const emailUser = await query<{ id: string }>('SELECT id FROM users WHERE email = $1', [
                        user.email
                    ]);

                    if (emailUser.length === 0) {
                        // Create a new user with OAuth tokens
                        const result = await query<{ id: string }>(
                            `INSERT INTO users
                            (name, email, oauth_provider, oauth_id, email_verified,
                            oauth_access_token, oauth_refresh_token, oauth_expires_at)
                            VALUES ($1, $2, $3, $4, TRUE, $5, $6, $7)
                            RETURNING id`,
                            [
                                user.name,
                                user.email,
                                account.provider,
                                account.providerAccountId,
                                account.access_token || null,
                                account.refresh_token || null,
                                account.expires_at ? new Date(account.expires_at * 1000) : null
                            ]
                        );

                        if (result.length > 0) {
                            user.id = result[0].id;
                            await createSessionRecord(result[0].id, account.access_token);
                        }
                    } else {
                        // Link OAuth account to existing email account
                        await query(
                            `UPDATE users
                            SET oauth_provider = $1, oauth_id = $2, email_verified = TRUE,
                            oauth_access_token = $3, oauth_refresh_token = $4, oauth_expires_at = $5
                            WHERE id = $6`,
                            [
                                account.provider,
                                account.providerAccountId,
                                account.access_token || null,
                                account.refresh_token || null,
                                account.expires_at ? new Date(account.expires_at * 1000) : null,
                                emailUser[0].id
                            ]
                        );
                        user.id = emailUser[0].id;
                        await createSessionRecord(emailUser[0].id, account.access_token);
                    }
                } else if (existingUser.length > 0) {
                    // Update existing OAuth user with fresh tokens
                    await query(
                        `UPDATE users
                        SET oauth_access_token = $1, oauth_refresh_token = $2, oauth_expires_at = $3
                        WHERE id = $4`,
                        [
                            account.access_token || null,
                            account.refresh_token || null,
                            account.expires_at ? new Date(account.expires_at * 1000) : null,
                            existingUser[0].id
                        ]
                    );
                    user.id = existingUser[0].id;
                    await createSessionRecord(existingUser[0].id, account.access_token);
                }
            }
            // For credentials provider, session record is created in authorize step if successful

            return true;
        },
        async jwt({ token, user, account, trigger, session }) {
            // Initial sign in (user object is present) or account linking
            if (user?.id && (account || trigger === 'signIn' || trigger === 'signUp')) {
                token.id = user.id; // Ensure token.id is set from the user object

                // Fetch comprehensive user data from DB to populate the token
                const dbUser = await queryOne<{
                    id: string;
                    name: string;
                    email: string;
                    created_at: Date;
                    email_verified: boolean;
                    oauth_provider: string | null;
                }>(
                    'SELECT id, name, email, created_at, email_verified, oauth_provider FROM users WHERE id = $1',
                    [user.id] // Use user.id which is guaranteed by this point
                );

                if (dbUser) {
                    token.name = dbUser.name;
                    token.email = dbUser.email;
                    token.createdAt = dbUser.created_at.toISOString(); // Store as ISO string
                    token.emailVerified = dbUser.email_verified;
                    token.oauthProvider = dbUser.oauth_provider; // This is from our DB
                }

                // Add roles and permissions
                const roles = await roleService.getUserRoles(user.id);
                token.roles = roles.map((r) => r.name);
                const permissions = await roleService.getUserPermissions(user.id);
                token.permissions = permissions.map((p) => p.name);

                if (account) {
                    // Specific to OAuth provider flow
                    token.provider = account.provider; // This is NextAuth's own provider field
                }
            }

            // Handle session updates triggered by useSession().update()
            if (trigger === 'update') {
                if (session?.name) {
                    token.name = session.name;
                }
                // Potentially update other fields if passed in `session` argument of `update()`
                // For example, if roles were updated and passed:
                // if (session?.roles) token.roles = session.roles;
            }

            return token;
        },
        async session({ session, token }) {
            // Spread token properties to session.user
            // Ensure all properties defined in types/next-auth.d.ts for session.user are mapped here
            session.user.id = token.id;
            session.user.name = token.name;
            session.user.email = token.email;
            session.user.roles = token.roles || [];
            session.user.permissions = token.permissions || [];
            session.user.createdAt = token.createdAt;
            session.user.emailVerified = token.emailVerified;
            session.user.oauthProvider = token.oauthProvider;
            // session.user.image may come from token if populated by OAuth provider

            return session;
        }
    },
    events: {
        async signOut({ token }) {
            try {
                // Delete the session record when user signs out
                if (token?.id) {
                    // Assuming session_token in user_sessions might be different from JWT sub/jti.
                    // If using NextAuth database adapter, it handles session deletion.
                    // For custom session table, decide if you clear all sessions for user or specific one.
                    // The current createSessionRecord uses a new token or access_token, not JWT's jti.
                    // For simplicity, let's assume we might want to clear all sessions for the user on sign out.
                    // Or, if the JWT `token` object had the specific `session_token` used for the DB record, use that.
                    // Given `createSessionRecord` might use `account.access_token` for OAuth, or a new random token for credentials,
                    // a simple `DELETE FROM user_sessions WHERE user_id = $1` is safer for now.
                    await query('DELETE FROM user_sessions WHERE user_id = $1', [token.id]);
                }
            } catch (error) {
                console.error('Error removing session record(s):', error);
            }
        },
        async updateUser(message) {
            // This event is typically used with database adapters.
            // If you call `update({ name: "New Name" })` on client, `jwt` callback's `trigger` will be 'update'.
            console.log('User updated event (message):', message);
        }
    },
    secret: process.env.NEXTAUTH_SECRET
};
