// app/api/user/delete-account/route.ts
import { NextRequest, NextResponse } from 'next/server';

import { authOptions } from '@/lib/auth-options';
import { query, queryOne } from '@/lib/db';

import { getServerSession } from 'next-auth/next';

export async function DELETE(req: NextRequest) {
    try {
        // Check authentication
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.user.id;

        // Check if this is an OAuth account (Google)
        const user = await queryOne('SELECT oauth_provider FROM users WHERE id = $1', [userId]);

        if (user?.oauth_provider) {
            return NextResponse.json(
                {
                    message: 'Accounts linked to external providers must be deleted through that provider'
                },
                { status: 400 }
            );
        }

        // Start account deletion process
        await query('BEGIN');

        try {
            // Delete notifications
            await query('DELETE FROM notifications WHERE user_id = $1', [userId]);

            // Delete user's support tickets messages
            await query(
                `
                DELETE FROM ticket_messages
                WHERE ticket_id IN (SELECT id FROM support_tickets WHERE user_id = $1)
            `,
                [userId]
            );

            // Delete user's support tickets
            await query('DELETE FROM support_tickets WHERE user_id = $1', [userId]);

            // Delete sessions
            await query('DELETE FROM user_sessions WHERE user_id = $1', [userId]);

            // Delete role assignments and history
            await query('DELETE FROM user_roles WHERE user_id = $1', [userId]);
            await query('DELETE FROM role_assignment_history WHERE user_id = $1', [userId]);

            // Delete verification tokens
            await query('DELETE FROM email_verification WHERE user_id = $1', [userId]);
            await query('DELETE FROM password_reset WHERE user_id = $1', [userId]);

            // Finally, delete the user account
            await query('DELETE FROM users WHERE id = $1', [userId]);

            await query('COMMIT');

            return NextResponse.json({ message: 'Account deleted successfully' });
        } catch (error) {
            await query('ROLLBACK');
            throw error;
        }
    } catch (error) {
        console.error('Error deleting account:', error);

        return NextResponse.json({ message: 'Failed to delete account' }, { status: 500 });
    }
}
