// lib/services/notification-service.ts
import { query, queryOne } from '@/lib/db';
import { Notification, NotificationType } from '@/types/notification';

export const notificationService = {
    /**
     * Creates a notification for a specific user.
     */
    async createNotification(
        userId: string,
        type: NotificationType,
        message: string,
        link?: string,
        relatedEntityId?: string // This should be the UUID of the ticket
    ): Promise<void> {
        try {
            await query(
                `INSERT INTO notifications (user_id, type, message, link, related_entity_id)
                 VALUES ($1, $2, $3, $4, $5)`,
                [userId, type, message, link, relatedEntityId]
            );
        } catch (error) {
            console.error(`Error creating notification for user ${userId}:`, error);
        }
    },

    /**
     * Creates notifications for all users belonging to specified roles.
     */
    async createNotificationForRoles(
        roleNames: string[],
        type: NotificationType,
        message: string,
        link?: string,
        relatedEntityId?: string // This should be the UUID of the ticket
    ): Promise<void> {
        try {
            const usersToNotify = await query<{ id: string }>(
                `SELECT u.id FROM users u
                 JOIN user_roles ur ON u.id = ur.user_id
                 JOIN roles r ON ur.role_id = r.id
                 WHERE r.name = ANY($1)`,
                [roleNames]
            );

            for (const user of usersToNotify) {
                await this.createNotification(user.id, type, message, link, relatedEntityId);
            }
        } catch (error) {
            console.error('Error creating notifications for roles:', error);
        }
    },

    /**
     * Retrieves notifications for a user, ordered by creation date (newest first).
     */
    async getNotifications(userId: string, limit: number = 10, offset: number = 0): Promise<Notification[]> {
        try {
            return await query<Notification>(
                `SELECT id, user_id as "userId", type, message, link, related_entity_id as "relatedEntityId", is_read as "isRead", created_at as "createdAt"
                 FROM notifications
                 WHERE user_id = $1
                 ORDER BY created_at DESC
                 LIMIT $2 OFFSET $3`,
                [userId, limit, offset]
            );
        } catch (error) {
            console.error(`Error fetching notifications for user ${userId}:`, error);

            return [];
        }
    },

    /**
     * Gets the count of unread notifications for a user.
     */
    async getUnreadNotificationCount(userId: string): Promise<number> {
        try {
            const result = await queryOne<{ count: string }>(
                `SELECT COUNT(*) FROM notifications
                 WHERE user_id = $1 AND is_read = FALSE`,
                [userId]
            );

            return result ? parseInt(result.count, 10) : 0;
        } catch (error) {
            console.error(`Error fetching unread notification count for user ${userId}:`, error);

            return 0;
        }
    },

    /**
     * Marks a specific notification as read for a user.
     */
    async markAsRead(notificationId: string, userId: string): Promise<boolean> {
        try {
            const result = await query(
                `UPDATE notifications
                 SET is_read = TRUE
                 WHERE id = $1 AND user_id = $2 RETURNING id`,
                [notificationId, userId]
            );

            return result.length > 0;
        } catch (error) {
            console.error(`Error marking notification ${notificationId} as read for user ${userId}:`, error);

            return false;
        }
    },

    /**
     * Marks all unread notifications as read for a user.
     */
    async markAllAsRead(userId: string): Promise<boolean> {
        try {
            await query(
                `UPDATE notifications
                 SET is_read = TRUE
                 WHERE user_id = $1 AND is_read = FALSE`,
                [userId]
            );

            return true;
        } catch (error) {
            console.error(`Error marking all notifications as read for user ${userId}:`, error);

            return false;
        }
    },

    /**
     * Deletes a specific notification. (Optional - not used in current UI)
     */
    async deleteNotification(notificationId: string, userId: string): Promise<boolean> {
        try {
            await query(
                `DELETE FROM notifications
                 WHERE id = $1 AND user_id = $2`,
                [notificationId, userId]
            );

            return true;
        } catch (error) {
            console.error(`Error deleting notification ${notificationId} for user ${userId}:`, error);

            return false;
        }
    }
};
