// app/api/user/preferences/route.ts
import { NextRequest, NextResponse } from 'next/server';

import { authOptions } from '@/lib/auth-options';
import { query, queryOne } from '@/lib/db';

import { getServerSession } from 'next-auth/next';

export async function GET(req: NextRequest) {
    try {
        // Check authentication
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.user.id;

        // Check if user has preferences saved
        const userPreferences = await queryOne('SELECT preferences FROM user_preferences WHERE user_id = $1', [userId]);

        if (!userPreferences) {
            // Return default preferences if none are set
            return NextResponse.json({
                preferences: {
                    emailNotifications: true,
                    marketingEmails: false,
                    supportTicketUpdates: true,
                    securityAlerts: true,
                    timezone: 'Europe/Madrid',
                    dateFormat: 'DD/MM/YYYY',
                    extendedSession: false
                }
            });
        }

        return NextResponse.json({ preferences: userPreferences.preferences });
    } catch (error) {
        console.error('Error fetching preferences:', error);

        return NextResponse.json({ message: 'Failed to fetch preferences' }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        // Check authentication
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.user.id;
        const body = await req.json();

        // Validate body has preferences
        if (!body.preferences) {
            return NextResponse.json({ message: 'Preferences are required' }, { status: 400 });
        }

        // Save or update preferences
        await query(
            `
            INSERT INTO user_preferences (user_id, preferences)
            VALUES ($1, $2)
            ON CONFLICT (user_id)
            DO UPDATE SET preferences = $2, updated_at = CURRENT_TIMESTAMP
        `,
            [userId, body.preferences]
        );

        // Add activity record for the preference change
        await query(
            `
            INSERT INTO user_activity (user_id, type, details)
            VALUES ($1, 'preferences_update', 'Updated account preferences')
        `,
            [userId]
        );

        return NextResponse.json({ message: 'Preferences updated successfully' });
    } catch (error) {
        console.error('Error updating preferences:', error);

        return NextResponse.json({ message: 'Failed to update preferences' }, { status: 500 });
    }
}
