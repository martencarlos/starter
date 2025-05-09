// app/api/support/tickets/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

import { authOptions } from '@/lib/auth-options';

import { getServerSession } from 'next-auth/next';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        // Get authenticated user
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.user.id;
        const isAdmin = session.user.roles && session.user.roles.includes('admin');

        // In a real app, fetch the ticket from your database
        // const ticket = await db.query('SELECT * FROM tickets WHERE id = ?', [params.id]);

        // For demo purposes, we'll return mock data
        // In a real application, you would fetch this from your database
        const sampleTickets = {
            'TICKET-1234': {
                id: 'TICKET-1234',
                subject: 'Account access problem',
                status: 'open',
                category: 'account',
                createdAt: '2023-11-15T14:23:45Z',
                lastUpdated: '2023-11-15T15:30:12Z',
                userId: 'user-123',
                messages: [
                    {
                        id: 'msg-1',
                        content:
                            'I\'m having trouble logging into my account. It says "invalid credentials" but I\'m sure my password is correct.',
                        sender: 'user',
                        timestamp: '2023-11-15T14:23:45Z'
                    },
                    {
                        id: 'msg-2',
                        content:
                            'Thank you for reaching out. Could you please try resetting your password using the "Forgot Password" link on the login page?',
                        sender: 'support',
                        timestamp: '2023-11-15T14:45:12Z'
                    },
                    {
                        id: 'msg-3',
                        content: "I tried that, but I'm not receiving the password reset email.",
                        sender: 'user',
                        timestamp: '2023-11-15T15:30:12Z'
                    }
                ]
            }
        };

        const ticket = sampleTickets[params.id as keyof typeof sampleTickets];

        if (!ticket) {
            return NextResponse.json({ message: 'Ticket not found' }, { status: 404 });
        }

        // Check if user has permission to view this ticket
        const hasPermission = isAdmin || ticket.userId === userId;

        if (!hasPermission) {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
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
        const isAdmin = session.user.roles && session.user.roles.includes('admin');

        // Parse request body
        const body = await req.json();
        const { status } = body;

        // Validate status
        if (!status || !['open', 'pending', 'resolved', 'closed'].includes(status)) {
            return NextResponse.json({ message: 'Invalid status' }, { status: 400 });
        }

        // In a real app, check if the ticket exists and belongs to the user
        // const ticket = await db.query('SELECT * FROM tickets WHERE id = ?', [params.id]);

        // For demo purposes, we'll assume the ticket exists and the user has permission

        // In a real app, update the ticket status in your database
        // await db.query('UPDATE tickets SET status = ?, updated_at = NOW() WHERE id = ?', [status, params.id]);

        return NextResponse.json({
            message: 'Ticket status updated successfully',
            status
        });
    } catch (error) {
        console.error('Error updating ticket status:', error);

        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
