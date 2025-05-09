// app/api/admin/permissions/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

import { withRole } from '@/lib/api/with-authorization';
import { query, queryOne } from '@/lib/db';

async function getHandler(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;

    // Get specific permission with assigned roles
    const permission = await queryOne(
        `SELECT p.*, 
          (SELECT array_agg(json_build_object('id', r.id, 'name', r.name)) 
           FROM roles r 
           JOIN role_permissions rp ON r.id = rp.role_id 
           WHERE rp.permission_id = p.id) as roles
         FROM permissions p
         WHERE p.id = $1`,
        [id]
    );

    if (!permission) {
        return NextResponse.json({ message: 'Permission not found' }, { status: 404 });
    }

    return NextResponse.json({ permission });
}

async function patchHandler(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;
    const body = await req.json();

    // Validate permission exists
    const permission = await queryOne('SELECT id FROM permissions WHERE id = $1', [id]);

    if (!permission) {
        return NextResponse.json({ message: 'Permission not found' }, { status: 404 });
    }

    // Update permission fields
    if (body.name || body.description !== undefined) {
        const updates = [];
        const values = [];
        let paramIndex = 1;

        if (body.name) {
            updates.push(`name = $${paramIndex}`);
            values.push(body.name);
            paramIndex++;
        }

        if (body.description !== undefined) {
            updates.push(`description = $${paramIndex}`);
            values.push(body.description);
            paramIndex++;
        }

        values.push(id);

        await query(`UPDATE permissions SET ${updates.join(', ')} WHERE id = $${paramIndex}`, values);
    }

    // Update roles if provided
    if (body.roles && Array.isArray(body.roles)) {
        // First delete all existing role assignments
        await query('DELETE FROM role_permissions WHERE permission_id = $1', [id]);

        // Then add new role assignments
        if (body.roles.length > 0) {
            const roleIds = await query('SELECT id FROM roles WHERE name = ANY($1)', [body.roles]);

            for (const role of roleIds) {
                await query('INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2)', [role.id, id]);
            }
        }
    }

    return NextResponse.json({ message: 'Permission updated successfully' });
}

async function deleteHandler(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;

    // Check if permission exists
    const permission = await queryOne('SELECT id, name FROM permissions WHERE id = $1', [id]);

    if (!permission) {
        return NextResponse.json({ message: 'Permission not found' }, { status: 404 });
    }

    // Check if this is a core permission that shouldn't be deleted
    const corePermissions = [
        'manage:users',
        'manage:roles',
        'manage:permissions',
        'view:admin_dashboard',
        'read:users',
        'read:reports',
        'read:audit_log',
        'read:analytics'
    ];

    if (corePermissions.includes(permission.name)) {
        return NextResponse.json({ message: 'Cannot delete core system permissions' }, { status: 403 });
    }

    try {
        // First remove all permission-role associations
        await query('DELETE FROM role_permissions WHERE permission_id = $1', [id]);

        // Then delete the permission
        await query('DELETE FROM permissions WHERE id = $1', [id]);

        return NextResponse.json({ message: 'Permission deleted successfully' });
    } catch (error) {
        console.error('Error deleting permission:', error);

        return NextResponse.json({ message: 'Failed to delete permission' }, { status: 500 });
    }
}

export const GET = withRole('admin', getHandler);
export const PATCH = withRole('admin', patchHandler);
export const DELETE = withRole('admin', deleteHandler);
