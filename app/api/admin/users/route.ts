// app/api/admin/users/route.ts
import { NextRequest, NextResponse } from 'next/server';

import { withRole } from '@/lib/api/with-authorization';
import { query } from '@/lib/db';
import { roleService } from '@/lib/services/role-service';
import { userService } from '@/lib/services/user-service';

async function getHandler(req: NextRequest) {
    // Get all users (admin only)
    const users = await query(
        `SELECT u.id, u.name, u.email, u.email_verified, u.created_at,
         array_agg(r.name) FILTER (WHERE r.name IS NOT NULL) as roles
         FROM users u
         LEFT JOIN user_roles ur ON u.id = ur.user_id
         LEFT JOIN roles r ON ur.role_id = r.id
         GROUP BY u.id, u.name, u.email, u.email_verified, u.created_at`
    );

    return NextResponse.json({ users });
}

async function postHandler(req: NextRequest) {
    try {
        const body = await req.json();

        const { name, email, password, roles = ['user'] } = body;

        // Validate required fields
        if (!name || !email || !password) {
            return NextResponse.json(
                {
                    message: 'Name, email and password are required'
                },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await userService.getUserByEmail(email);

        if (existingUser) {
            return NextResponse.json(
                {
                    message: 'User with this email already exists'
                },
                { status: 409 }
            );
        }

        // Create the user
        const { user, success } = await userService.createUser({
            name,
            email,
            password
        });

        if (!success || !user) {
            return NextResponse.json(
                {
                    message: 'Failed to create user'
                },
                { status: 500 }
            );
        }

        // Assign roles
        // Remove default role to prevent duplicates
        const defaultRole = 'user';
        await roleService.removeRoleFromUser(user.id, defaultRole);

        // Assign selected roles
        for (const roleName of roles) {
            await roleService.assignRoleToUser(user.id, roleName);
        }

        return NextResponse.json(
            {
                message: 'User created successfully',
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating user:', error);

        return NextResponse.json(
            {
                message: 'Internal server error'
            },
            { status: 500 }
        );
    }
}

export const GET = withRole('admin', getHandler);
export const POST = withRole('admin', postHandler);
