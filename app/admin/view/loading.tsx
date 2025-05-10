// app/admin/view/loading.tsx
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminViewLoading() {
    return (
        <>
            {/* Add the main Admin Dashboard H1 here */}
            <h1 className='mb-6 text-3xl font-bold'>Admin Dashboard</h1>

            <div className='w-full'>
                <div className='mb-8 flex space-x-2'>
                    <Skeleton className='h-10 w-20 rounded-md' />
                    <Skeleton className='h-10 w-20 rounded-md' />
                    <Skeleton className='h-10 w-28 rounded-md' />
                    <Skeleton className='h-10 w-24 rounded-md' />
                    <Skeleton className='h-10 w-24 rounded-md' />
                </div>
                <div className='bg-card space-y-4 rounded-lg border p-6 shadow-sm'>
                    <Skeleton className='h-8 w-1/4' />
                    <Skeleton className='h-4 w-full' />
                    <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
                        <Skeleton className='h-20 w-full' />
                        <Skeleton className='h-20 w-full' />
                        <Skeleton className='h-20 w-full' />
                    </div>
                </div>
            </div>
        </>
    );
}
