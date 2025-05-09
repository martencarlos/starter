// app/api/admin/users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

import { withRole } from '@/lib/api/with-authorization';
import { query, queryOne } from '@/lib/db';
import { roleService } from '@/lib/services/role-service';

async function getHandler(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;

    // Get specific user (admin only)
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
    if (body.name || body.email) {
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

        if (updates.length > 0) {
            updates.push(`updated_at = CURRENT_TIMESTAMP`);
            values.push(id);

            await query(`UPDATE users SET ${updates.join(', ')} WHERE id = $${paramIndex}`, values);
        }
    }

    return NextResponse.json({ message: 'User updated successfully' });
}

export const GET = withRole('admin', getHandler);
export const PATCH = withRole('admin', patchHandler);
