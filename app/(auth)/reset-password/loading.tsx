// app/(auth)/reset-password/loading.tsx
import { Skeleton } from '@/components/ui/skeleton';

export default function ResetPasswordLoading() {
    return (
        <div className='sm:mx-auto sm:w-full sm:max-w-md'>
            <Skeleton className='mx-auto mt-6 h-8 w-3/4' /> {/* Title Placeholder */}
            <Skeleton className='mx-auto mt-2 h-4 w-2/3' /> {/* Subtitle Placeholder */}
            <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
                <div className='bg-card space-y-6 px-4 py-8 shadow sm:rounded-lg sm:px-10'>
                    {/* This will show while the token is being resolved from searchParams */}
                    <div className='space-y-2'>
                        <Skeleton className='h-4 w-24' /> {/* Label: New Password */}
                        <Skeleton className='h-9 w-full' /> {/* Input: New Password */}
                    </div>
                    <div className='space-y-2'>
                        <Skeleton className='h-4 w-32' /> {/* Label: Confirm Password */}
                        <Skeleton className='h-9 w-full' /> {/* Input: Confirm Password */}
                    </div>
                    <Skeleton className='h-10 w-full' /> {/* Button: Reset Password */}
                </div>
            </div>
        </div>
    );
}
