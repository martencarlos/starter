// app/not-found.tsx
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function NotFound() {
    return (
        <div className='flex min-h-[70vh] flex-col items-center justify-center px-4 text-center'>
            <div className='space-y-6'>
                <div className='space-y-2'>
                    <h1 className='text-4xl font-bold tracking-tighter sm:text-6xl'>404</h1>
                    <p className='text-muted-foreground text-lg'>Page not found</p>
                </div>

                <p className='text-muted-foreground mx-auto max-w-md'>
                    The page you're looking for doesn't exist or has been moved.
                </p>

                <div className='flex flex-col justify-center gap-2 min-[400px]:flex-row'>
                    <Button asChild size='lg'>
                        <Link href='/'>Go Home</Link>
                    </Button>
                    <Button asChild variant='outline' size='lg'>
                        <Link href='/support'>Contact Support</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
