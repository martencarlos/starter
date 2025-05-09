// app/(auth)/login/loading.tsx
import { Skeleton } from '@/components/ui/skeleton';

export default function LoginLoading() {
    return (
        <div className='sm:mx-auto sm:w-full sm:max-w-md'>
            <Skeleton className='mx-auto mt-6 h-8 w-3/4' /> {/* Title: Sign in to your account */}
            <Skeleton className='mx-auto mt-2 h-4 w-1/2' /> {/* Subtitle: Or create a new account */}
            <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
                <div className='bg-card space-y-6 px-4 py-8 shadow sm:rounded-lg sm:px-10'>
                    <div className='space-y-2'>
                        <Skeleton className='h-4 w-16' /> {/* Label: Email */}
                        <Skeleton className='h-9 w-full' /> {/* Input: Email */}
                    </div>
                    <div className='space-y-2'>
                        <Skeleton className='h-4 w-20' /> {/* Label: Password */}
                        <Skeleton className='h-9 w-full' /> {/* Input: Password */}
                    </div>
                    <Skeleton className='h-10 w-full' /> {/* Button: Sign in */}
                    <div className='relative py-2'>
                        <Skeleton className='h-px w-full' /> {/* Divider */}
                        <Skeleton className='bg-card absolute top-1/2 left-1/2 h-4 w-24 -translate-x-1/2 -translate-y-1/2 px-2' />{' '}
                        {/* Or continue with */}
                    </div>
                    <Skeleton className='h-10 w-full' /> {/* Button: Sign in with Google */}
                </div>
            </div>
        </div>
    );
}
