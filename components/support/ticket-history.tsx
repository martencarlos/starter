'use client';

import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { ClockIcon, MessageSquareIcon, TicketIcon } from 'lucide-react';

// This is a simulated component for ticket history
// In a real application, you would fetch the user's ticket history from the database

// Define sample ticket data
const sampleTickets = [
    {
        id: 'TICKET-1234',
        subject: 'Account access problem',
        status: 'open',
        category: 'account',
        createdAt: '2023-11-15T14:23:45Z',
        lastUpdated: '2023-11-15T15:30:12Z',
        messages: 3
    },
    {
        id: 'TICKET-5678',
        subject: 'Billing question about my subscription',
        status: 'closed',
        category: 'billing',
        createdAt: '2023-10-28T09:12:33Z',
        lastUpdated: '2023-10-30T11:45:20Z',
        messages: 5
    },
    {
        id: 'TICKET-9012',
        subject: 'How do I change my password?',
        status: 'resolved',
        category: 'account',
        createdAt: '2023-09-05T18:07:22Z',
        lastUpdated: '2023-09-06T10:15:30Z',
        messages: 2
    }
];

// Ticket status badge variant mapping
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
    userId: string;
}

export function TicketHistory({ userId }: TicketHistoryProps) {
    // In a real application, you would fetch the user's tickets from an API
    // const [tickets, setTickets] = useState([]);
    // const [isLoading, setIsLoading] = useState(true);

    // useEffect(() => {
    //     async function fetchTickets() {
    //         try {
    //             const response = await fetch(`/api/support/tickets/user/${userId}`);
    //             const data = await response.json();
    //             setTickets(data.tickets);
    //         } catch (error) {
    //             console.error('Error fetching tickets:', error);
    //         } finally {
    //             setIsLoading(false);
    //         }
    //     }
    //
    //     fetchTickets();
    // }, [userId]);

    return (
        <Card>
            <CardHeader>
                <div className='flex items-center justify-between'>
                    <div>
                        <CardTitle>Your Support Tickets</CardTitle>
                        <CardDescription>View and track your support requests</CardDescription>
                    </div>
                    <Button asChild size='sm'>
                        <Link href='/support?tab=contact'>
                            <TicketIcon className='mr-2 h-4 w-4' />
                            New Ticket
                        </Link>
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue='all'>
                    <TabsList className='mb-4'>
                        <TabsTrigger value='all'>All Tickets</TabsTrigger>
                        <TabsTrigger value='open'>Open</TabsTrigger>
                        <TabsTrigger value='closed'>Closed</TabsTrigger>
                    </TabsList>

                    <TabsContent value='all' className='mt-0'>
                        <TicketList tickets={sampleTickets} />
                    </TabsContent>

                    <TabsContent value='open' className='mt-0'>
                        <TicketList
                            tickets={sampleTickets.filter(
                                (ticket) => ticket.status === 'open' || ticket.status === 'pending'
                            )}
                        />
                    </TabsContent>

                    <TabsContent value='closed' className='mt-0'>
                        <TicketList
                            tickets={sampleTickets.filter(
                                (ticket) => ticket.status === 'closed' || ticket.status === 'resolved'
                            )}
                        />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}

interface TicketListProps {
    tickets: typeof sampleTickets;
}

function TicketList({ tickets }: TicketListProps) {
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
                            <span className='text-muted-foreground text-sm'>{ticket.id}</span>
                        </div>
                        <h4 className='font-medium'>{ticket.subject}</h4>
                        <div className='text-muted-foreground mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs'>
                            <span className='flex items-center'>
                                <ClockIcon className='mr-1 h-3 w-3' />
                                Created {formatDate(ticket.createdAt)}
                            </span>
                            <span className='flex items-center'>
                                <MessageSquareIcon className='mr-1 h-3 w-3' />
                                {ticket.messages} message{ticket.messages !== 1 ? 's' : ''}
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
