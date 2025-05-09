'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import { CheckCircle2, TicketIcon } from 'lucide-react';

interface Ticket {
    id: string;
    subject: string;
    status: 'open' | 'pending' | 'resolved' | 'closed';
    lastUpdated: string;
}

interface SupportDashboardWidgetProps {
    userId: string;
}

export function SupportDashboardWidget({ userId }: SupportDashboardWidgetProps) {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // In a real app, fetch ticket data from the API
    useEffect(() => {
        const fetchTickets = async () => {
            setIsLoading(true);
            try {
                // In a real app, this would be an API call
                // const response = await fetch('/api/support/tickets/user');
                // const data = await response.json();
                // setTickets(data.tickets);

                // For demo, simulate API call with sample data
                await new Promise((resolve) => setTimeout(resolve, 1000));

                setTickets([
                    {
                        id: 'TICKET-1234',
                        subject: 'Account access problem',
                        status: 'open',
                        lastUpdated: '2023-11-15T15:30:12Z'
                    },
                    {
                        id: 'TICKET-5678',
                        subject: 'Billing question about my subscription',
                        status: 'closed',
                        lastUpdated: '2023-10-30T11:45:20Z'
                    }
                ]);
            } catch (err) {
                console.error('Failed to fetch tickets:', err);
                setError('Failed to load your support tickets');
            } finally {
                setIsLoading(false);
            }
        };

        fetchTickets();
    }, [userId]);

    const activeTickets = tickets.filter((ticket) => ticket.status === 'open' || ticket.status === 'pending');

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);

        return date.toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric'
        });
    };

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
                    <Button variant='ghost' size='sm' asChild>
                        <Link href='/support?tab=tickets'>View all tickets</Link>
                    </Button>
                    <Button size='sm' asChild>
                        <Link href='/support?tab=contact'>
                            <TicketIcon className='mr-2 h-4 w-4' />
                            New ticket
                        </Link>
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}
