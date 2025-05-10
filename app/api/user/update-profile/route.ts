// app/api/user/update-profile/route.ts
import { NextRequest, NextResponse } from 'next/server';

import { authOptions } from '@/lib/auth-options';
import { query, queryOne } from '@/lib/db';

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

        // Log the update attempt for debugging
        console.log(`Updating user ${userId} with new name: ${name}`);

        // Update user in database
        interface User {
            id: string;
            name: string;
            email: string;
        }

        const result: User[] = await query(
            'UPDATE users SET name = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, name, email',
            [name, userId]
        );

        // Check if update was successful
        if (!result || result.length === 0) {
            console.error('User update failed: No rows affected');

            return NextResponse.json({ message: 'Failed to update profile' }, { status: 500 });
        }

        const updatedUser = result[0];
        console.log('User updated successfully:', updatedUser);

        // Track the profile update activity
        try {
            const { trackUserActivity } = await import('@/lib/activity-tracker');
            await trackUserActivity({
                userId: userId,
                type: 'profile_update',
                details: `Updated profile name to: ${name}`
            });
        } catch (error) {
            console.error('Error tracking profile update activity:', error);
            // Continue with the response even if tracking fails
        }

        return NextResponse.json(
            {
                message: 'Profile updated successfully',
                user: {
                    id: updatedUser.id,
                    name: updatedUser.name,
                    email: updatedUser.email
                }
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Update profile error:', error);

        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
