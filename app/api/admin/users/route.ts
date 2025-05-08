// app/api/admin/users/route.ts
import { NextRequest, NextResponse } from 'next/server';

import { query } from '@/lib/db';
import { withRole } from '@/lib/rbac-middleware';

async function handler(req: NextRequest) {
    // Get all users (admin only)
    const users = await query(
        `SELECT u.id, u.name, u.email, u.email_verified, u.created_at,
         array_agg(r.name) as roles
         FROM users u
         LEFT JOIN user_roles ur ON u.id = ur.user_id
         LEFT JOIN roles r ON ur.role_id = r.id
         GROUP BY u.id, u.name, u.email, u.email_verified, u.created_at`
    );

    return NextResponse.json({ users });
}

export const GET = withRole('admin', handler);
