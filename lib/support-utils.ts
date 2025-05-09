// lib/support-utils.ts
import { z } from 'zod';

// Define ticket status type
export type TicketStatus = 'open' | 'pending' | 'resolved' | 'closed';

// Define ticket category type
export type TicketCategory = 'general' | 'account' | 'billing' | 'technical' | 'other';

// Define message sender type
export type MessageSender = 'user' | 'support' | 'system';

// Define ticket data interface
export interface Ticket {
    id: string;
    ticketNumber: string;
    subject: string;
    status: TicketStatus;
    category: TicketCategory;
    createdAt: string;
    lastUpdated: string;
    userId: string;
    messages?: Message[];
    messageCount?: number;
}

// Define message data interface
export interface Message {
    id: string;
    content: string;
    sender: MessageSender;
    timestamp: string;
    userId?: string;
}

// Status badge variant mapping
export const statusVariants = {
    open: 'default',
    pending: 'secondary',
    resolved: 'outline',
    closed: 'secondary'
} as const;

// Category names mapping
export const categoryNames = {
    general: 'General Inquiry',
    account: 'Account Issue',
    billing: 'Billing & Payments',
    technical: 'Technical Problem',
    other: 'Other'
} as const;

// Ticket validation schema
export const ticketSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters long' }),
    email: z.string().email({ message: 'Please enter a valid email address' }),
    subject: z.string().min(5, { message: 'Subject must be at least 5 characters long' }),
    category: z.enum(['general', 'account', 'billing', 'technical', 'other'], {
        required_error: 'Please select a category'
    }),
    message: z.string().min(10, { message: 'Message must be at least 10 characters long' })
});

// Message validation schema
export const messageSchema = z.object({
    content: z.string().min(1, { message: 'Message content is required' })
});

// Format date to readable format
export function formatDate(dateString: string, options?: Intl.DateTimeFormatOptions): string {
    const date = new Date(dateString);
    const defaultOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    };

    return date.toLocaleDateString(undefined, options || defaultOptions);
}

// Format date with time
export function formatDateTime(dateString: string): string {
    const date = new Date(dateString);

    return date.toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Calculate time difference in a human-readable format
export function timeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.round(diffMs / 1000);
    const diffMin = Math.round(diffSec / 60);
    const diffHour = Math.round(diffMin / 60);
    const diffDay = Math.round(diffHour / 24);

    if (diffSec < 60) return 'just now';
    if (diffMin < 60) return `${diffMin} minute${diffMin !== 1 ? 's' : ''} ago`;
    if (diffHour < 24) return `${diffHour} hour${diffHour !== 1 ? 's' : ''} ago`;
    if (diffDay < 30) return `${diffDay} day${diffDay !== 1 ? 's' : ''} ago`;

    return formatDate(dateString);
}
