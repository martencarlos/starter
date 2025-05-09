// app/api/admin/permissions/route.ts
import { NextRequest, NextResponse } from 'next/server';

import { withRole } from '@/lib/api/with-authorization';
import { query, queryOne } from '@/lib/db';

async function getHandler(req: NextRequest) {
    // Get all permissions
    const permissions = await query(
        `SELECT p.*, 
          (SELECT array_agg(r.name) FROM roles r 
           JOIN role_permissions rp ON r.id = rp.role_id 
           WHERE rp.permission_id = p.id) as roles
         FROM permissions p
         ORDER BY p.name`
    );

    return NextResponse.json({ permissions });
}

async function postHandler(req: NextRequest) {
    const body = await req.json();

    if (!body.name) {
        return NextResponse.json({ message: 'Permission name is required' }, { status: 400 });
    }

    // Check if permission already exists
    const existingPermission = await queryOne('SELECT id FROM permissions WHERE name = $1', [body.name]);

    if (existingPermission) {
        return NextResponse.json({ message: 'Permission already exists' }, { status: 409 });
    }

    // Create new permission
    const result = await query(
        'INSERT INTO permissions (name, description) VALUES ($1, $2) RETURNING id, name, description',
        [body.name, body.description || null]
    );

    return NextResponse.json(
        {
            message: 'Permission created successfully',
            permission: result[0]
        },
        { status: 201 }
    );
}

export const GET = withRole('admin', getHandler);
export const POST = withRole('admin', postHandler);
