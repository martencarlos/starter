// app/api/user/stats/route.ts
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

        // Get user stats
        const ticketsStats = await queryOne(
            `
            SELECT
                COUNT(*) as created,
                COUNT(CASE WHEN status IN ('resolved', 'closed') THEN 1 END) as resolved
            FROM support_tickets
            WHERE user_id = $1
        `,
            [userId]
        );

        // Get last login info
        const lastLogin = await queryOne(
            `
            SELECT created_at
            FROM user_activity
            WHERE user_id = $1 AND type = 'login'
            ORDER BY created_at DESC
            LIMIT 1
        `,
            [userId]
        );

        // Calculate account utilization (simplified example)
        // This would be a more complex calculation in a real app
        const activityCount = await queryOne(
            `
            SELECT COUNT(*) as count
            FROM user_activity
            WHERE user_id = $1 AND created_at >= NOW() - INTERVAL '30 days'
        `,
            [userId]
        );

        const utilization = Math.min(100, Math.round((activityCount?.count || 0) * 3.33));

        // Get response rate for support tickets
        const responseRate = await queryOne(
            `
            SELECT
                COUNT(DISTINCT st.id) as total,
                COUNT(DISTINCT CASE WHEN tm.sender = 'user' THEN st.id END) as responded
            FROM support_tickets st
            LEFT JOIN ticket_messages tm ON st.id = tm.ticket_id
            WHERE st.user_id = $1
        `,
            [userId]
        );

        const supportResponseRate =
            responseRate?.total > 0 ? Math.round((responseRate.responded / responseRate.total) * 100) : 0;

        return NextResponse.json({
            ticketsCreated: ticketsStats?.created || 0,
            ticketsResolved: ticketsStats?.resolved || 0,
            lastLoginDate: lastLogin?.created_at || null,
            accountUtilization: utilization || 0,
            supportResponseRate: supportResponseRate || 0
        });
    } catch (error) {
        console.error('Error fetching user stats:', error);

        return NextResponse.json({ message: 'Failed to fetch user stats' }, { status: 500 });
    }
}
