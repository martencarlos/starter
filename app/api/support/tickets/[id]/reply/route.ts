// app/api/support/tickets/[id]/reply/route.ts
import { NextRequest, NextResponse } from 'next/server';

import { authOptions } from '@/lib/auth-options';
import { MessageSender, ticketService } from '@/lib/services/ticket-service';

import { getServerSession } from 'next-auth/next';
import { z } from 'zod';

// Define validation schema for ticket replies
const ticketReplySchema = z.object({
    content: z.string().min(1, { message: 'Reply content is required' })
});

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        // Get authenticated user
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.user.id;
        const roles = session.user.roles || [];

        // Parse and validate request body
        const body = await req.json();
        const validationResult = ticketReplySchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                { message: 'Invalid input', errors: validationResult.error.errors },
                { status: 400 }
            );
        }

        const { content } = validationResult.data;

        // Check if user has permission to reply to this ticket
        const hasAccess = await ticketService.hasTicketAccess(params.id, userId, roles);

        if (!hasAccess) {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }

        // Determine the sender type based on user role
        let sender: MessageSender = 'user';
        if (roles.includes('admin') || roles.includes('support_agent')) {
            sender = 'support';
        }

        // Add the message to the ticket
        const result = await ticketService.addMessage(params.id, userId, content, sender);

        if (!result.success) {
            return NextResponse.json({ message: result.error || 'Failed to add reply' }, { status: 500 });
        }

        // Check if we need to update ticket status (e.g., reopen a closed ticket)
        const ticket = await ticketService.getTicketById(params.id);
        let updatedStatus = null;

        if (ticket && (ticket.status === 'closed' || ticket.status === 'resolved')) {
            // Reopen the ticket
            const statusResult = await ticketService.updateTicketStatus(
                params.id,
                'open',
                userId,
                session.user.name || undefined
            );

            if (statusResult.success) {
                updatedStatus = 'open';
            }
        }

        return NextResponse.json({
            message: 'Reply added successfully',
            reply: result.message,
            status: updatedStatus
        });
    } catch (error) {
        console.error('Error adding reply:', error);

        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
