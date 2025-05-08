// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';

import { withPermission } from '@/lib/api/with-authorization';
import { query } from '@/lib/db';

async function handler(req: NextRequest) {
    // This endpoint is protected with 'read:users' permission
    const users = await query(
        `SELECT u.id, u.name, u.email, u.email_verified, 
         (SELECT array_agg(r.name) FROM roles r 
          JOIN user_roles ur ON r.id = ur.role_id 
          WHERE ur.user_id = u.id) as roles
         FROM users u
         ORDER BY u.name`
    );

    return NextResponse.json({ users });
}

// Export the handler with permission check
export const GET = withPermission('read:users', handler);
