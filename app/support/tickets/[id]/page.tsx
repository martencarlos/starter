// app/support/tickets/[id]/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

import { TicketDetailView } from '@/components/support/ticket-detail-view';
import { Button } from '@/components/ui/button';
import { authOptions } from '@/lib/auth-options';
import { ticketService } from '@/lib/services/ticket-service';

import { ChevronLeft } from 'lucide-react';
import { getServerSession } from 'next-auth/next';

export const metadata: Metadata = {
    title: 'Support Ticket',
    description: 'View your support ticket details'
};

export default async function TicketDetailPage({ params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);

    const { id } = await params;

    // If user is not logged in, redirect to login
    if (!session?.user) {
        redirect('/login?callbackUrl=' + encodeURIComponent(`/support/tickets/${id}`));
    }

    // Get the ticket using the ticket service
    const ticket = await ticketService.getTicketById(id);

    // If ticket doesn't exist, show 404
    if (!ticket) {
        notFound();
    }

    // Check if the user has permission to view this ticket
    const userId = session.user.id;
    const roles = session.user.roles || [];
    const hasAccess = await ticketService.hasTicketAccess(id, userId, roles);

    // If user doesn't have permission, redirect to access denied
    if (!hasAccess) {
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
                    ID: {ticket.ticketNumber} • Category: {ticket.category} • Opened on{' '}
                    {new Date(ticket.createdAt).toLocaleDateString()}
                </p>
            </div>

            <TicketDetailView ticket={ticket} userId={userId} />
        </div>
    );
}
