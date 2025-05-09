// app/api/support/tickets/route.ts
import { NextRequest, NextResponse } from 'next/server';

import { authOptions } from '@/lib/auth-options';

import { getServerSession } from 'next-auth/next';
import { z } from 'zod';

// Define validation schema for support tickets
const supportTicketSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters long' }),
    email: z.string().email({ message: 'Please enter a valid email address' }),
    subject: z.string().min(5, { message: 'Subject must be at least 5 characters long' }),
    category: z.enum(['general', 'account', 'billing', 'technical', 'other'], {
        required_error: 'Please select a category'
    }),
    message: z.string().min(10, { message: 'Message must be at least 10 characters long' }),
    userId: z.string().optional().nullable()
});

export async function POST(req: NextRequest) {
    try {
        // Get user session (if authenticated)
        const session = await getServerSession(authOptions);

        // Parse and validate request body
        const body = await req.json();
        const validationResult = supportTicketSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                { message: 'Invalid input', errors: validationResult.error.errors },
                { status: 400 }
            );
        }

        const { name, email, subject, category, message, userId } = validationResult.data;

        // If user is authenticated, verify the userId matches the session
        if (session?.user) {
            // If userId is provided, ensure it matches the authenticated user
            if (userId && userId !== session.user.id) {
                return NextResponse.json({ message: 'Unauthorized: User ID mismatch' }, { status: 403 });
            }
        }

        // In a real application, you would store the ticket in the database here
        // For example:
        // const ticketId = await db.insert('support_tickets', {
        //     name,
        //     email,
        //     subject,
        //     category,
        //     message,
        //     user_id: session?.user?.id || null,
        //     status: 'new',
        //     created_at: new Date(),
        // });

        // For demo purposes, we'll just return a success response with a fake ticket ID
        const demoTicketId = `TICKET-${Date.now().toString().substring(7)}`;

        // In a real app, you might also send an email notification or trigger other events

        return NextResponse.json(
            {
                message: 'Support ticket submitted successfully',
                ticketId: demoTicketId
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error submitting support ticket:', error);

        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
