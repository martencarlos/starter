// app/api/admin/permissions/route.ts
// This route now only lists existing predefined permissions.
// POST for creation is disabled.
import { NextRequest, NextResponse } from 'next/server';

import { query } from '@/lib/db';

async function getHandler(req: NextRequest) {
    // Protection for this route is handled by middleware.ts

    // Get all predefined permissions and count of roles they are assigned to
    const permissions = await query(
        `SELECT p.id, p.name, p.description, 
          (SELECT COUNT(rp.role_id) FROM role_permissions rp WHERE rp.permission_id = p.id) as assigned_roles_count
         FROM permissions p
         ORDER BY p.name`
    );

    return NextResponse.json({ permissions });
}

async function postHandler(req: NextRequest) {
    // Protection for this route is handled by middleware.ts
    // Creating permissions via API is not supported as they are predefined.
    return NextResponse.json(
        { message: 'Creating permissions via API is not supported. Permissions are predefined in sql/init.sql.' },
        { status: 405 } // Method Not Allowed
    );
}

export const GET = getHandler;
export const POST = postHandler; // Returns 405
