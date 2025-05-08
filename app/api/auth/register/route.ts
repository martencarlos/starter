// app/api/auth/register/route.ts (update)
import { NextRequest, NextResponse } from 'next/server';

import { query } from '@/lib/db';
import { roleService } from '@/lib/services/role-service';
import { userService } from '@/lib/services/user-service';
import { registerSchema } from '@/lib/validations/auth';

export async function POST(req: NextRequest) {
    try {
        // Parse and validate request body
        const body = await req.json();
        const validationResult = registerSchema.safeParse(body);

        if (!validationResult.success) {
            console.log('Validation errors:', validationResult.error.format());

            return NextResponse.json(
                {
                    message: 'Invalid input',
                    errors: validationResult.error.errors,
                    formErrors: validationResult.error.format()
                },
                { status: 400 }
            );
        }

        const { name, email, password } = validationResult.data;

        // Check if user already exists
        const existingUser = await userService.getUserByEmail(email);

        if (existingUser) {
            return NextResponse.json({ message: 'User with this email already exists' }, { status: 409 });
        }

        // Create user
        const { user, success } = await userService.createUser({
            name,
            email,
            password
        });

        if (!success || !user) {
            return NextResponse.json({ message: 'Failed to create user' }, { status: 500 });
        }

        // Assign default 'user' role
        await roleService.assignRoleToUser(user.id, 'user');

        // Return success response
        return NextResponse.json(
            {
                message: 'User registered successfully',
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Registration error:', error);

        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
