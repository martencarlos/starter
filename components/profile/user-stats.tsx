// components/profile/user-stats.tsx
'use client';

import { useEffect, useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';

import { Calendar, FileText, MessageSquare, Shield } from 'lucide-react';

// components/profile/user-stats.tsx

interface UserStatsProps {
    userId: string;
}

interface StatsData {
    ticketsCreated: number;
    ticketsResolved: number;
    lastLoginDate: string | null;
    accountUtilization: number;
    supportResponseRate: number;
}

export function UserStats({ userId }: UserStatsProps) {
    const [stats, setStats] = useState<StatsData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                // This endpoint doesn't exist yet and would need to be implemented
                const response = await fetch(`/api/user/stats?userId=${userId}`);
                if (response.ok) {
                    const data = await response.json();
                    setStats(data);
                } else {
                    // For demo purposes, use placeholder data if the endpoint doesn't exist
                    setStats({
                        ticketsCreated: 5,
                        ticketsResolved: 3,
                        lastLoginDate: new Date().toISOString(),
                        accountUtilization: 65,
                        supportResponseRate: 92
                    });
                }
            } catch (error) {
                console.error('Error fetching user stats:', error);
                // Use placeholder data for demo
                setStats({
                    ticketsCreated: 5,
                    ticketsResolved: 3,
                    lastLoginDate: new Date().toISOString(),
                    accountUtilization: 65,
                    supportResponseRate: 92
                });
            } finally {
                setIsLoading(false);
            }
        }

        fetchStats();
    }, [userId]);

    if (isLoading) {
        return (
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
                {[...Array(4)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader className='pb-2'>
                            <Skeleton className='h-4 w-24' />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className='h-8 w-16' />
                            <Skeleton className='mt-2 h-4 w-32' />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
            <Card>
                <CardHeader className='pb-2'>
                    <CardTitle className='flex items-center text-sm font-medium'>
                        <MessageSquare className='mr-2 h-4 w-4 text-blue-500' />
                        Support Tickets
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='text-2xl font-bold'>{stats?.ticketsCreated || 0}</div>
                    <p className='text-muted-foreground mt-1 text-xs'>{stats?.ticketsResolved || 0} resolved</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className='pb-2'>
                    <CardTitle className='flex items-center text-sm font-medium'>
                        <Calendar className='mr-2 h-4 w-4 text-green-500' />
                        Last Login
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='text-sm font-medium'>
                        {stats?.lastLoginDate ? new Date(stats.lastLoginDate).toLocaleDateString() : 'N/A'}
                    </div>
                    <p className='text-muted-foreground mt-1 text-xs'>
                        {stats?.lastLoginDate ? new Date(stats.lastLoginDate).toLocaleTimeString() : 'Never'}
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className='pb-2'>
                    <CardTitle className='flex items-center text-sm font-medium'>
                        <Shield className='mr-2 h-4 w-4 text-purple-500' />
                        Account Utilization
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='flex items-center gap-2'>
                        <div className='font-bold'>{stats?.accountUtilization || 0}%</div>
                        <Progress value={stats?.accountUtilization || 0} className='h-2' />
                    </div>
                    <p className='text-muted-foreground mt-1 text-xs'>Based on feature usage and activity</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className='pb-2'>
                    <CardTitle className='flex items-center text-sm font-medium'>
                        <FileText className='mr-2 h-4 w-4 text-orange-500' />
                        Response Rate
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='flex items-center gap-2'>
                        <div className='font-bold'>{stats?.supportResponseRate || 0}%</div>
                        <Progress value={stats?.supportResponseRate || 0} className='h-2' />
                    </div>
                    <p className='text-muted-foreground mt-1 text-xs'>Support ticket response rate</p>
                </CardContent>
            </Card>
        </div>
    );
}
