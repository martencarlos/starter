// types/notification.d.ts
export interface Notification {
    id: string;
    userId: string; // Recipient user_id
    type: string; // e.g., 'NEW_SUPPORT_TICKET', 'SUPPORT_TICKET_REPLY' - Consider making this NotificationType
    message: string;
    link?: string; // URL to navigate to, e.g., /support/tickets/uuid
    relatedEntityId?: string; // UUID of the related entity, e.g., ticket_id
    isRead: boolean;
    createdAt: string; // ISO date string
}

// It's good practice to use a union type for notification types for better type safety.
export type NotificationType =
    | 'NEW_SUPPORT_TICKET'
    | 'SUPPORT_TICKET_REPLY_FROM_USER'
    | 'SUPPORT_TICKET_REPLY_FROM_SUPPORT'
    | 'SUPPORT_TICKET_STATUS_CHANGE'
    | 'GENERIC_ALERT' // Example for other types of notifications
    | 'SYSTEM_MESSAGE'; // Example

// You can also define specific payload structures per notification type if needed in the future.
// For example:
// interface NewSupportTicketPayload { subject: string; ticketNumber: string; userName: string; }
// interface SupportTicketReplyPayload { ticketNumber: string; replierName: string; }

// And then your Notification interface could be more specific:
// export interface TypedNotification<T extends NotificationType, P = any> {
//     id: string;
//     userId: string;
//     type: T;
//     message: string; // Can be generated from payload or be generic
//     payload: P;
//     link?: string;
//     relatedEntityId?: string;
//     isRead: boolean;
//     createdAt: string;
// }
//
// Example usage of TypedNotification:
// const newTicketNotif: TypedNotification<'NEW_SUPPORT_TICKET', NewSupportTicketPayload> = { ... };

// For now, the simpler Notification interface is used in the current implementation.
// The NotificationType union is used in the notification-service.ts.
