// app/support/tickets/[id]/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

import { TicketDetailView } from '@/components/support/ticket-detail-view';
import { Button } from '@/components/ui/button';
import { authOptions } from '@/lib/auth-options';

import { ChevronLeft } from 'lucide-react';
import { getServerSession } from 'next-auth/next';

export const metadata: Metadata = {
    title: 'Support Ticket',
    description: 'View your support ticket details'
};

// In a real app, we would fetch the ticket from the database
// and check if the user has permission to view it
const getTicket = async (id: string) => {
    // This is a mock implementation
    // In a real app, you would fetch the ticket from your database

    // For demo purposes, we'll return some sample data
    const sampleTickets = {
        'TICKET-1234': {
            id: 'TICKET-1234',
            subject: 'Account access problem',
            status: 'open',
            category: 'account',
            createdAt: '2023-11-15T14:23:45Z',
            lastUpdated: '2023-11-15T15:30:12Z',
            userId: 'user-123', // The ID of the user who created the ticket
            messages: [
                {
                    id: 'msg-1',
                    content:
                        'I\'m having trouble logging into my account. It says "invalid credentials" but I\'m sure my password is correct.',
                    sender: 'user',
                    timestamp: '2023-11-15T14:23:45Z'
                },
                {
                    id: 'msg-2',
                    content:
                        'Thank you for reaching out. Could you please try resetting your password using the "Forgot Password" link on the login page?',
                    sender: 'support',
                    timestamp: '2023-11-15T14:45:12Z'
                },
                {
                    id: 'msg-3',
                    content: "I tried that, but I'm not receiving the password reset email.",
                    sender: 'user',
                    timestamp: '2023-11-15T15:30:12Z'
                }
            ]
        },
        'TICKET-5678': {
            id: 'TICKET-5678',
            subject: 'Billing question about my subscription',
            status: 'closed',
            category: 'billing',
            createdAt: '2023-10-28T09:12:33Z',
            lastUpdated: '2023-10-30T11:45:20Z',
            userId: 'user-123',
            messages: [
                {
                    id: 'msg-1',
                    content: 'I have a question about my recent billing charge. It seems higher than expected.',
                    sender: 'user',
                    timestamp: '2023-10-28T09:12:33Z'
                },
                {
                    id: 'msg-2',
                    content:
                        "Hello! I would be happy to look into this for you. Could you please provide the date of the charge you're referring to?",
                    sender: 'support',
                    timestamp: '2023-10-28T10:30:45Z'
                },
                {
                    id: 'msg-3',
                    content: 'It was on October 25th for $39.99. I thought my plan was $29.99.',
                    sender: 'user',
                    timestamp: '2023-10-28T11:05:22Z'
                },
                {
                    id: 'msg-4',
                    content:
                        'Thank you for the information. I see that your plan changed from Basic to Pro on October 20th, which explains the higher charge. Would you like me to send you the upgrade confirmation email again?',
                    sender: 'support',
                    timestamp: '2023-10-29T09:15:30Z'
                },
                {
                    id: 'msg-5',
                    content: 'Yes, please send it again. I must have missed that email. Thank you for explaining!',
                    sender: 'user',
                    timestamp: '2023-10-30T11:45:20Z'
                }
            ]
        },
        'TICKET-9012': {
            id: 'TICKET-9012',
            subject: 'How do I change my password?',
            status: 'resolved',
            category: 'account',
            createdAt: '2023-09-05T18:07:22Z',
            lastUpdated: '2023-09-06T10:15:30Z',
            userId: 'user-123',
            messages: [
                {
                    id: 'msg-1',
                    content:
                        'I need to change my password for security reasons. Where can I do this in my account settings?',
                    sender: 'user',
                    timestamp: '2023-09-05T18:07:22Z'
                },
                {
                    id: 'msg-2',
                    content:
                        'Hello! You can change your password by going to your profile page and clicking on the "Security" tab. There you\'ll find an option to change your password. Let me know if you need further assistance!',
                    sender: 'support',
                    timestamp: '2023-09-06T10:15:30Z'
                }
            ]
        }
    };

    return sampleTickets[id as keyof typeof sampleTickets] || null;
};

export default async function TicketDetailPage({ params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);

    // If user is not logged in, redirect to login
    if (!session?.user) {
        redirect('/login?callbackUrl=' + encodeURIComponent(`/support/tickets/${params.id}`));
    }

    const ticket = await getTicket(params.id);

    // If ticket doesn't exist, show 404
    if (!ticket) {
        notFound();
    }

    // In a real app, we would check if the user has permission to view this ticket
    // For demo purposes, we're assuming all tickets belong to the current user
    const userId = session.user.id;
    const hasPermission = userId === ticket.userId || (session.user.roles && session.user.roles.includes('admin'));

    // If user doesn't have permission, redirect to access denied
    if (!hasPermission) {
        redirect('/access-denied');
    }

    return (
        <div className='container mx-auto max-w-4xl px-4 py-8'>
            <div className='mb-6'>
                <Button variant='ghost' size='sm' asChild className='mb-4'>
                    <Link href='/support?tab=tickets'>
                        <ChevronLeft className='mr-1 h-4 w-4' />
                        Back to Tickets
                    </Link>
                </Button>

                <h1 className='text-2xl font-bold'>Ticket: {ticket.subject}</h1>
                <p className='text-muted-foreground text-sm'>
                    ID: {ticket.id} • Category: {ticket.category} • Opened on{' '}
                    {new Date(ticket.createdAt).toLocaleDateString()}
                </p>
            </div>

            <TicketDetailView ticket={ticket} userId={userId} />
        </div>
    );
}
