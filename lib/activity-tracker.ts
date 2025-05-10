// lib/activity-tracker.ts
import { query } from '@/lib/db';

interface TrackActivityParams {
    userId: string;
    type:
        | 'login'
        | 'logout'
        | 'profile_update'
        | 'password_change'
        | 'role_change'
        | 'support_ticket'
        | 'preferences_update';
    details?: string;
    ipAddress?: string;
    userAgent?: string;
}

export async function trackUserActivity({ userId, type, details, ipAddress, userAgent }: TrackActivityParams) {
    try {
        await query(
            `
            INSERT INTO user_activity (user_id, type, ip_address, user_agent, details)
            VALUES ($1, $2, $3, $4, $5)
        `,
            [userId, type, ipAddress, userAgent, details]
        );

        return true;
    } catch (error) {
        console.error('Error tracking user activity:', error);

        return false;
    }
}
