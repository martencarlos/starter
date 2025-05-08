// app/access-denied/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

import { ShieldAlert } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Access Denied',
    description: 'You do not have permission to access this page'
};

export default function AccessDeniedPage() {
    return (
        <div className='flex min-h-[60vh] flex-col items-center justify-center px-4 text-center'>
            <div className='bg-destructive/10 mb-6 rounded-full p-6'>
                <ShieldAlert className='text-destructive h-12 w-12' />
            </div>

            <h1 className='mb-2 text-3xl font-bold tracking-tight'>Access Denied</h1>

            <p className='text-muted-foreground mb-6 max-w-md'>
                You do not have the necessary permissions to access this page. Please contact your administrator if you
                believe this is an error.
            </p>

            <div className='flex flex-col gap-4 sm:flex-row'>
                <Button asChild variant='outline'>
                    <Link href='/dashboard'>Return to Dashboard</Link>
                </Button>
                <Button asChild>
                    <Link href='/support'>Contact Support</Link>
                </Button>
            </div>
        </div>
    );
}
