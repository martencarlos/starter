// app/api/admin/users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

import { query, queryOne } from '@/lib/db';
import { roleService } from '@/lib/services/role-service';

async function getHandler(req: NextRequest, { params }: { params: { id: string } }) {
    // Protection for this route is handled by middleware.ts
    const { id } = params;

    // Get specific user
    const user = await queryOne(
        `SELECT u.id, u.name, u.email, u.email_verified, u.created_at
         FROM users u
         WHERE u.id = $1`,
        [id]
    );

    if (!user) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Get user roles
    const roles = await roleService.getUserRoles(id);

    return NextResponse.json({
        user: {
            ...user,
            roles: roles.map((role) => role.name)
        }
    });
}

async function patchHandler(req: NextRequest, { params }: { params: { id: string } }) {
    // Protection for this route is handled by middleware.ts
    const { id } = params;
    const body = await req.json();

    // Validate user exists
    const user = await queryOne('SELECT id FROM users WHERE id = $1', [id]);

    if (!user) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Update user roles if provided
    if (body.roles && Array.isArray(body.roles)) {
        // First get current roles
        const currentRoles = await roleService.getUserRoles(id);
        const currentRoleNames = currentRoles.map((role) => role.name);

        // Determine roles to add and remove
        const rolesToAdd = body.roles.filter((role) => !currentRoleNames.includes(role));
        const rolesToRemove = currentRoleNames.filter((role) => !body.roles.includes(role));

        // Add new roles
        for (const role of rolesToAdd) {
            await roleService.assignRoleToUser(id, role);
        }

        // Remove old roles
        for (const role of rolesToRemove) {
            await roleService.removeRoleFromUser(id, role);
        }
    }

    // Update other user fields if needed
    if (body.name || body.email || body.email_verified !== undefined) {
        const updates = [];
        const values = [];
        let paramIndex = 1;

        if (body.name) {
            updates.push(`name = $${paramIndex}`);
            values.push(body.name);
            paramIndex++;
        }

        if (body.email) {
            updates.push(`email = $${paramIndex}`);
            values.push(body.email);
            paramIndex++;
        }

        if (body.email_verified !== undefined) {
            updates.push(`email_verified = $${paramIndex}`);
            values.push(body.email_verified);
            paramIndex++;
        }

        if (updates.length > 0) {
            updates.push(`updated_at = CURRENT_TIMESTAMP`);
            values.push(id);

            await query(`UPDATE users SET ${updates.join(', ')} WHERE id = $${paramIndex}`, values);
        }
    }

    return NextResponse.json({ message: 'User updated successfully' });
}

async function deleteHandler(req: NextRequest, { params }: { params: { id: string } }) {
    // Protection for this route is handled by middleware.ts
    const { id } = await params;

    // Check if user exists
    const user = await queryOne('SELECT id FROM users WHERE id = $1', [id]);

    if (!user) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    try {
        // Delete sessions first
        await query('DELETE FROM user_sessions WHERE user_id = $1', [id]);

        // Delete email verification tokens
        await query('DELETE FROM email_verification WHERE user_id = $1', [id]);

        // Delete password reset tokens
        await query('DELETE FROM password_reset WHERE user_id = $1', [id]);

        // Delete role assignments (user_roles has ON DELETE CASCADE, but let's be explicit)
        await query('DELETE FROM user_roles WHERE user_id = $1', [id]);

        // Delete role assignment history
        await query('DELETE FROM role_assignment_history WHERE user_id = $1', [id]);

        // Finally delete the user
        await query('DELETE FROM users WHERE id = $1', [id]);

        return NextResponse.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);

        return NextResponse.json(
            {
                message: 'Failed to delete user'
            },
            { status: 500 }
        );
    }
}

export const GET = getHandler;
export const PATCH = patchHandler;
export const DELETE = deleteHandler;
