// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';

import { query } from '@/lib/db';

async function handler(req: NextRequest) {
    // Protection for this route (e.g., 'read:users' permission) is handled by middleware.ts
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

export const GET = handler;
