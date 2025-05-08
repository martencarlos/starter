// app/api/user/update-profile/route.ts
import { NextRequest, NextResponse } from 'next/server';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { query } from '@/lib/db';

import { getServerSession } from 'next-auth/next';
import { z } from 'zod';

// Validation schema
const updateProfileSchema = z.object({
    name: z
        .string()
        .min(2, { message: 'Name must be at least 2 characters long' })
        .max(50, { message: 'Name must be less than 50 characters' })
});

export async function PATCH(req: NextRequest) {
    try {
        // Check if user is authenticated
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        // Parse and validate request body
        const body = await req.json();
        const validationResult = updateProfileSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                { message: 'Invalid input', errors: validationResult.error.errors },
                { status: 400 }
            );
        }

        const { name } = validationResult.data;
        const userId = session.user.id;

        // Update user in database
        await query('UPDATE users SET name = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [name, userId]);

        return NextResponse.json({ message: 'Profile updated successfully' }, { status: 200 });
    } catch (error) {
        console.error('Update profile error:', error);

        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
