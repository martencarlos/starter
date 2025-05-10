// lib/services/ticket-service.ts
import { query, queryOne } from '@/lib/db';

// Types
export type TicketStatus = 'open' | 'pending' | 'resolved' | 'closed';
export type TicketCategory = 'general' | 'account' | 'billing' | 'technical' | 'other';
export type MessageSender = 'user' | 'support' | 'system';

export interface User {
    id: string;
    name?: string | null;
    email?: string | null;
}

export interface Message {
    id: string;
    content: string;
    sender: MessageSender;
    timestamp: string;
    user?: User | null;
}

export interface Ticket {
    id: string;
    ticketNumber: string;
    subject: string;
    status: TicketStatus;
    category: TicketCategory;
    createdAt: string;
    lastUpdated: string;
    userId: string;
    name: string;
    email: string;
    messages?: Message[];
    messageCount?: number;
}

export interface TicketCreateData {
    name: string;
    email: string;
    subject: string;
    category: TicketCategory;
    message: string;
    userId?: string | null;
}

// Ticket service
export const ticketService = {
    // Create a new ticket
    async createTicket(data: TicketCreateData): Promise<{ success: boolean; ticketId?: string; error?: string }> {
        try {
            // First check if the support_tickets table has the required columns
            let ticketResult;

            try {
                // Try to insert with the expected schema
                ticketResult = await query<{ id: string; ticket_number: string }>(
                    `INSERT INTO support_tickets
                    (user_id, subject, category, status, created_by_name, created_by_email)
                    VALUES ($1, $2, $3, 'open', $4, $5)
                    RETURNING id, ticket_number`,
                    [data.userId || null, data.subject, data.category, data.name, data.email]
                );
            } catch (err) {
                // If first attempt fails, try alternative schema that might be in the database
                console.log('First schema attempt failed, trying alternative schema...');
                ticketResult = await query<{ id: string; ticket_number: string }>(
                    `INSERT INTO support_tickets
                    (user_id, subject, category, status)
                    VALUES ($1, $2, $3, 'open')
                    RETURNING id, ticket_number`,
                    [data.userId || null, data.subject, data.category]
                );

                // Store the contact information in ticket_contact_info table instead
                await query(
                    `INSERT INTO ticket_contact_info
                    (ticket_id, name, email)
                    VALUES ($1, $2, $3)`,
                    [ticketResult[0].id, data.name, data.email]
                );
            }

            if (!ticketResult || ticketResult.length === 0) {
                throw new Error('Failed to create ticket');
            }

            const ticket = ticketResult[0];

            // Add the first message to the ticket
            await query(
                `INSERT INTO ticket_messages
                (ticket_id, user_id, sender, content)
                VALUES ($1, $2, 'user', $3)`,
                [ticket.id, data.userId || null, data.message]
            );

            // Update the last updated timestamp on the ticket
            await query(`UPDATE support_tickets SET updated_at = CURRENT_TIMESTAMP WHERE id = $1`, [ticket.id]);

            return {
                success: true,
                ticketId: ticket.ticket_number
            };
        } catch (error) {
            console.error('Error creating ticket:', error);

            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            };
        }
    },

    // Get a ticket by ID with its messages
    async getTicketById(id: string): Promise<Ticket | null> {
        try {
            // Fetch the ticket
            const ticket = await queryOne(
                `SELECT t.id, t.ticket_number as "ticketNumber", t.subject, t.category,
                    t.status, t.created_at as "createdAt", t.updated_at as "lastUpdated",
                    t.user_id as "userId",
                    COALESCE(t.created_by_name, c.name) as name,
                    COALESCE(t.created_by_email, c.email) as email
                FROM support_tickets t
                LEFT JOIN ticket_contact_info c ON t.id = c.ticket_id
                WHERE t.id = $1`,
                [id]
            );

            if (!ticket) {
                return null;
            }

            // Fetch messages for this ticket
            const messagesResult = await queryOne(
                `SELECT json_agg(
                    json_build_object(
                        'id', m.id,
                        'content', m.content,
                        'sender', m.sender,
                        'timestamp', m.created_at,
                        'user', CASE
                            WHEN m.user_id IS NOT NULL THEN
                                json_build_object(
                                    'id', m.user_id,
                                    'name', u.name,
                                    'email', u.email
                                )
                            ELSE NULL
                        END
                    ) ORDER BY m.created_at ASC
                ) as messages
                FROM ticket_messages m
                LEFT JOIN users u ON m.user_id = u.id
                WHERE m.ticket_id = $1`,
                [id]
            );

            // Return the complete ticket with messages
            return {
                ...ticket,
                messages: messagesResult?.messages || []
            };
        } catch (error) {
            console.error('Error getting ticket:', error);

            return null;
        }
    },

    // Get tickets for a user
    async getUserTickets(userId: string, status?: TicketStatus): Promise<Ticket[]> {
        try {
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
                    COALESCE(t.created_by_name, c.name) as name,
                    COALESCE(t.created_by_email, c.email) as email,
                    (SELECT COUNT(*) FROM ticket_messages WHERE ticket_id = t.id) as "messageCount"
                FROM support_tickets t
                LEFT JOIN ticket_contact_info c ON t.id = c.ticket_id
                WHERE t.user_id = $1 ${statusCondition}
                ORDER BY t.updated_at DESC`,
                queryParams
            );

            return tickets;
        } catch (error) {
            console.error('Error getting user tickets:', error);

            return [];
        }
    },

    // Add a message to a ticket
    async addMessage(
        ticketId: string,
        userId: string,
        content: string,
        sender: MessageSender
    ): Promise<{ success: boolean; message?: Message; error?: string }> {
        try {
            // Add the message
            const messageResult = await query(
                `INSERT INTO ticket_messages (ticket_id, user_id, sender, content)
                VALUES ($1, $2, $3, $4)
                RETURNING id, content, sender, created_at as timestamp`,
                [ticketId, userId, sender, content]
            );

            if (!messageResult || messageResult.length === 0) {
                throw new Error('Failed to add message');
            }

            const message = messageResult[0];

            // Update the last updated timestamp on the ticket
            await query('UPDATE support_tickets SET updated_at = CURRENT_TIMESTAMP WHERE id = $1', [ticketId]);

            // Get user info to include in the response
            const user = await queryOne<User>('SELECT id, name, email FROM users WHERE id = $1', [userId]);

            return {
                success: true,
                message: {
                    ...message,
                    user: user || null
                }
            };
        } catch (error) {
            console.error('Error adding message:', error);

            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            };
        }
    },

    // Update ticket status
    async updateTicketStatus(
        ticketId: string,
        status: TicketStatus,
        userId: string,
        userName?: string
    ): Promise<{ success: boolean; error?: string }> {
        try {
            // Update the status
            await query('UPDATE support_tickets SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [
                status,
                ticketId
            ]);

            // Add a system message about the status change
            await query(
                `INSERT INTO ticket_messages (ticket_id, user_id, sender, content)
                VALUES ($1, $2, 'system', $3)`,
                [ticketId, userId, `Ticket status changed to ${status} by ${userName || 'User'}`]
            );

            return { success: true };
        } catch (error) {
            console.error('Error updating ticket status:', error);

            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            };
        }
    },

    // Check if a user has permission to access a ticket
    async hasTicketAccess(ticketId: string, userId: string, roles?: string[]): Promise<boolean> {
        try {
            // Admins and support agents have access to all tickets
            const isAdmin = roles?.includes('admin') || false;
            const isSupport = roles?.includes('support_agent') || false;

            if (isAdmin || isSupport) {
                return true;
            }

            // Otherwise, check if the ticket belongs to the user
            const ticket = await queryOne('SELECT user_id FROM support_tickets WHERE id = $1', [ticketId]);

            return ticket && ticket.user_id === userId;
        } catch (error) {
            console.error('Error checking ticket access:', error);

            return false;
        }
    }
};
