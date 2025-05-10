// app/api/notifications/[id]/read/route.ts
import { NextRequest, NextResponse } from 'next/server';

import { authOptions } from '@/lib/auth-options';
import { notificationService } from '@/lib/services/notification-service';

import { getServerSession } from 'next-auth/next';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const notificationId = params.id;
    if (!notificationId) {
        return NextResponse.json({ message: 'Notification ID is required' }, { status: 400 });
    }

    try {
        const success = await notificationService.markAsRead(notificationId, session.user.id);
        if (success) {
            return NextResponse.json({ message: 'Notification marked as read' });
        }
        // If not successful, it means either the notification doesn't exist or doesn't belong to the user

        return NextResponse.json(
            { message: 'Failed to mark notification as read or notification not found' },
            { status: 404 }
        );
    } catch (error) {
        console.error('Error marking notification as read:', error);

        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
