// app/api/support/tickets/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

import { authOptions } from '@/lib/auth-options';
import { TicketStatus, ticketService } from '@/lib/services/ticket-service';

import { getServerSession } from 'next-auth/next';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        // Get authenticated user
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.user.id;
        const roles = session.user.roles || [];

        // Check if user has permission to view this ticket
        const hasAccess = await ticketService.hasTicketAccess(params.id, userId, roles);

        if (!hasAccess) {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }

        // Get the ticket with messages
        const ticket = await ticketService.getTicketById(params.id);

        if (!ticket) {
            return NextResponse.json({ message: 'Ticket not found' }, { status: 404 });
        }

        return NextResponse.json({ ticket });
    } catch (error) {
        console.error('Error fetching ticket:', error);

        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

// Update ticket status
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        // Get authenticated user
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.user.id;
        const roles = session.user.roles || [];

        // Check if user has permission to update this ticket
        const hasAccess = await ticketService.hasTicketAccess(params.id, userId, roles);

        if (!hasAccess) {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }

        // Parse request body
        const body = await req.json();
        const { status } = body;

        // Validate status
        if (!status || !['open', 'pending', 'resolved', 'closed'].includes(status)) {
            return NextResponse.json({ message: 'Invalid status' }, { status: 400 });
        }

        // Update the ticket status
        const result = await ticketService.updateTicketStatus(
            params.id,
            status as TicketStatus,
            userId,
            session.user.name || undefined
        );

        if (!result.success) {
            return NextResponse.json({ message: result.error || 'Failed to update ticket status' }, { status: 500 });
        }

        return NextResponse.json({
            message: 'Ticket status updated successfully',
            status
        });
    } catch (error) {
        console.error('Error updating ticket status:', error);

        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
