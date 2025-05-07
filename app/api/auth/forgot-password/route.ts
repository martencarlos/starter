import { NextRequest, NextResponse } from 'next/server';

import { userService } from '@/lib/services/user-service';
import { resetPasswordSchema } from '@/lib/validations/auth';

import { z } from 'zod';

export async function POST(req: NextRequest) {
    try {
        // Parse and validate request body
        const body = await req.json();

        // Validate using Zod schema
        const validationResult = resetPasswordSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                { message: 'Invalid input', errors: validationResult.error.errors },
                { status: 400 }
            );
        }

        const { email } = validationResult.data;

        // Check if user exists
        const user = await userService.getUserByEmail(email);

        // For security reasons, always return success even if user doesn't exist
        // This prevents email enumeration attacks
        if (!user) {
            return NextResponse.json(
                { message: 'If your email is registered, you will receive reset instructions shortly' },
                { status: 200 }
            );
        }

        // Create password reset token and send email
        const token = await userService.createPasswordResetToken(email);

        // For security reasons, don't reveal if the email failed to send
        return NextResponse.json(
            { message: 'If your email is registered, you will receive reset instructions shortly' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Forgot password error:', error);

        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
