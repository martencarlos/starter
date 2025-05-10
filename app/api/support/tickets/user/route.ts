// app/api/support/tickets/user/route.ts
import { NextRequest, NextResponse } from 'next/server';

import { authOptions } from '@/lib/auth-options';
import { query } from '@/lib/db';

import { getServerSession } from 'next-auth/next';

export async function GET(req: NextRequest) {
    try {
        // Get authenticated user
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.user.id;
        const isAdmin = session.user.roles && session.user.roles.includes('admin');

        // Get status filter from query parameters
        const { searchParams } = new URL(req.url);
        const status = searchParams.get('status');

        // Build query parameters and SQL conditionals
        const queryParams = [userId];
        let statusCondition = '';

        if (status) {
            statusCondition = 'AND t.status = $2';
            queryParams.push(status);
        }

        // Fetch the user's tickets with message count
        const tickets = await query(
            `SELECT t.id, t.ticket_number as "ticketNumber", t.subject, t.category, t.status,
                t.created_at as "createdAt", t.updated_at as "lastUpdated", t.user_id as "userId",
                (SELECT COUNT(*) FROM ticket_messages WHERE ticket_id = t.id) as "messageCount"
            FROM support_tickets t
            WHERE t.user_id = $1 ${statusCondition}
            ORDER BY t.updated_at DESC`,
            queryParams
        );

        return NextResponse.json({ tickets });
    } catch (error) {
        console.error('Error fetching user tickets:', error);

        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
