// app/api/admin/roles/route.ts
import { NextRequest, NextResponse } from 'next/server';

import { withRole } from '@/lib/api/with-authorization';
import { query, queryOne } from '@/lib/db';

async function getHandler(req: NextRequest) {
    // Get all roles with their permissions
    const roles = await query(
        `SELECT r.id, r.name, r.description,
         array_agg(p.name) as permissions
         FROM roles r
         LEFT JOIN role_permissions rp ON r.id = rp.role_id
         LEFT JOIN permissions p ON rp.permission_id = p.id
         GROUP BY r.id, r.name, r.description
         ORDER BY r.name`
    );

    return NextResponse.json({ roles });
}

async function postHandler(req: NextRequest) {
    const body = await req.json();

    if (!body.name) {
        return NextResponse.json({ message: 'Role name is required' }, { status: 400 });
    }

    // Check if role already exists
    const existingRole = await queryOne('SELECT id FROM roles WHERE name = $1', [body.name]);

    if (existingRole) {
        return NextResponse.json({ message: 'Role already exists' }, { status: 409 });
    }

    // Create new role
    const result = await query(
        'INSERT INTO roles (name, description) VALUES ($1, $2) RETURNING id, name, description',
        [body.name, body.description || null]
    );

    // Assign permissions if provided
    if (body.permissions && Array.isArray(body.permissions) && body.permissions.length > 0) {
        const roleId = result[0].id;

        // Get permissions IDs
        const permissionIds = await query('SELECT id FROM permissions WHERE name = ANY($1)', [body.permissions]);

        // Assign permissions to role
        for (const permission of permissionIds) {
            await query('INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2)', [
                roleId,
                permission.id
            ]);
        }
    }

    return NextResponse.json(
        {
            message: 'Role created successfully',
            role: result[0]
        },
        { status: 201 }
    );
}

export const GET = withRole('admin', getHandler);
export const POST = withRole('admin', postHandler);
