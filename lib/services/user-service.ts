import { query, queryOne, transaction } from '@/lib/db';
import { sendEmail } from '@/lib/email';

import { hash } from 'bcrypt';
import crypto from 'crypto';

interface User {
    id: string;
    email: string;
    name: string;
    password: string;
    created_at: Date;
    updated_at: Date;
    email_verified: boolean;
}

interface CreateUserData {
    email: string;
    name: string;
    password: string;
}

interface UserService {
    createUser(data: CreateUserData): Promise<{ user: Omit<User, 'password'>; success: boolean }>;
    getUserByEmail(email: string): Promise<User | null>;
    getUserById(id: string): Promise<User | null>;
    updateUserPassword(userId: string, newPassword: string): Promise<boolean>;
    verifyEmail(token: string): Promise<boolean>;
    createPasswordResetToken(email: string): Promise<string | null>;
    verifyPasswordResetToken(token: string): Promise<string | null>;
}

export const userService: UserService = {
    // Create a new user
    async createUser(data) {
        try {
            // Hash the password
            const hashedPassword = await hash(data.password, 10);

            // Create user within a transaction
            return await transaction(async (client) => {
                // Insert user
                const result = await client.query(
                    `INSERT INTO users (email, name, password) 
           VALUES ($1, $2, $3) 
           RETURNING id, email, name, created_at, updated_at, email_verified`,
                    [data.email, data.name, hashedPassword]
                );

                const user = result.rows[0];

                // Create verification token
                const token = crypto.randomBytes(32).toString('hex');
                const expiresAt = new Date();
                expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours

                await client.query(
                    `INSERT INTO email_verification (user_id, token, expires_at) 
           VALUES ($1, $2, $3)`,
                    [user.id, token, expiresAt]
                );

                // Send verification email
                const verifyUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`;
                await sendEmail('verifyEmail', { email: user.email, verifyUrl });

                return { user, success: true };
            });
        } catch (error) {
            console.error('Error creating user:', error);

            return { user: null as any, success: false };
        }
    },

    // Get user by email
    async getUserByEmail(email) {
        return await queryOne<User>('SELECT * FROM users WHERE email = $1', [email]);
    },

    // Get user by ID
    async getUserById(id) {
        return await queryOne<User>('SELECT * FROM users WHERE id = $1', [id]);
    },

    // Update user password
    async updateUserPassword(userId, newPassword) {
        try {
            const hashedPassword = await hash(newPassword, 10);

            await query('UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [
                hashedPassword,
                userId
            ]);

            return true;
        } catch (error) {
            console.error('Error updating password:', error);

            return false;
        }
    },

    // Verify email
    async verifyEmail(token) {
        try {
            return await transaction(async (client) => {
                // Find verification record
                const verificationResult = await client.query(
                    `SELECT user_id FROM email_verification 
           WHERE token = $1 AND expires_at > CURRENT_TIMESTAMP`,
                    [token]
                );

                if (verificationResult.rows.length === 0) {
                    return false;
                }

                const userId = verificationResult.rows[0].user_id;

                // Update user email_verified
                await client.query('UPDATE users SET email_verified = TRUE WHERE id = $1', [userId]);

                // Delete verification record
                await client.query('DELETE FROM email_verification WHERE token = $1', [token]);

                return true;
            });
        } catch (error) {
            console.error('Error verifying email:', error);

            return false;
        }
    },

    // Create password reset token
    async createPasswordResetToken(email) {
        try {
            const user = await this.getUserByEmail(email);

            if (!user) {
                return null;
            }

            // Create reset token
            const token = crypto.randomBytes(32).toString('hex');
            const expiresAt = new Date();
            expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour

            // Delete any existing tokens
            await query('DELETE FROM password_reset WHERE user_id = $1', [user.id]);

            // Insert new token
            await query(
                `INSERT INTO password_reset (user_id, token, expires_at) 
         VALUES ($1, $2, $3)`,
                [user.id, token, expiresAt]
            );

            // Send reset email
            const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;
            await sendEmail('resetPassword', { email: user.email, resetUrl });

            return token;
        } catch (error) {
            console.error('Error creating password reset token:', error);

            return null;
        }
    },

    // Verify password reset token
    async verifyPasswordResetToken(token) {
        try {
            const result = await queryOne<{ user_id: string }>(
                `SELECT user_id FROM password_reset 
         WHERE token = $1 AND expires_at > CURRENT_TIMESTAMP`,
                [token]
            );

            return result ? result.user_id : null;
        } catch (error) {
            console.error('Error verifying password reset token:', error);

            return null;
        }
    }
};
