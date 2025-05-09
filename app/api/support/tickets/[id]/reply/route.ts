// app/api/support/tickets/[id]/reply/route.ts
import { NextRequest, NextResponse } from 'next/server';

import { authOptions } from '@/lib/auth-options';

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
        const isAdmin = session.user.roles && session.user.roles.includes('admin');

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

        // In a real app, check if the ticket exists and belongs to the user
        // const ticket = await db.query('SELECT * FROM tickets WHERE id = ?', [params.id]);

        // For demo purposes, we'll assume the ticket exists and the user has permission

        // In a real app, insert the reply into your database
        // const replyId = await db.query(
        //     'INSERT INTO ticket_messages (ticket_id, user_id, content, is_from_user) VALUES (?, ?, ?, ?)',
        //     [params.id, userId, content, true]
        // );

        // Update the ticket's last_updated field and set status to open if it was closed
        // await db.query(
        //     'UPDATE tickets SET last_updated = NOW(), status = CASE WHEN status IN ("closed", "resolved") THEN "open" ELSE status END WHERE id = ?',
        //     [params.id]
        // );

        // Generate a mock reply ID
        const replyId = `msg-${Date.now()}`;
        const timestamp = new Date().toISOString();

        return NextResponse.json({
            message: 'Reply added successfully',
            reply: {
                id: replyId,
                content,
                sender: 'user',
                timestamp,
                userId
            }
        });
    } catch (error) {
        console.error('Error adding reply:', error);

        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
