// app/api/admin/roles/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

import { withRole } from '@/lib/api/with-authorization';
import { query, queryOne } from '@/lib/db';

async function getHandler(req: NextRequest, { params }: { params: { id: string } }) {
    // Await params to fix the Next.js warning
    const { id } = await Promise.resolve(params);

    // Get specific role with assigned permissions
    const role = await queryOne(
        `SELECT r.*, 
          (SELECT array_agg(p.name) 
           FROM permissions p 
           JOIN role_permissions rp ON p.id = rp.permission_id 
           WHERE rp.role_id = r.id) as permissions
         FROM roles r
         WHERE r.id = $1`,
        [id]
    );

    if (!role) {
        return NextResponse.json({ message: 'Role not found' }, { status: 404 });
    }

    return NextResponse.json({ role });
}

async function patchHandler(req: NextRequest, { params }: { params: { id: string } }) {
    // Await params to fix the Next.js warning
    const { id } = await Promise.resolve(params);
    const body = await req.json();

    // Validate role exists
    const role = await queryOne('SELECT id FROM roles WHERE id = $1', [id]);

    if (!role) {
        return NextResponse.json({ message: 'Role not found' }, { status: 404 });
    }

    // Update role fields
    if (body.name || body.description !== undefined) {
        const updates = [];
        const values = [];
        let paramIndex = 1;

        if (body.name) {
            // Check if name already exists for another role
            const existingRole = await queryOne('SELECT id FROM roles WHERE name = $1 AND id != $2', [body.name, id]);
            if (existingRole) {
                return NextResponse.json({ message: 'A role with this name already exists' }, { status: 409 });
            }

            updates.push(`name = $${paramIndex}`);
            values.push(body.name);
            paramIndex++;
        }

        if (body.description !== undefined) {
            updates.push(`description = $${paramIndex}`);
            values.push(body.description);
            paramIndex++;
        }

        // Remove the updated_at field since it doesn't exist in your table
        values.push(id);

        await query(`UPDATE roles SET ${updates.join(', ')} WHERE id = $${paramIndex}`, values);
    }

    // Update permissions if provided
    if (body.permissions && Array.isArray(body.permissions)) {
        // First delete all existing permission assignments
        await query('DELETE FROM role_permissions WHERE role_id = $1', [id]);

        // Then add new permission assignments
        if (body.permissions.length > 0) {
            const permissionIds = await query('SELECT id FROM permissions WHERE name = ANY($1)', [body.permissions]);

            for (const permission of permissionIds) {
                await query('INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2)', [
                    id,
                    permission.id
                ]);
            }
        }
    }

    return NextResponse.json({ message: 'Role updated successfully' });
}

async function deleteHandler(req: NextRequest, { params }: { params: { id: string } }) {
    // Await params to fix the Next.js warning
    const { id } = await Promise.resolve(params);

    // Check if role exists
    const role = await queryOne('SELECT id, name FROM roles WHERE id = $1', [id]);

    if (!role) {
        return NextResponse.json({ message: 'Role not found' }, { status: 404 });
    }

    // Don't allow deleting core system roles
    if (role.name === 'admin' || role.name === 'user') {
        return NextResponse.json({ message: 'Cannot delete system roles' }, { status: 403 });
    }

    // Check if role is assigned to any users
    const assignedUsers = await queryOne('SELECT COUNT(*) as count FROM user_roles WHERE role_id = $1', [id]);

    if (assignedUsers && assignedUsers.count > 0) {
        return NextResponse.json(
            {
                message: 'Cannot delete role that is assigned to users. Remove role from all users first.'
            },
            { status: 409 }
        );
    }

    // Delete role (cascades to role_permissions)
    await query('DELETE FROM roles WHERE id = $1', [id]);

    return NextResponse.json({ message: 'Role deleted successfully' });
}

export const GET = withRole('admin', getHandler);
export const PATCH = withRole('admin', patchHandler);
export const DELETE = withRole('admin', deleteHandler);
