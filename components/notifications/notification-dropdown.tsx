// components/notifications/notification-dropdown.tsx
'use client';

import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { useNotifications } from '@/hooks/use-notifications';

import { NotificationBell } from './notification-bell';
import { NotificationItem } from './notification-item';
import { BellOff, CheckCheck } from 'lucide-react';
import { useSession } from 'next-auth/react';

// components/notifications/notification-dropdown.tsx

export const NotificationDropdown: React.FC = () => {
    const { notifications, unreadCount, isLoading, fetchNotifications, markAllNotificationsAsRead } =
        useNotifications();
    const [isOpen, setIsOpen] = useState(false);
    const { status: sessionStatus } = useSession();

    useEffect(() => {
        if (isOpen && sessionStatus === 'authenticated') {
            fetchNotifications(true);
        }
    }, [isOpen, fetchNotifications, sessionStatus]);

    if (sessionStatus === 'loading') {
        return <NotificationBell />;
    }

    if (sessionStatus !== 'authenticated') {
        return null;
    }

    const handleMarkAllRead = async (e: React.MouseEvent) => {
        e.stopPropagation();
        await markAllNotificationsAsRead();
    };

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <NotificationBell />
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-80 sm:w-96'>
                <DropdownMenuLabel className='flex items-center justify-between p-3'>
                    <span className='font-semibold'>Notifications</span>
                    {unreadCount > 0 && (
                        <Button
                            variant='ghost'
                            size='sm'
                            onClick={handleMarkAllRead}
                            className='h-auto px-2 py-1 text-xs'>
                            <CheckCheck className='mr-1 h-3 w-3' /> Mark all as read
                        </Button>
                    )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <ScrollArea className='max-h-80'>
                    {isLoading && notifications.length === 0 ? (
                        <div className='space-y-2 p-2'>
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className='flex items-center gap-2 p-2'>
                                    <Skeleton className='h-8 w-8 rounded-full' />
                                    <div className='flex-grow space-y-1'>
                                        <Skeleton className='h-4 w-3/4' />
                                        <Skeleton className='h-3 w-1/2' />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className='text-muted-foreground p-6 text-center text-sm'>
                            <BellOff className='mx-auto mb-2 h-10 w-10' />
                            No new notifications.
                        </div>
                    ) : (
                        notifications.map((notification) => (
                            <NotificationItem
                                key={notification.id}
                                notification={notification}
                                onCloseDropdown={() => setIsOpen(false)}
                            />
                        ))
                    )}
                </ScrollArea>
                {notifications.length > 0 && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className='text-muted-foreground cursor-default justify-center p-2 text-sm focus:bg-transparent'>
                            {isLoading ? 'Loading...' : 'End of notifications'}
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
