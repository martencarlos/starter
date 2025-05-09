// app/support/tickets/[id]/not-found.tsx
import Link from 'next/link';

import { Button } from '@/components/ui/button';

import { AlertTriangle } from 'lucide-react';

export default function TicketNotFound() {
    return (
        <div className='container mx-auto flex max-w-md flex-col items-center justify-center px-4 py-16 text-center'>
            <AlertTriangle className='text-destructive mb-4 h-16 w-16' />
            <h1 className='text-2xl font-bold'>Ticket Not Found</h1>
            <p className='text-muted-foreground mt-2 mb-6'>
                The support ticket you're looking for doesn't exist or you don't have permission to view it.
            </p>
            <div className='flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2'>
                <Button asChild variant='default'>
                    <Link href='/support'>Return to Support</Link>
                </Button>
                <Button asChild variant='outline'>
                    <Link href='/support?tab=contact'>Create New Ticket</Link>
                </Button>
            </div>
        </div>
    );
}
