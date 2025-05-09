// app/support/loading.tsx
import { Skeleton } from '@/components/ui/skeleton';

export default function SupportLoading() {
    return (
        <div className='container mx-auto max-w-4xl px-4 py-8'>
            <div className='mb-8 space-y-2'>
                <Skeleton className='h-9 w-44' /> {/* Support Center heading */}
                <Skeleton className='h-5 w-72' /> {/* Subheading */}
            </div>

            {/* Tabs skeleton */}
            <div className='mb-6 flex w-full space-x-2'>
                <Skeleton className='h-10 w-28 rounded-md' />
                <Skeleton className='h-10 w-24 rounded-md' />
                <Skeleton className='h-10 w-24 rounded-md' />
            </div>

            {/* Main content area skeleton - Contact form tab by default */}
            <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
                {/* Form area */}
                <div className='md:col-span-2'>
                    <div className='bg-card rounded-lg border p-6 shadow-sm'>
                        <div className='mb-6 space-y-2'>
                            <Skeleton className='h-6 w-48' /> {/* Card title */}
                            <Skeleton className='h-4 w-72' /> {/* Card description */}
                        </div>

                        <div className='space-y-4'>
                            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                                <div className='space-y-2'>
                                    <Skeleton className='h-4 w-12' /> {/* Name label */}
                                    <Skeleton className='h-10 w-full' /> {/* Name input */}
                                </div>
                                <div className='space-y-2'>
                                    <Skeleton className='h-4 w-12' /> {/* Email label */}
                                    <Skeleton className='h-10 w-full' /> {/* Email input */}
                                </div>
                            </div>

                            <div className='space-y-2'>
                                <Skeleton className='h-4 w-16' /> {/* Subject label */}
                                <Skeleton className='h-10 w-full' /> {/* Subject input */}
                            </div>

                            <div className='space-y-2'>
                                <Skeleton className='h-4 w-20' /> {/* Category label */}
                                <Skeleton className='h-10 w-full' /> {/* Category select */}
                            </div>

                            <div className='space-y-2'>
                                <Skeleton className='h-4 w-16' /> {/* Message label */}
                                <Skeleton className='h-32 w-full' /> {/* Message textarea */}
                            </div>

                            <div className='flex justify-end'>
                                <Skeleton className='h-10 w-32' /> {/* Submit button */}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact info area */}
                <div>
                    <div className='bg-card rounded-lg border p-6 shadow-sm'>
                        <div className='mb-4 space-y-2'>
                            <Skeleton className='h-6 w-40' /> {/* Card title */}
                            <Skeleton className='h-4 w-56' /> {/* Card description */}
                        </div>

                        <div className='space-y-4'>
                            {[1, 2, 3].map((i) => (
                                <div key={i} className='flex items-start gap-3'>
                                    <Skeleton className='h-5 w-5' /> {/* Icon */}
                                    <div className='flex-1 space-y-1'>
                                        <Skeleton className='h-4 w-24' /> {/* Contact method */}
                                        <Skeleton className='h-4 w-36' /> {/* Contact detail */}
                                        <Skeleton className='h-3 w-28' /> {/* Extra info */}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className='bg-card mt-4 rounded-lg border p-4 shadow-sm'>
                        <Skeleton className='mb-3 h-5 w-28' /> {/* Status title */}
                        <div className='flex items-center gap-2'>
                            <Skeleton className='h-3 w-3 rounded-full' /> {/* Status indicator */}
                            <Skeleton className='h-4 w-36' /> {/* Status text */}
                        </div>
                    </div>
                </div>
            </div>

            {/* Call to action for unauthenticated users */}
            <div className='mt-10 rounded-lg border p-6'>
                <div className='flex flex-col items-center space-y-3'>
                    <Skeleton className='h-6 w-48' /> {/* Heading */}
                    <Skeleton className='h-4 w-64' /> {/* Text */}
                    <div className='flex gap-3'>
                        <Skeleton className='h-10 w-24' /> {/* Sign In button */}
                        <Skeleton className='h-10 w-32' /> {/* Create Account button */}
                    </div>
                </div>
            </div>
        </div>
    );
}
