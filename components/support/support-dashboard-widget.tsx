// components/support/support-dashboard-widget.tsx
'use client';

import { useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { SupportProvider, useSupport } from '@/components/support/support-context';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import { RefreshCw, TicketIcon } from 'lucide-react';

// components/support/support-dashboard-widget.tsx

interface SupportDashboardWidgetProps {
    userId: string;
}

export function SupportDashboardWidget({ userId }: SupportDashboardWidgetProps) {
    return (
        <SupportProvider userId={userId}>
            <SupportDashboardContent />
        </SupportProvider>
    );
}

function SupportDashboardContent() {
    const { tickets, isLoading, error, refreshTickets } = useSupport();
    const [refreshing, setRefreshing] = useState(false);
    const router = useRouter();

    // Format date to readable format
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);

        return date.toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric'
        });
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await refreshTickets();
        setRefreshing(false);
    };

    const handleNewTicket = () => {
        router.push('/support?tab=contact');
    };

    // Filter for active tickets
    const activeTickets = tickets.filter((ticket) => ticket.status === 'open' || ticket.status === 'pending');

    return (
        <Card>
            <CardHeader className='pb-3'>
                <div className='flex items-center justify-between'>
                    <div className='flex flex-col'>
                        <CardTitle>Support</CardTitle>
                        <CardDescription>Your recent support tickets</CardDescription>
                    </div>
                    {!isLoading && activeTickets.length > 0 && (
                        <Badge variant='outline' className='px-3 py-1'>
                            {activeTickets.length} active
                        </Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className='space-y-3'>
                        <Skeleton className='h-12 w-full' />
                        <Skeleton className='h-12 w-full' />
                    </div>
                ) : error ? (
                    <div className='py-6 text-center'>
                        <p className='text-muted-foreground'>{error}</p>
                        <Button
                            variant='outline'
                            size='sm'
                            className='mt-2'
                            onClick={handleRefresh}
                            disabled={refreshing}>
                            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                            Try Again
                        </Button>
                    </div>
                ) : tickets.length === 0 ? (
                    <div className='py-6 text-center'>
                        <TicketIcon className='text-muted-foreground mx-auto mb-2 h-10 w-10' />
                        <p className='text-muted-foreground'>No support tickets found</p>
                    </div>
                ) : (
                    <ul className='space-y-2'>
                        {tickets.slice(0, 3).map((ticket) => (
                            <li
                                key={ticket.id}
                                className='flex items-center justify-between gap-2 rounded-md border px-3 py-2'>
                                <div className='min-w-0 flex-1'>
                                    <p className='truncate font-medium'>{ticket.subject}</p>
                                    <div className='flex items-center gap-2'>
                                        <Badge
                                            variant={
                                                ticket.status === 'open'
                                                    ? 'default'
                                                    : ticket.status === 'pending'
                                                      ? 'secondary'
                                                      : 'outline'
                                            }
                                            className='whitespace-nowrap'>
                                            {ticket.status}
                                        </Badge>
                                        <span className='text-muted-foreground text-xs'>
                                            Updated {formatDate(ticket.lastUpdated)}
                                        </span>
                                    </div>
                                </div>
                                <Button variant='ghost' size='sm' asChild className='shrink-0'>
                                    <Link href={`/support/tickets/${ticket.id}`}>View</Link>
                                </Button>
                            </li>
                        ))}
                    </ul>
                )}
            </CardContent>
            <CardFooter className='border-t pt-3'>
                <div className='flex w-full items-center justify-between'>
                    <Button
                        variant='ghost'
                        size='sm'
                        onClick={handleRefresh}
                        disabled={refreshing || isLoading}
                        className='gap-1'>
                        <RefreshCw className={`h-3 w-3 ${refreshing ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                    <div className='flex gap-2'>
                        <Button variant='ghost' size='sm' asChild>
                            <Link href='/support?tab=tickets'>View all</Link>
                        </Button>
                        <Button size='sm' onClick={handleNewTicket}>
                            <TicketIcon className='mr-2 h-4 w-4' />
                            New ticket
                        </Button>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}
