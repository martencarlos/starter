// app/api/user/activity/route.ts
import { NextRequest, NextResponse } from 'next/server';

import { authOptions } from '@/lib/auth-options';
import { query, queryOne } from '@/lib/db';

import { getServerSession } from 'next-auth/next';

export async function GET(req: NextRequest) {
    try {
        // Check authentication
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.user.id;

        // Get search params
        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get('limit') || '20', 10);
        const offset = parseInt(searchParams.get('offset') || '0', 10);

        // Get activities from the database
        const activities = await query(
            `
            SELECT
                id,
                type,
                created_at as timestamp,
                ip_address,
                user_agent,
                details
            FROM user_activity
            WHERE user_id = $1
            ORDER BY created_at DESC
            LIMIT $2 OFFSET $3
        `,
            [userId, limit, offset]
        );

        return NextResponse.json({ activities });
    } catch (error) {
        console.error('Error fetching user activity:', error);

        return NextResponse.json({ message: 'Failed to fetch user activity' }, { status: 500 });
    }
}
