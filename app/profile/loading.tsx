// app/profile/loading.tsx
import { Skeleton } from '@/components/ui/skeleton';

export default function ProfileLoading() {
    return (
        <div className='container mx-auto max-w-4xl px-4 py-8'>
            <div className='mb-8 flex items-start justify-between'>
                <div>
                    <Skeleton className='h-9 w-48' /> {/* Profile Settings H1 */}
                    <div className='mt-2 flex flex-wrap gap-2'>
                        <Skeleton className='h-6 w-16 rounded-md' />
                        <Skeleton className='h-6 w-20 rounded-md' />
                    </div>
                </div>
                <Skeleton className='h-12 w-12 rounded-full' /> {/* UserAvatar */}
            </div>

            <div className='w-full'>
                {/* TabsList Skeleton */}
                <div className='bg-muted mb-6 flex w-full justify-start space-x-1 rounded-lg p-1'>
                    <Skeleton className='bg-background/50 h-8 flex-1 rounded-md' /> {/* Tab Trigger */}
                    <Skeleton className='bg-background/50 h-8 flex-1 rounded-md' /> {/* Tab Trigger */}
                </div>

                {/* TabsContent Skeleton (mimicking AccountInfoForm structure) */}
                <div className='bg-card space-y-6 rounded-lg border p-6 shadow-sm'>
                    <div>
                        <Skeleton className='h-6 w-1/3' /> {/* Section Title */}
                        <Skeleton className='mt-1 h-4 w-1/2' /> {/* Section Description */}
                    </div>
                    <div className='space-y-4'>
                        <div className='space-y-2'>
                            <Skeleton className='h-4 w-16' /> {/* Label */}
                            <Skeleton className='h-9 w-full' /> {/* Input */}
                        </div>
                        <div className='space-y-2'>
                            <Skeleton className='h-4 w-16' /> {/* Label */}
                            <Skeleton className='h-9 w-full' /> {/* Input (disabled) */}
                            <Skeleton className='mt-1 h-3 w-2/3' /> {/* Helper text */}
                        </div>
                        <Skeleton className='h-10 w-28' /> {/* Button */}
                    </div>
                </div>
            </div>
        </div>
    );
}
