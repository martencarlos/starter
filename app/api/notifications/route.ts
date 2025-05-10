// app/api/notifications/route.ts
import { NextRequest, NextResponse } from 'next/server';

import { authOptions } from '@/lib/auth-options';
import { notificationService } from '@/lib/services/notification-service';

import { getServerSession } from 'next-auth/next';

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const fetchCountOnly = searchParams.get('countOnly') === 'true';
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    try {
        if (fetchCountOnly) {
            const count = await notificationService.getUnreadNotificationCount(session.user.id);

            return NextResponse.json({ count });
        } else {
            const notifications = await notificationService.getNotifications(session.user.id, limit, offset);
            const unreadCount = await notificationService.getUnreadNotificationCount(session.user.id); // Also return count with full list

            return NextResponse.json({ notifications, unreadCount });
        }
    } catch (error) {
        console.error('Error fetching notifications:', error);

        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
