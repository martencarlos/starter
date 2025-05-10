// Create a new file: app/api/auth/resend-verification/route.ts
import { NextRequest, NextResponse } from 'next/server';

import { query, queryOne } from '@/lib/db';
import { sendEmail } from '@/lib/email';
import { userService } from '@/lib/services/user-service';

import crypto from 'crypto';

export async function POST(req: NextRequest) {
    try {
        // Parse request body
        const body = await req.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json({ message: 'Email is required' }, { status: 400 });
        }

        // Check if user exists and needs verification
        const user = await userService.getUserByEmail(email);

        if (!user) {
            // For security reasons, don't reveal if the email exists
            return NextResponse.json(
                {
                    message: 'If your email is registered, a new verification link has been sent'
                },
                { status: 200 }
            );
        }

        // Check if email is already verified
        if (user.email_verified) {
            return NextResponse.json(
                {
                    message: 'Your email is already verified. You can sign in now.'
                },
                { status: 200 }
            );
        }

        // Delete any existing verification tokens for this user
        await query('DELETE FROM email_verification WHERE user_id = $1', [user.id]);

        // Create a new verification token
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24); // 24 hour expiration

        // Store the token in the database
        await query(
            `INSERT INTO email_verification (user_id, token, expires_at)
            VALUES ($1, $2, $3)`,
            [user.id, token, expiresAt]
        );

        // Send verification email
        await sendEmail('verifyEmail', {
            email: user.email,
            name: user.name,
            token: token
        });

        return NextResponse.json(
            {
                message: 'Verification email has been sent. Please check your inbox.'
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error resending verification email:', error);

        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
