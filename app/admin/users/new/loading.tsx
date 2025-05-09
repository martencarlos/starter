// app/admin/users/new/loading.tsx
import { Skeleton } from '@/components/ui/skeleton';

export default function CreateUserLoading() {
    return (
        <div className='container mx-auto px-4 py-8'>
            <Skeleton className='mb-8 h-9 w-1/3 md:w-1/4' /> {/* Matches "Create User" H1 */}
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
                <div className='space-y-2'>
                    <Skeleton className='h-4 w-24' /> {/* Label Password */}
                    <Skeleton className='h-9 w-full' /> {/* Input Password */}
                </div>
                <div className='space-y-2'>
                    <Skeleton className='h-4 w-36' /> {/* Label Confirm Password */}
                    <Skeleton className='h-9 w-full' /> {/* Input Confirm Password */}
                </div>
                <div className='space-y-2'>
                    <Skeleton className='h-4 w-20' /> {/* Label Roles */}
                    <Skeleton className='h-9 w-full' /> {/* Select Roles */}
                </div>

                {/* Button skeletons */}
                <div className='flex justify-end gap-4 pt-4'>
                    <Skeleton className='h-9 w-24' /> {/* Cancel Button */}
                    <Skeleton className='h-9 w-32' /> {/* Create User Button */}
                </div>
            </div>
        </div>
    );
}
