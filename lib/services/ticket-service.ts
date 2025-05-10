// lib/services/ticket-service.ts
import { query, queryOne } from '@/lib/db';
import { NotificationType } from '@/types/notification';

import { notificationService } from './notification-service';

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
    userId: string; // This is the UUID of the user who created the ticket, if they were logged in
    name: string; // Name provided at ticket creation (guest or logged-in user's name)
    email: string; // Email provided at ticket creation (guest or logged-in user's email)
    messages?: Message[];
    messageCount?: number;
}

export interface TicketCreateData {
    name: string;
    email: string;
    subject: string;
    category: TicketCategory;
    message: string;
    userId?: string | null; // UUID of the logged-in user, if any
}

// Ticket service
export const ticketService = {
    // Create a new ticket
    async createTicket(
        data: TicketCreateData
    ): Promise<{ success: boolean; ticketId?: string; ticketNumericId?: string; error?: string }> {
        try {
            let ticketResult;
            try {
                ticketResult = await query<{ id: string; ticket_number: string }>(
                    `INSERT INTO support_tickets
                    (user_id, subject, category, status, created_by_name, created_by_email)
                    VALUES ($1, $2, $3, 'open', $4, $5)
                    RETURNING id, ticket_number`,
                    [data.userId || null, data.subject, data.category, data.name, data.email]
                );
            } catch (err) {
                console.log('First schema attempt failed, trying alternative schema...');
                ticketResult = await query<{ id: string; ticket_number: string }>(
                    `INSERT INTO support_tickets
                    (user_id, subject, category, status)
                    VALUES ($1, $2, $3, 'open')
                    RETURNING id, ticket_number`,
                    [data.userId || null, data.subject, data.category]
                );
                await query(
                    `INSERT INTO ticket_contact_info
                    (ticket_id, name, email)
                    VALUES ($1, $2, $3)`,
                    [ticketResult[0].id, data.name, data.email]
                );
            }

            if (ticketResult && ticketResult.length > 0) {
                const createdTicket = ticketResult[0];
                const ticketUUID = createdTicket.id;
                const ticketNumericId = createdTicket.ticket_number;

                await query(
                    `INSERT INTO ticket_messages
                    (ticket_id, user_id, sender, content)
                    VALUES ($1, $2, 'user', $3)`,
                    [ticketUUID, data.userId || null, data.message]
                );
                await query(`UPDATE support_tickets SET updated_at = CURRENT_TIMESTAMP WHERE id = $1`, [ticketUUID]);

                const message = `New ticket #${ticketNumericId} ("${data.subject.substring(0, 30)}...") submitted by ${data.name}.`;
                const link = `/support/tickets/${ticketUUID}`;
                await notificationService.createNotificationForRoles(
                    ['admin', 'support_agent'],
                    'NEW_SUPPORT_TICKET' as NotificationType,
                    message,
                    link,
                    ticketUUID
                );

                return {
                    success: true,
                    ticketId: ticketUUID,
                    ticketNumericId: ticketNumericId
                };
            }
            throw new Error('Failed to retrieve created ticket details for notification.');
        } catch (error) {
            console.error('Error creating ticket:', error);

            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            };
        }
    },

    async getTicketById(id: string): Promise<Ticket | null> {
        try {
            const ticket = await queryOne<Ticket>( // Ensure Ticket type matches the SELECTed columns
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
            const messagesResult = await queryOne<{ messages: Message[] }>(
                `SELECT json_agg(
                    json_build_object(
                        'id', m.id,
                        'content', m.content,
                        'sender', m.sender,
                        'timestamp', m.created_at,
                        'user', CASE
                            WHEN m.user_id IS NOT NULL THEN
                                json_build_object(
                                    'id', u.id,
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

            return {
                ...ticket,
                messages: messagesResult?.messages || []
            };
        } catch (error) {
            console.error('Error getting ticket:', error);

            return null;
        }
    },

    async getUserTickets(userId: string, status?: TicketStatus, roles?: string[]): Promise<Ticket[]> {
        try {
            const isAdminOrSupport = roles?.includes('admin') || roles?.includes('support_agent') || false;
            const queryParams: any[] = [];
            let userCondition = '';
            let statusCondition = '';
            let paramIndex = 1;

            if (!isAdminOrSupport) {
                userCondition = `WHERE t.user_id = $${paramIndex++}`;
                queryParams.push(userId);
            }
            if (status) {
                statusCondition =
                    isAdminOrSupport && !userCondition
                        ? `WHERE t.status = $${paramIndex++}`
                        : `AND t.status = $${paramIndex++}`;
                queryParams.push(status);
            }
            const tickets = await query<Ticket>(
                `SELECT t.id, t.ticket_number as "ticketNumber", t.subject, t.category, t.status,
                t.created_at as "createdAt", t.updated_at as "lastUpdated", t.user_id as "userId",
                COALESCE(t.created_by_name, c.name) as name,
                COALESCE(t.created_by_email, c.email) as email,
                (SELECT COUNT(*) FROM ticket_messages WHERE ticket_id = t.id) as "messageCount"
            FROM support_tickets t
            LEFT JOIN ticket_contact_info c ON t.id = c.ticket_id
            ${userCondition} ${statusCondition}
            ORDER BY t.updated_at DESC`,
                queryParams
            );

            return tickets;
        } catch (error) {
            console.error('Error getting user tickets:', error);

            return [];
        }
    },

    async addMessage(
        ticketId: string, // This is the UUID of the ticket
        userId: string,
        content: string,
        sender: MessageSender
    ): Promise<{ success: boolean; message?: Message; error?: string }> {
        try {
            const messageResult = await query(
                `INSERT INTO ticket_messages (ticket_id, user_id, sender, content)
                VALUES ($1, $2, $3, $4)
                RETURNING id, content, sender, created_at as timestamp`,
                [ticketId, userId, sender, content]
            );
            if (!messageResult || messageResult.length === 0) {
                throw new Error('Failed to add message');
            }
            const createdMessage = messageResult[0];
            await query('UPDATE support_tickets SET updated_at = CURRENT_TIMESTAMP WHERE id = $1', [ticketId]);
            const messageAuthor = await queryOne<User>('SELECT id, name, email FROM users WHERE id = $1', [userId]);
            const fullMessageDetails = { ...createdMessage, user: messageAuthor || null };

            const ticketInfo = await queryOne<{
                id: string;
                subject: string;
                ticket_number: string;
                user_id: string | null;
            }>('SELECT id, subject, ticket_number, user_id FROM support_tickets WHERE id = $1', [ticketId]);

            if (ticketInfo) {
                const link = `/support/tickets/${ticketInfo.id}`;
                const notifMessageBase = `Ticket #${ticketInfo.ticket_number} ("${ticketInfo.subject.substring(0, 30)}..."): `;

                if (sender === 'user') {
                    const notifMessage = `${notifMessageBase} New reply from user ${messageAuthor?.name || 'User'}.`;
                    await notificationService.createNotificationForRoles(
                        ['admin', 'support_agent'],
                        'SUPPORT_TICKET_REPLY_FROM_USER' as NotificationType,
                        notifMessage,
                        link,
                        ticketInfo.id
                    );
                } else if (sender === 'support' && ticketInfo.user_id) {
                    if (ticketInfo.user_id !== userId) {
                        const notifMessage = `${notifMessageBase} New reply from support.`;
                        await notificationService.createNotification(
                            ticketInfo.user_id,
                            'SUPPORT_TICKET_REPLY_FROM_SUPPORT' as NotificationType,
                            notifMessage,
                            link,
                            ticketInfo.id
                        );
                    }
                }
            }

            return {
                success: true,
                message: fullMessageDetails
            };
        } catch (error) {
            console.error('Error adding message:', error);

            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            };
        }
    },

    async updateTicketStatus(
        ticketId: string,
        status: TicketStatus,
        userId: string,
        userName?: string
    ): Promise<{ success: boolean; error?: string }> {
        try {
            const ticketInfo = await queryOne<{
                id: string;
                subject: string;
                ticket_number: string;
                user_id: string | null;
            }>('SELECT id, subject, ticket_number, user_id FROM support_tickets WHERE id = $1', [ticketId]);
            if (!ticketInfo) {
                return { success: false, error: 'Ticket not found for status update notification.' };
            }
            await query('UPDATE support_tickets SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [
                status,
                ticketId
            ]);
            const systemMessageContent = `Ticket status changed to ${status} by ${userName || 'User'}`;
            await query(
                `INSERT INTO ticket_messages (ticket_id, user_id, sender, content)
                VALUES ($1, $2, 'system', $3)`,
                [ticketId, userId, systemMessageContent]
            );
            if (ticketInfo.user_id && ticketInfo.user_id !== userId) {
                const link = `/support/tickets/${ticketInfo.id}`;
                const notifMessage = `Ticket #${ticketInfo.ticket_number} ("${ticketInfo.subject.substring(0, 30)}...") status changed to ${status}.`;
                await notificationService.createNotification(
                    ticketInfo.user_id,
                    'SUPPORT_TICKET_STATUS_CHANGE' as NotificationType,
                    notifMessage,
                    link,
                    ticketInfo.id
                );
            }

            return { success: true };
        } catch (error) {
            console.error('Error updating ticket status:', error);

            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            };
        }
    },

    async hasTicketAccess(ticketId: string, userId: string, roles?: string[]): Promise<boolean> {
        try {
            const isAdmin = roles?.includes('admin') || false;
            const isSupport = roles?.includes('support_agent') || false;

            if (isAdmin || isSupport) {
                return true;
            }
            const ticket = await queryOne('SELECT user_id FROM support_tickets WHERE id = $1', [ticketId]);

            return !!ticket && ticket.user_id === userId;
        } catch (error) {
            console.error('Error checking ticket access:', error);

            return false;
        }
    }
};
