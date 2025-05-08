// app/api/auth/[...nextauth]/route.ts
import { query, queryOne } from '@/lib/db';

import { compare } from 'bcrypt';
import { NextAuthOptions } from 'next-auth';
import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

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
                        // Create a new user
                        const result = await query<{ id: string }>(
                            `INSERT INTO users 
                            (name, email, oauth_provider, oauth_id, email_verified) 
                            VALUES ($1, $2, $3, $4, TRUE) 
                            RETURNING id`,
                            [user.name, user.email, account.provider, account.providerAccountId]
                        );

                        if (result.length > 0) {
                            user.id = result[0].id;
                        }
                    } else {
                        // Link OAuth account to existing email account
                        await query(
                            `UPDATE users 
                            SET oauth_provider = $1, oauth_id = $2, email_verified = TRUE 
                            WHERE id = $3`,
                            [account.provider, account.providerAccountId, emailUser[0].id]
                        );

                        user.id = emailUser[0].id;
                    }
                } else if (existingUser.length > 0) {
                    user.id = existingUser[0].id;
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
        async updateUser(message) {
            console.log('User updated event triggered:', message);
        }
    },
    secret: process.env.NEXTAUTH_SECRET
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
