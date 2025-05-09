// app/api/support/tickets/user/route.ts
import { NextRequest, NextResponse } from 'next/server';

import { authOptions } from '@/lib/auth-options';

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

        // In a real app, fetch tickets from your database with optional filtering
        // let query = 'SELECT * FROM tickets WHERE user_id = ?';
        // let params = [userId];

        // if (status) {
        //     query += ' AND status = ?';
        //     params.push(status);
        // }

        // query += ' ORDER BY created_at DESC';
        // const tickets = await db.query(query, params);

        // For demo purposes, we'll return mock data
        const sampleTickets = [
            {
                id: 'TICKET-1234',
                subject: 'Account access problem',
                status: 'open',
                category: 'account',
                createdAt: '2023-11-15T14:23:45Z',
                lastUpdated: '2023-11-15T15:30:12Z',
                messages: 3
            },
            {
                id: 'TICKET-5678',
                subject: 'Billing question about my subscription',
                status: 'closed',
                category: 'billing',
                createdAt: '2023-10-28T09:12:33Z',
                lastUpdated: '2023-10-30T11:45:20Z',
                messages: 5
            },
            {
                id: 'TICKET-9012',
                subject: 'How do I change my password?',
                status: 'resolved',
                category: 'account',
                createdAt: '2023-09-05T18:07:22Z',
                lastUpdated: '2023-09-06T10:15:30Z',
                messages: 2
            }
        ];

        // Apply status filter if provided
        let filteredTickets = sampleTickets;
        if (status) {
            filteredTickets = sampleTickets.filter((ticket) => ticket.status === status);
        }

        return NextResponse.json({ tickets: filteredTickets });
    } catch (error) {
        console.error('Error fetching user tickets:', error);

        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
