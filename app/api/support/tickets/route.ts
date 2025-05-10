// app/api/support/tickets/route.ts
import { NextRequest, NextResponse } from 'next/server';

import { authOptions } from '@/lib/auth-options';
import { TicketCategory, TicketStatus, ticketService } from '@/lib/services/ticket-service';
import { ticketSchema } from '@/lib/support-utils';

import { getServerSession } from 'next-auth/next';

// Get all tickets (with filtering)
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

// Create a new ticket
export async function POST(req: NextRequest) {
    try {
        // Get authenticated user (optional, as guests can create tickets too)
        const session = await getServerSession(authOptions);
        const userId = session?.user?.id || null;

        // Parse and validate request body
        const body = await req.json();
        const validationResult = ticketSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                { message: 'Invalid input', errors: validationResult.error.errors },
                { status: 400 }
            );
        }

        const { name, email, subject, category, message } = validationResult.data;

        // Create the ticket
        const result = await ticketService.createTicket({
            name,
            email,
            subject,
            category: category as TicketCategory,
            message,
            userId
        });

        if (!result.success) {
            return NextResponse.json({ message: result.error || 'Failed to create ticket' }, { status: 500 });
        }

        return NextResponse.json(
            { message: 'Ticket created successfully', ticketId: result.ticketId },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating ticket:', error);

        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
