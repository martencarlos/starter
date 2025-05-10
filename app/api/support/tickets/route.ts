// app/api/support/tickets/user/route.ts
import { NextRequest, NextResponse } from 'next/server';

import { authOptions } from '@/lib/auth-options';
import { TicketStatus, ticketService } from '@/lib/services/ticket-service';

import { getServerSession } from 'next-auth/next';

export async function GET(req: NextRequest) {
    try {
        // Get authenticated user
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.user.id;

        // Get status filter from query parameters
        const { searchParams } = new URL(req.url);
        const status = searchParams.get('status') as TicketStatus | null;

        // Use the ticket service to get user tickets
        const tickets = await ticketService.getUserTickets(userId, status || undefined);

        return NextResponse.json({ tickets });
    } catch (error) {
        console.error('Error fetching user tickets:', error);

        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
