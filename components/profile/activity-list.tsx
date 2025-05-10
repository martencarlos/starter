// components/profile/activity-list.tsx
'use client';

import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

import { LogIn, LogOut, MessageSquare, RefreshCw, Settings, Shield } from 'lucide-react';

// components/profile/activity-list.tsx

interface ActivityItem {
    id: string;
    type: 'login' | 'logout' | 'profile_update' | 'password_change' | 'role_change' | 'support_ticket';
    timestamp: string;
    ipAddress?: string;
    userAgent?: string;
    details?: string;
}

interface ActivityListProps {
    userId: string;
}

export function ActivityList({ userId }: ActivityListProps) {
    const [activities, setActivities] = useState<ActivityItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchActivity() {
            try {
                // This endpoint doesn't exist yet and would need to be implemented
                const response = await fetch(`/api/user/activity?userId=${userId}`);
                if (response.ok) {
                    const data = await response.json();
                    setActivities(data.activities);
                } else {
                    // For demo purposes, use placeholder data if the endpoint doesn't exist
                    setActivities([
                        {
                            id: '1',
                            type: 'login',
                            timestamp: new Date().toISOString(),
                            ipAddress: '192.168.1.1',
                            userAgent: 'Chrome/95.0.4638.69'
                        },
                        {
                            id: '2',
                            type: 'profile_update',
                            timestamp: new Date(Date.now() - 86400000).toISOString(),
                            details: 'Updated profile name'
                        },
                        {
                            id: '3',
                            type: 'support_ticket',
                            timestamp: new Date(Date.now() - 172800000).toISOString(),
                            details: 'Created new support ticket #ST-12345'
                        },
                        {
                            id: '4',
                            type: 'password_change',
                            timestamp: new Date(Date.now() - 604800000).toISOString()
                        },
                        {
                            id: '5',
                            type: 'logout',
                            timestamp: new Date(Date.now() - 604800000 + 3600000).toISOString()
                        }
                    ]);
                }
            } catch (error) {
                console.error('Error fetching user activity:', error);
                // Use placeholder data for demo
                setActivities([
                    {
                        id: '1',
                        type: 'login',
                        timestamp: new Date().toISOString(),
                        ipAddress: '192.168.1.1',
                        userAgent: 'Chrome/95.0.4638.69'
                    },
                    {
                        id: '2',
                        type: 'profile_update',
                        timestamp: new Date(Date.now() - 86400000).toISOString(),
                        details: 'Updated profile name'
                    },
                    {
                        id: '3',
                        type: 'support_ticket',
                        timestamp: new Date(Date.now() - 172800000).toISOString(),
                        details: 'Created new support ticket #ST-12345'
                    }
                ]);
            } finally {
                setIsLoading(false);
            }
        }

        fetchActivity();
    }, [userId]);

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'login':
                return <LogIn className='h-4 w-4 text-green-500' />;
            case 'logout':
                return <LogOut className='h-4 w-4 text-orange-500' />;
            case 'profile_update':
                return <Settings className='h-4 w-4 text-blue-500' />;
            case 'password_change':
                return <Shield className='h-4 w-4 text-purple-500' />;
            case 'role_change':
                return <RefreshCw className='h-4 w-4 text-yellow-500' />;
            case 'support_ticket':
                return <MessageSquare className='h-4 w-4 text-indigo-500' />;
            default:
                return <LogIn className='h-4 w-4' />;
        }
    };

    const getActivityLabel = (type: string) => {
        switch (type) {
            case 'login':
                return 'Account Login';
            case 'logout':
                return 'Account Logout';
            case 'profile_update':
                return 'Profile Updated';
            case 'password_change':
                return 'Password Changed';
            case 'role_change':
                return 'Roles Updated';
            case 'support_ticket':
                return 'Support Ticket';
            default:
                return 'Activity';
        }
    };

    if (isLoading) {
        return (
            <div className='space-y-4'>
                <h2 className='text-xl font-semibold'>Account Activity</h2>
                <p className='text-muted-foreground text-sm'>Recent activity on your account</p>
                <div className='space-y-3'>
                    {[...Array(3)].map((_, i) => (
                        <Card key={i}>
                            <CardContent className='flex items-center justify-between p-4'>
                                <div className='flex items-center gap-3'>
                                    <Skeleton className='h-8 w-8 rounded-full' />
                                    <div>
                                        <Skeleton className='h-4 w-40' />
                                        <Skeleton className='mt-1 h-3 w-24' />
                                    </div>
                                </div>
                                <Skeleton className='h-4 w-20' />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className='space-y-4'>
            <h2 className='text-xl font-semibold'>Account Activity</h2>
            <p className='text-muted-foreground text-sm'>Recent activity on your account</p>

            {activities.length === 0 ? (
                <div className='rounded-lg border p-6 text-center'>
                    <p className='text-muted-foreground'>No recent activity found</p>
                </div>
            ) : (
                <div className='space-y-3'>
                    {activities.map((activity) => (
                        <Card key={activity.id}>
                            <CardContent className='flex flex-col justify-between gap-2 p-4 sm:flex-row sm:items-center'>
                                <div className='flex items-center gap-3'>
                                    <div className='bg-muted rounded-full p-2'>{getActivityIcon(activity.type)}</div>
                                    <div>
                                        <div className='flex items-center gap-2 font-medium'>
                                            {getActivityLabel(activity.type)}
                                            <Badge variant='outline' className='ml-2'>
                                                {new Date(activity.timestamp).toLocaleDateString()}
                                            </Badge>
                                        </div>
                                        {activity.details && (
                                            <p className='text-muted-foreground text-sm'>{activity.details}</p>
                                        )}
                                        {activity.ipAddress && (
                                            <p className='text-muted-foreground text-xs'>IP: {activity.ipAddress}</p>
                                        )}
                                    </div>
                                </div>
                                <div className='text-muted-foreground ml-11 text-xs sm:ml-0'>
                                    {new Date(activity.timestamp).toLocaleTimeString()}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
