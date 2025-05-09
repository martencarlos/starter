'use client';

import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

import { Loader2, SendIcon } from 'lucide-react';
import { toast } from 'sonner';

// Status badge variants
const statusVariants = {
    open: 'default',
    pending: 'secondary',
    resolved: 'outline',
    closed: 'secondary'
} as const;

// Types for ticket and messages
interface Message {
    id: string;
    content: string;
    sender: 'user' | 'support';
    timestamp: string;
}

interface Ticket {
    id: string;
    subject: string;
    status: 'open' | 'pending' | 'resolved' | 'closed';
    category: string;
    createdAt: string;
    lastUpdated: string;
    userId: string;
    messages: Message[];
}

interface TicketDetailViewProps {
    ticket: Ticket;
    userId: string;
}

export function TicketDetailView({ ticket, userId }: TicketDetailViewProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [ticketStatus, setTicketStatus] = useState(ticket.status);
    const [ticketMessages, setTicketMessages] = useState<Message[]>(ticket.messages);

    // Format date to readable format
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);

        return date.toLocaleString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Handle reply submission
    const handleSubmitReply = async () => {
        if (!replyText.trim()) return;

        setIsSubmitting(true);

        try {
            // In a real app, you would send the reply to your API
            // const response = await fetch(`/api/support/tickets/${ticket.id}/reply`, {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ content: replyText })
            // });

            // Simulate API call for demo
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Create a new message object
            const newMessage: Message = {
                id: `msg-${new Date().getTime()}`,
                content: replyText,
                sender: 'user',
                timestamp: new Date().toISOString()
            };

            // Update ticket messages state
            setTicketMessages((prev) => [...prev, newMessage]);

            // Clear the reply text
            setReplyText('');

            // Check if we need to reopen the ticket
            if (ticketStatus === 'closed' || ticketStatus === 'resolved') {
                setTicketStatus('open');
                toast.info('This ticket has been reopened due to your new reply');
            }

            toast.success('Your reply has been sent');
        } catch (error) {
            toast.error('Failed to send your reply. Please try again.');
            console.error('Error sending reply:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handler for closing ticket
    const handleCloseTicket = async () => {
        try {
            // In a real app, you would send a request to your API
            // const response = await fetch(`/api/support/tickets/${ticket.id}/status`, {
            //     method: 'PATCH',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ status: 'closed' })
            // });

            // Simulate API call for demo
            await new Promise((resolve) => setTimeout(resolve, 500));

            // Update status
            setTicketStatus('closed');
            toast.success('Ticket has been closed');
        } catch (error) {
            toast.error('Failed to close ticket. Please try again.');
            console.error('Error closing ticket:', error);
        }
    };

    // Handler for reopening ticket
    const handleReopenTicket = async () => {
        try {
            // In a real app, you would send a request to your API
            // const response = await fetch(`/api/support/tickets/${ticket.id}/status`, {
            //     method: 'PATCH',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ status: 'open' })
            // });

            // Simulate API call for demo
            await new Promise((resolve) => setTimeout(resolve, 500));

            // Update status
            setTicketStatus('open');
            toast.success('Ticket has been reopened');
        } catch (error) {
            toast.error('Failed to reopen ticket. Please try again.');
            console.error('Error reopening ticket:', error);
        }
    };

    // Determine if ticket is closed or resolved
    const isTicketClosed = ticketStatus === 'closed' || ticketStatus === 'resolved';

    return (
        <div className='space-y-6'>
            <Card>
                <CardHeader className='flex flex-row items-center justify-between border-b pb-4'>
                    <CardTitle className='text-lg'>Conversation</CardTitle>
                    <Badge variant={statusVariants[ticketStatus]}>
                        {ticketStatus.charAt(0).toUpperCase() + ticketStatus.slice(1)}
                    </Badge>
                </CardHeader>
                <CardContent className='pt-6'>
                    <div className='space-y-6'>
                        {ticketMessages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div
                                    className={`max-w-[80%] rounded-lg px-4 py-3 ${
                                        message.sender === 'user'
                                            ? 'bg-primary text-primary-foreground ml-12'
                                            : 'bg-muted mr-12'
                                    }`}>
                                    <div className='space-y-2'>
                                        <p className='break-words'>{message.content}</p>
                                        <p
                                            className={`text-xs ${
                                                message.sender === 'user'
                                                    ? 'text-primary-foreground/80'
                                                    : 'text-muted-foreground'
                                            }`}>
                                            {formatDate(message.timestamp)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
                <CardFooter className='flex-col space-y-4 border-t pt-4'>
                    {isTicketClosed ? (
                        <div className='w-full py-2 text-center'>
                            <p className='text-muted-foreground mb-3'>
                                This ticket is {ticketStatus}. You can reopen it if you need further assistance.
                            </p>
                            <Button onClick={handleReopenTicket}>Reopen Ticket</Button>
                        </div>
                    ) : (
                        <>
                            <div className='w-full'>
                                <Textarea
                                    placeholder='Type your reply here...'
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    rows={3}
                                    className='mb-3'
                                    disabled={isSubmitting}
                                />
                                <div className='flex justify-between'>
                                    <Button variant='outline' onClick={handleCloseTicket} disabled={isSubmitting}>
                                        Close Ticket
                                    </Button>
                                    <Button onClick={handleSubmitReply} disabled={!replyText.trim() || isSubmitting}>
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <SendIcon className='mr-2 h-4 w-4' />
                                                Send Reply
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </CardFooter>
            </Card>

            <Card>
                <CardHeader className='pb-3'>
                    <CardTitle className='text-lg'>Ticket Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <dl className='grid grid-cols-1 gap-2 sm:grid-cols-2'>
                        <div>
                            <dt className='text-muted-foreground text-sm font-medium'>Ticket ID</dt>
                            <dd>{ticket.id}</dd>
                        </div>
                        <div>
                            <dt className='text-muted-foreground text-sm font-medium'>Category</dt>
                            <dd className='capitalize'>{ticket.category}</dd>
                        </div>
                        <div>
                            <dt className='text-muted-foreground text-sm font-medium'>Status</dt>
                            <dd className='capitalize'>{ticketStatus}</dd>
                        </div>
                        <div>
                            <dt className='text-muted-foreground text-sm font-medium'>Created</dt>
                            <dd>{formatDate(ticket.createdAt)}</dd>
                        </div>
                        <div>
                            <dt className='text-muted-foreground text-sm font-medium'>Last Updated</dt>
                            <dd>{formatDate(ticket.lastUpdated)}</dd>
                        </div>
                        <div>
                            <dt className='text-muted-foreground text-sm font-medium'>Total Messages</dt>
                            <dd>{ticketMessages.length}</dd>
                        </div>
                    </dl>
                </CardContent>
            </Card>
        </div>
    );
}
