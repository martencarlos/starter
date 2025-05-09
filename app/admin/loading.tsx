// app/admin/loading.tsx
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminLoading() {
    return (
        <div className='container mx-auto px-4 py-8'>
            <Skeleton className='mb-6 h-9 w-1/3 md:w-1/4' /> {/* Admin Dashboard H1 */}
            <div className='space-y-6'>
                {/* Placeholder for TabsList or main content block title */}
                <div className='mb-8 flex space-x-2'>
                    <Skeleton className='h-10 w-20 rounded-md' />
                    <Skeleton className='h-10 w-20 rounded-md' />
                    <Skeleton className='h-10 w-28 rounded-md' />
                    <Skeleton className='h-10 w-24 rounded-md' />
                    <Skeleton className='h-10 w-24 rounded-md' />
                </div>
                {/* Placeholder for content area */}
                <div className='bg-card rounded-lg border p-6 shadow-sm'>
                    <Skeleton className='mb-4 h-8 w-1/4' />
                    <Skeleton className='mb-2 h-4 w-full' />
                    <Skeleton className='mb-4 h-20 w-full' />
                    <Skeleton className='h-20 w-full' />
                </div>
            </div>
        </div>
    );
}
