// app/admin/view/loading.tsx
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminViewLoading() {
    // This loading UI will be shown when navigating to /admin/view
    // It is more specific than app/admin/loading.tsx
    return (
        <div className='w-full'>
            {/* Skeleton for TabsList */}
            <div className='mb-8 flex space-x-2'>
                <Skeleton className='h-10 w-20 rounded-md' />
                <Skeleton className='h-10 w-20 rounded-md' />
                <Skeleton className='h-10 w-28 rounded-md' />
                <Skeleton className='h-10 w-24 rounded-md' />
                <Skeleton className='h-10 w-24 rounded-md' />
            </div>

            {/* Skeleton for Tab Content Area (mimicking TabSkeleton from AdminTabsClientWrapper) */}
            <div className='bg-card space-y-4 rounded-lg border p-6 shadow-sm'>
                <Skeleton className='h-8 w-1/4' />
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-20 w-full' />
                <Skeleton className='h-20 w-full' />
                <Skeleton className='mt-4 h-4 w-3/4' />
            </div>
        </div>
    );
}
