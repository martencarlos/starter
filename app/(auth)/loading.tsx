// app/(auth)/loading.tsx
import { Skeleton } from '@/components/ui/skeleton';

export default function AuthLoading() {
    // Fallback loading UI for auth pages like /register, /forgot-password
    // More specific loaders like /login/loading.tsx will take precedence
    return (
        <div className='sm:mx-auto sm:w-full sm:max-w-md'>
            <Skeleton className='mx-auto mt-6 h-8 w-3/4' /> {/* Title Placeholder */}
            <Skeleton className='mx-auto mt-2 h-4 w-1/2' /> {/* Subtitle/Link Placeholder */}
            <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
                <div className='bg-card space-y-6 px-4 py-8 shadow sm:rounded-lg sm:px-10'>
                    <div className='space-y-2'>
                        <Skeleton className='h-4 w-16' /> {/* Label */}
                        <Skeleton className='h-9 w-full' /> {/* Input */}
                    </div>
                    <div className='space-y-2'>
                        <Skeleton className='h-4 w-16' /> {/* Label */}
                        <Skeleton className='h-9 w-full' /> {/* Input */}
                    </div>
                    {/* Add more input skeletons if needed for specific forms like register */}
                    <Skeleton className='h-10 w-full' /> {/* Button */}
                </div>
            </div>
        </div>
    );
}
