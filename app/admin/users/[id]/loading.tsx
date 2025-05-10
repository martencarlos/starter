// app/admin/users/[id]/loading.tsx
import { Skeleton } from '@/components/ui/skeleton';

export default function EditUserLoading() {
    return (
        <>
            {/* Skeleton for Admin Dashboard H1 */}
            <Skeleton className='mb-6 h-9 w-1/3 md:w-1/4' />

            {/* Skeleton for "Edit User" H1 */}
            <Skeleton className='mb-8 h-9 w-1/3 md:w-1/4' />

            <div className='bg-card space-y-6 rounded-lg border p-6 shadow-sm'>
                {/* Form field skeletons */}
                <div className='space-y-2'>
                    <Skeleton className='h-4 w-20' /> {/* Label Name */}
                    <Skeleton className='h-9 w-full' /> {/* Input Name */}
                </div>
                <div className='space-y-2'>
                    <Skeleton className='h-4 w-20' /> {/* Label Email */}
                    <Skeleton className='h-9 w-full' /> {/* Input Email */}
                </div>
                <div className='flex items-center space-x-2 py-2'>
                    <Skeleton className='h-5 w-10' /> {/* Switch */}
                    <Skeleton className='h-4 w-32' /> {/* Label Email Verified */}
                </div>
                <div className='space-y-2'>
                    <Skeleton className='h-4 w-20' /> {/* Label Roles */}
                    <div className='flex flex-wrap gap-2 pb-2'>
                        <Skeleton className='h-6 w-16 rounded-full' />
                        <Skeleton className='h-6 w-20 rounded-full' />
                    </div>
                    <Skeleton className='h-9 w-full' /> {/* Select Roles */}
                </div>

                {/* Button skeletons */}
                <div className='flex justify-between gap-4 pt-4'>
                    <Skeleton className='h-9 w-28' /> {/* Delete Button */}
                    <div className='flex gap-4'>
                        <Skeleton className='h-9 w-24' /> {/* Cancel Button */}
                        <Skeleton className='h-9 w-32' /> {/* Save Changes Button */}
                    </div>
                </div>
            </div>
        </>
    );
}
