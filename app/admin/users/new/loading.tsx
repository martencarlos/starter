// app/admin/users/new/loading.tsx
import { Skeleton } from '@/components/ui/skeleton';

export default function CreateUserLoading() {
    return (
        <>
            {/* Skeleton for Admin Dashboard H1 */}
            <Skeleton className='mb-6 h-9 w-1/3 md:w-1/4' />

            {/* Skeleton for "Create User" H1 */}
            <Skeleton className='mb-8 h-9 w-1/3 md:w-1/4' />

            <div className='bg-card space-y-6 rounded-lg border p-6 shadow-sm'>
                {/* Form field skeletons */}
                <div className='space-y-2'>
                    <Skeleton className='h-4 w-20' />
                    <Skeleton className='h-9 w-full' />
                </div>
                <div className='space-y-2'>
                    <Skeleton className='h-4 w-20' />
                    <Skeleton className='h-9 w-full' />
                </div>
                <div className='space-y-2'>
                    <Skeleton className='h-4 w-24' />
                    <Skeleton className='h-9 w-full' />
                </div>
                <div className='space-y-2'>
                    <Skeleton className='h-4 w-36' />
                    <Skeleton className='h-9 w-full' />
                </div>
                <div className='space-y-2'>
                    <Skeleton className='h-4 w-20' />
                    <Skeleton className='h-9 w-full' />
                </div>
                <div className='flex justify-end gap-4 pt-4'>
                    <Skeleton className='h-9 w-24' />
                    <Skeleton className='h-9 w-32' />
                </div>
            </div>
        </>
    );
}
