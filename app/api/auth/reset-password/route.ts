import { NextRequest, NextResponse } from 'next/server';

import { userService } from '@/lib/services/user-service';
import { newPasswordSchema } from '@/lib/validations/auth';

export async function POST(req: NextRequest) {
    try {
        // Parse request body
        const body = await req.json();

        // Get token from request
        const { token, password } = body;

        if (!token) {
            return NextResponse.json({ message: 'Reset token is required' }, { status: 400 });
        }

        // Validate password
        const validationResult = newPasswordSchema.safeParse({
            password,
            confirmPassword: body.confirmPassword
        });

        if (!validationResult.success) {
            return NextResponse.json(
                { message: 'Invalid input', errors: validationResult.error.errors },
                { status: 400 }
            );
        }

        // Verify token and get user ID
        const userId = await userService.verifyPasswordResetToken(token);

        if (!userId) {
            return NextResponse.json({ message: 'Invalid or expired token' }, { status: 400 });
        }

        // Update user password
        const success = await userService.updateUserPassword(userId, password);

        if (!success) {
            return NextResponse.json({ message: 'Failed to update password' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Password has been reset successfully' }, { status: 200 });
    } catch (error) {
        console.error('Reset password error:', error);

        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
