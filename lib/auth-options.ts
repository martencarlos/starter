// lib/auth-options.ts
import { query, queryOne } from '@/lib/db';

import { compare } from 'bcrypt';
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

                await createSessionRecord(user.id, null); // Pass null to generate a new token

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name
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

                            // Create a session record
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

                        // Create a session record
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

                    // Create a session record
                    await createSessionRecord(existingUser[0].id, account.access_token);
                }
            }

            return true;
        },
        async jwt({ token, user, account, trigger, session }) {
            // Initial sign in
            if (user) {
                token.id = user.id;
                token.name = user.name;
                token.email = user.email;
                if (account) {
                    token.provider = account.provider;
                }
            }

            // If this is an update event, refresh the user data from the database
            if (trigger === 'update' && session?.name) {
                token.name = session.name;
            }

            // Always refresh user data on token creation/update
            if (token.id) {
                try {
                    const refreshedUser = await queryOne<{
                        id: string;
                        name: string;
                        email: string;
                    }>('SELECT id, name, email FROM users WHERE id = $1', [token.id]);

                    if (refreshedUser) {
                        token.name = refreshedUser.name;
                        token.email = refreshedUser.email;
                    }
                } catch (error) {
                    console.error('Error refreshing user data in JWT callback:', error);
                }
            }

            return token;
        },
        async session({ session, token }) {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id,
                    name: token.name,
                    email: token.email
                }
            };
        }
    },
    events: {
        async signOut({ token }) {
            try {
                // Delete the session record when user signs out
                if (token?.id) {
                    await query('DELETE FROM user_sessions WHERE user_id = $1', [token.id]);
                }
            } catch (error) {
                console.error('Error removing session record:', error);
            }
        },
        async updateUser(message) {
            console.log('User updated event triggered:', message);
        }
    },
    secret: process.env.NEXTAUTH_SECRET
};
