// Update app/profile/loading.tsx
import { Skeleton } from '@/components/ui/skeleton';

export default function ProfileLoading() {
    return (
        <div className='container mx-auto max-w-4xl px-4 py-8'>
            <div className='mb-8 flex items-center justify-between'>
                <div>
                    <Skeleton className='h-9 w-48' />
                    <div className='mt-2 flex gap-2'>
                        <Skeleton className='h-6 w-16 rounded-full' />
                        <Skeleton className='h-6 w-20 rounded-full' />
                    </div>
                </div>
                <Skeleton className='h-12 w-12 rounded-full' />
            </div>

            <div className='bg-card rounded-lg border shadow-sm'>
                <div className='mb-6 flex space-x-1 p-4'>
                    <Skeleton className='h-10 w-32 rounded-md' />
                    <Skeleton className='h-10 w-32 rounded-md' />
                </div>

                <div className='space-y-6 p-6'>
                    <div>
                        <Skeleton className='mb-2 h-6 w-48' />
                        <Skeleton className='h-4 w-64' />
                    </div>

                    <div className='space-y-4'>
                        <div className='space-y-2'>
                            <Skeleton className='h-4 w-16' />
                            <Skeleton className='h-10 w-full' />
                        </div>
                        <div className='space-y-2'>
                            <Skeleton className='h-4 w-16' />
                            <Skeleton className='h-10 w-full' />
                        </div>
                        <Skeleton className='h-10 w-28' />
                    </div>
                </div>
            </div>
        </div>
    );
}
