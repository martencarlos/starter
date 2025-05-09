// app/loading.tsx
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
    // This is a global fallback loading UI.
    // You can make it more sophisticated if needed.
    return (
        <div className='flex min-h-[calc(100vh-var(--header-height)-var(--footer-height))] flex-col items-center justify-center space-y-4 p-4'>
            <div className='flex flex-col items-center space-y-2'>
                <Skeleton className='h-12 w-12 rounded-full' />
                <Skeleton className='h-4 w-[250px]' />
                <Skeleton className='h-4 w-[200px]' />
            </div>
            <p className='text-muted-foreground'>Loading application...</p>
        </div>
    );
}
