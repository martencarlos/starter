// components/notifications/notification-item.tsx
'use client';

import React from 'react';

import { useRouter } from 'next/navigation';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useNotifications } from '@/hooks/use-notifications';
import { timeAgo } from '@/lib/support-utils';
import { cn } from '@/lib/utils';
import { Notification } from '@/types/notification';

import { AlertTriangle, BellRing, MessageSquare, TicketIcon } from 'lucide-react';

// components/notifications/notification-item.tsx

interface NotificationItemProps {
    notification: Notification;
    onCloseDropdown: () => void;
}

const getIconForType = (type: string) => {
    switch (type) {
        case 'NEW_SUPPORT_TICKET':
            return <TicketIcon className='h-4 w-4 text-blue-500' />;
        case 'SUPPORT_TICKET_REPLY_FROM_USER':
        case 'SUPPORT_TICKET_REPLY_FROM_SUPPORT':
            return <MessageSquare className='h-4 w-4 text-green-500' />;
        case 'SUPPORT_TICKET_STATUS_CHANGE':
            return <AlertTriangle className='h-4 w-4 text-orange-500' />;
        default:
            return <BellRing className='h-4 w-4 text-gray-500' />;
    }
};

export const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onCloseDropdown }) => {
    const router = useRouter();
    const { markNotificationAsRead } = useNotifications();

    const handleClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (!notification.isRead) {
            await markNotificationAsRead(notification.id);
        }
        if (notification.link) {
            router.push(notification.link);
        }
        onCloseDropdown();
    };

    return (
        <DropdownMenuItem
            onClick={handleClick}
            className={cn(
                'focus:bg-accent text-popover-foreground focus:text-accent-foreground flex cursor-pointer items-start gap-3 p-3',
                !notification.isRead && 'bg-accent/60 dark:bg-accent/30'
            )}>
            <div className='mt-1 flex-shrink-0'>{getIconForType(notification.type)}</div>
            <div className='flex-grow overflow-hidden'>
                <p
                    className={cn(
                        'truncate text-sm leading-snug',
                        !notification.isRead && 'text-primary dark:text-primary-foreground/90 font-semibold'
                    )}>
                    {notification.message}
                </p>
                <p className='text-muted-foreground mt-1 text-xs'>{timeAgo(notification.createdAt)}</p>
            </div>
            {!notification.isRead && (
                <div className='ml-2 h-2 w-2 flex-shrink-0 self-center rounded-full bg-blue-500'></div>
            )}
        </DropdownMenuItem>
    );
};
