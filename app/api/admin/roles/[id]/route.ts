// app/api/admin/roles/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

import { withRole } from '@/lib/api/with-authorization';
import { query, queryOne } from '@/lib/db';

async function getHandler(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;

    // Get specific role with its permissions
    const role = await queryOne(
        `SELECT r.*, 
          array_agg(p.name) FILTER (WHERE p.name IS NOT NULL) as permissions
         FROM roles r
         LEFT JOIN role_permissions rp ON r.id = rp.role_id
         LEFT JOIN permissions p ON rp.permission_id = p.id
         WHERE r.id = $1
         GROUP BY r.id, r.name, r.description`,
        [id]
    );

    if (!role) {
        return NextResponse.json({ message: 'Role not found' }, { status: 404 });
    }

    return NextResponse.json({ role });
}

async function patchHandler(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;
    const body = await req.json();

    // Validate role exists
    const role = await queryOne('SELECT id, name FROM roles WHERE id = $1', [id]);

    if (!role) {
        return NextResponse.json({ message: 'Role not found' }, { status: 404 });
    }

    // Prevent updates to built-in roles
    if (role.name === 'admin' || role.name === 'user') {
        return NextResponse.json({ message: 'Cannot modify built-in roles' }, { status: 403 });
    }

    // Update role fields
    if (body.name || body.description !== undefined) {
        const updates = [];
        const values = [];
        let paramIndex = 1;

        if (body.name) {
            // Check the new name doesn't conflict with built-in roles
            if (body.name === 'admin' || body.name === 'user') {
                return NextResponse.json({ message: 'Cannot use reserved role names' }, { status: 400 });
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

        if (updates.length > 0) {
            updates.push(`updated_at = CURRENT_TIMESTAMP`);
            values.push(id);

            await query(`UPDATE roles SET ${updates.join(', ')} WHERE id = $${paramIndex}`, values);
        }
    }

    // Update permissions if provided
    if (body.permissions && Array.isArray(body.permissions)) {
        // First delete all existing permission assignments
        await query('DELETE FROM role_permissions WHERE role_id = $1', [id]);

        // Then add new permission assignments
        for (const permissionName of body.permissions) {
            const permission = await queryOne('SELECT id FROM permissions WHERE name = $1', [permissionName]);
            if (permission) {
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
    const { id } = params;

    // Validate role exists
    const role = await queryOne('SELECT id, name FROM roles WHERE id = $1', [id]);

    if (!role) {
        return NextResponse.json({ message: 'Role not found' }, { status: 404 });
    }

    // Prevent deletion of built-in roles
    if (role.name === 'admin' || role.name === 'user') {
        return NextResponse.json({ message: 'Cannot delete built-in roles' }, { status: 403 });
    }

    try {
        // First remove all role assignments
        await query('DELETE FROM user_roles WHERE role_id = $1', [id]);

        // Remove role permissions
        await query('DELETE FROM role_permissions WHERE role_id = $1', [id]);

        // Remove from audit history (this is optional, you might want to keep it)
        // await query('DELETE FROM role_assignment_history WHERE role_id = $1', [id]);

        // Finally delete the role
        await query('DELETE FROM roles WHERE id = $1', [id]);

        return NextResponse.json({ message: 'Role deleted successfully' });
    } catch (error) {
        console.error('Error deleting role:', error);

        return NextResponse.json({ message: 'Failed to delete role' }, { status: 500 });
    }
}

export const GET = withRole('admin', getHandler);
export const PATCH = withRole('admin', patchHandler);
export const DELETE = withRole('admin', deleteHandler);
