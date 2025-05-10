// app/api/notifications/mark-all-read/route.ts
import { NextRequest, NextResponse } from 'next/server';

import { authOptions } from '@/lib/auth-options';
import { notificationService } from '@/lib/services/notification-service';

import { getServerSession } from 'next-auth/next';

export async function PATCH(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const success = await notificationService.markAllAsRead(session.user.id);
        if (success) {
            return NextResponse.json({ message: 'All notifications marked as read' });
        }
        // This case should ideally not happen unless there's a DB error not caught by the service

        return NextResponse.json({ message: 'Failed to mark all notifications as read' }, { status: 500 });
    } catch (error) {
        console.error('Error marking all notifications as read:', error);

        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
