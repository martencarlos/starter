// hooks/use-notifications.ts
'use client';

import React, { ReactNode, createContext, useCallback, useContext, useEffect, useState } from 'react';

import { Notification } from '@/types/notification';

import { useSession } from 'next-auth/react';

// hooks/use-notifications.ts

// hooks/use-notifications.ts

// hooks/use-notifications.ts

// Ensure this path is correct and Notification type is valid

interface NotificationsContextType {
    notifications: Notification[];
    unreadCount: number;
    isLoading: boolean;
    fetchNotifications: (isBackgroundFetch?: boolean) => Promise<void>;
    markNotificationAsRead: (notificationId: string) => Promise<void>;
    markAllNotificationsAsRead: () => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const useNotifications = (): NotificationsContextType => {
    const context = useContext(NotificationsContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationsProvider');
    }

    return context;
};

interface NotificationsProviderProps {
    children: ReactNode;
    initialUnreadCount?: number;
}

export const NotificationsProvider: React.FC<NotificationsProviderProps> = ({ children, initialUnreadCount = 0 }) => {
    const { data: session, status: sessionStatus } = useSession();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState<number>(initialUnreadCount);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const fetchNotifications = useCallback(
        async (isBackgroundFetch = false) => {
            if (sessionStatus !== 'authenticated' || !session?.user?.id) {
                setNotifications([]);
                setUnreadCount(0);
                setIsLoading(false);

                return;
            }
            if (!isBackgroundFetch) setIsLoading(true);

            try {
                const response = await fetch('/api/notifications');
                if (!response.ok) {
                    console.warn(`Failed to fetch notifications: ${response.status} ${response.statusText}`);
                    if (response.status === 401) {
                        setNotifications([]);
                        setUnreadCount(0);
                    }
                    // Consider not throwing for non-critical errors to keep UI stable

                    return;
                }
                const data = await response.json();
                setNotifications(data.notifications || []);
                setUnreadCount(data.unreadCount || 0);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            } finally {
                if (!isBackgroundFetch) setIsLoading(false);
            }
        },
        [session?.user?.id, sessionStatus]
    );

    const markNotificationAsRead = async (notificationId: string) => {
        if (sessionStatus !== 'authenticated') return;

        const previousNotifications = [...notifications];
        const previousUnreadCount = unreadCount;

        const notificationToUpdate = notifications.find((n) => n.id === notificationId);
        let wasUnread = false;
        if (notificationToUpdate && !notificationToUpdate.isRead) {
            wasUnread = true;
        }

        setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n)));
        if (wasUnread) {
            setUnreadCount((prev) => Math.max(0, prev - 1));
        }

        try {
            const response = await fetch(`/api/notifications/${notificationId}/read`, { method: 'PATCH' });
            if (!response.ok) {
                setNotifications(previousNotifications);
                if (wasUnread) setUnreadCount(previousUnreadCount);
                console.error('Failed to mark notification as read on server:', await response.text());
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
            setNotifications(previousNotifications);
            if (wasUnread) setUnreadCount(previousUnreadCount);
        }
    };

    const markAllNotificationsAsRead = async () => {
        if (sessionStatus !== 'authenticated' || unreadCount === 0) return;

        const previousNotifications = [...notifications];
        const previousUnreadCount = unreadCount;

        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setUnreadCount(0);

        try {
            const response = await fetch('/api/notifications/mark-all-read', { method: 'PATCH' });
            if (!response.ok) {
                setNotifications(previousNotifications);
                setUnreadCount(previousUnreadCount);
                console.error('Failed to mark all notifications as read on server:', await response.text());
            }
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
            setNotifications(previousNotifications);
            setUnreadCount(previousUnreadCount);
        }
    };

    useEffect(() => {
        if (sessionStatus === 'authenticated') {
            setIsLoading(true);
            fetchNotifications(false).finally(() => setIsLoading(false));
        } else if (sessionStatus === 'unauthenticated') {
            setNotifications([]);
            setUnreadCount(0);
            setIsLoading(false);
        }
    }, [sessionStatus, session?.user?.id]); // Added session?.user?.id to re-fetch if user changes

    useEffect(() => {
        if (sessionStatus === 'authenticated') {
            // This ensures that the initial server-fetched count is preferred if available
            // and the client-side state aligns with it upon hydration.
            if (initialUnreadCount !== unreadCount && notifications.length === 0) {
                // Apply only if notifications not yet loaded
                setUnreadCount(initialUnreadCount);
            }
        }
    }, [initialUnreadCount, sessionStatus, unreadCount, notifications.length]);

    useEffect(() => {
        let intervalId: NodeJS.Timeout;
        if (sessionStatus === 'authenticated') {
            intervalId = setInterval(() => {
                fetchNotifications(true);
            }, 60000);
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [sessionStatus, fetchNotifications]);

    const contextValue = {
        notifications,
        unreadCount,
        isLoading,
        fetchNotifications,
        markNotificationAsRead,
        markAllNotificationsAsRead
    };

    return <NotificationsContext.Provider value={contextValue}>{children}</NotificationsContext.Provider>;
};
