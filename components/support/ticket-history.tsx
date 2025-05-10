// components/support/ticket-history.tsx
'use client';

import { useState } from 'react';

import Link from 'next/link';

import { Ticket, useSupport } from '@/components/support/support-context';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { ClockIcon, MessageSquareIcon, RefreshCw, TicketIcon } from 'lucide-react';

// components/support/ticket-history.tsx

// Status badge variant mapping
const statusVariants = {
    open: 'default',
    pending: 'secondary',
    resolved: 'outline',
    closed: 'secondary'
} as const;

// Format date helper
const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

interface TicketHistoryProps {
    onSwitchToContactTab?: () => void;
}

export function TicketHistory({ onSwitchToContactTab }: TicketHistoryProps) {
    const { tickets, isLoading, error, refreshTickets } = useSupport();
    const [activeStatus, setActiveStatus] = useState<'all' | 'open' | 'closed'>('all');
    const [refreshing, setRefreshing] = useState(false);

    // Filter tickets based on active status tab
    const filteredTickets =
        activeStatus === 'all'
            ? tickets
            : activeStatus === 'open'
              ? tickets.filter((ticket) => ticket.status === 'open' || ticket.status === 'pending')
              : tickets.filter((ticket) => ticket.status === 'closed' || ticket.status === 'resolved');

    const handleRefresh = async () => {
        setRefreshing(true);
        await refreshTickets();
        setRefreshing(false);
    };

    return (
        <Card>
            <CardHeader>
                <div className='flex items-center justify-between'>
                    <div>
                        <CardTitle>Your Support Tickets</CardTitle>
                        <CardDescription>View and track your support requests</CardDescription>
                    </div>
                    <div className='flex gap-2'>
                        <Button variant='outline' size='sm' onClick={handleRefresh} disabled={refreshing || isLoading}>
                            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                            Refresh
                        </Button>
                        <Button size='sm' onClick={onSwitchToContactTab}>
                            <TicketIcon className='mr-2 h-4 w-4' />
                            New Ticket
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue='all' onValueChange={(value) => setActiveStatus(value as 'all' | 'open' | 'closed')}>
                    <TabsList className='mb-4'>
                        <TabsTrigger value='all'>All Tickets</TabsTrigger>
                        <TabsTrigger value='open'>Open</TabsTrigger>
                        <TabsTrigger value='closed'>Closed</TabsTrigger>
                    </TabsList>

                    <TabsContent value='all' className='mt-0'>
                        <TicketList tickets={filteredTickets} isLoading={isLoading} error={error} />
                    </TabsContent>

                    <TabsContent value='open' className='mt-0'>
                        <TicketList tickets={filteredTickets} isLoading={isLoading} error={error} />
                    </TabsContent>

                    <TabsContent value='closed' className='mt-0'>
                        <TicketList tickets={filteredTickets} isLoading={isLoading} error={error} />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}

interface TicketListProps {
    tickets: Ticket[];
    isLoading: boolean;
    error: string | null;
}

function TicketList({ tickets, isLoading, error }: TicketListProps) {
    if (isLoading) {
        return (
            <div className='space-y-4'>
                {[1, 2, 3].map((i) => (
                    <div key={i} className='rounded-md border p-4'>
                        <div className='flex items-start justify-between'>
                            <div className='w-full space-y-3'>
                                <div className='flex gap-2'>
                                    <Skeleton className='h-5 w-16 rounded-full' />
                                    <Skeleton className='h-5 w-24' />
                                </div>
                                <Skeleton className='h-6 w-3/4' />
                                <div className='flex gap-4'>
                                    <Skeleton className='h-4 w-24' />
                                    <Skeleton className='h-4 w-32' />
                                </div>
                            </div>
                            <Skeleton className='h-9 w-24' />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className='rounded-md border py-8 text-center'>
                <p className='text-destructive'>{error}</p>
                <Button variant='outline' size='sm' className='mt-4' onClick={() => window.location.reload()}>
                    Try Again
                </Button>
            </div>
        );
    }

    if (tickets.length === 0) {
        return (
            <div className='border-border flex flex-col items-center justify-center rounded-md border py-10 text-center'>
                <TicketIcon className='text-muted-foreground mb-2 h-10 w-10' />
                <h3 className='font-medium'>No tickets found</h3>
                <p className='text-muted-foreground mt-1 text-sm'>Create a new support ticket to get help</p>
            </div>
        );
    }

    return (
        <div className='space-y-4'>
            {tickets.map((ticket) => (
                <div
                    key={ticket.id}
                    className='hover:bg-accent/50 group flex flex-col justify-between rounded-md border p-4 transition-colors sm:flex-row'>
                    <div className='mb-4 flex-1 sm:mb-0'>
                        <div className='mb-1 flex items-center gap-2'>
                            <Badge variant={statusVariants[ticket.status as keyof typeof statusVariants] || 'default'}>
                                {ticket.status}
                            </Badge>
                            <span className='text-muted-foreground text-sm'>{ticket.ticketNumber}</span>
                        </div>
                        <h4 className='font-medium'>{ticket.subject}</h4>
                        <div className='text-muted-foreground mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs'>
                            <span className='flex items-center'>
                                <ClockIcon className='mr-1 h-3 w-3' />
                                Created {formatDate(ticket.createdAt)}
                            </span>
                            <span className='flex items-center'>
                                <MessageSquareIcon className='mr-1 h-3 w-3' />
                                {ticket.messageCount} message{ticket.messageCount !== 1 ? 's' : ''}
                            </span>
                        </div>
                    </div>
                    <div className='flex items-start justify-end'>
                        <Button variant='outline' size='sm' className='w-full sm:w-auto' asChild>
                            <Link href={`/support/tickets/${ticket.id}`}>View Details</Link>
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
}
