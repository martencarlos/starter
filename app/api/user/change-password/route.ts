// app/api/user/change-password/route.ts
import { NextRequest, NextResponse } from 'next/server';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { query, queryOne } from '@/lib/db';

import { compare, hash } from 'bcrypt';
import { getServerSession } from 'next-auth/next';
import { z } from 'zod';

// Validation schema
const changePasswordSchema = z
    .object({
        currentPassword: z.string().min(1, { message: 'Current password is required' }),
        newPassword: z
            .string()
            .min(8, { message: 'Password must be at least 8 characters long' })
            .max(100, { message: 'Password must be less than 100 characters' })
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
                message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
            }),
        confirmPassword: z.string()
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword']
    });

export async function POST(req: NextRequest) {
    try {
        // Check if user is authenticated
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        // Parse and validate request body
        const body = await req.json();
        const validationResult = changePasswordSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                { message: 'Invalid input', errors: validationResult.error.errors },
                { status: 400 }
            );
        }

        const { currentPassword, newPassword } = validationResult.data;
        const userId = session.user.id;

        // Get current user from database
        const user = await queryOne<{ password: string }>('SELECT password FROM users WHERE id = $1', [userId]);

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Verify current password
        const isPasswordValid = await compare(currentPassword, user.password);

        if (!isPasswordValid) {
            return NextResponse.json({ message: 'Current password is incorrect' }, { status: 400 });
        }

        // Hash the new password
        const hashedPassword = await hash(newPassword, 10);

        // Update user password
        await query('UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [
            hashedPassword,
            userId
        ]);

        return NextResponse.json({ message: 'Password changed successfully' }, { status: 200 });
    } catch (error) {
        console.error('Change password error:', error);

        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
