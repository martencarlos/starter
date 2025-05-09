// app/support/tickets/[id]/loading.tsx
import { Skeleton } from '@/components/ui/skeleton';

export default function TicketDetailLoading() {
    return (
        <div className='container mx-auto max-w-4xl px-4 py-8'>
            <div className='mb-6'>
                <Skeleton className='mb-4 h-9 w-32' /> {/* Back button */}
                <Skeleton className='mb-2 h-7 w-3/4' /> {/* Ticket title */}
                <Skeleton className='h-5 w-1/2' /> {/* Ticket metadata */}
            </div>

            <div className='space-y-6'>
                {/* Conversation card */}
                <div className='bg-card rounded-lg border shadow-sm'>
                    <div className='border-b p-4 sm:px-6'>
                        <div className='flex items-center justify-between'>
                            <Skeleton className='h-6 w-32' /> {/* Card title */}
                            <Skeleton className='h-6 w-16 rounded-full' /> {/* Status badge */}
                        </div>
                    </div>
                    <div className='p-4 sm:p-6'>
                        <div className='space-y-6'>
                            {/* Message skeletons */}
                            {[1, 2, 3].map((i) => (
                                <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                                    <Skeleton
                                        className={`h-24 rounded-lg ${i % 2 === 0 ? 'mr-12 w-3/4' : 'ml-12 w-2/3'}`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='border-t p-4 sm:px-6'>
                        <div className='space-y-4'>
                            <Skeleton className='h-24 w-full' /> {/* Textarea */}
                            <div className='flex justify-between'>
                                <Skeleton className='h-10 w-28' /> {/* Close button */}
                                <Skeleton className='h-10 w-32' /> {/* Reply button */}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Ticket information card */}
                <div className='bg-card rounded-lg border shadow-sm'>
                    <div className='p-4 sm:px-6'>
                        <Skeleton className='mb-3 h-6 w-40' /> {/* Card title */}
                    </div>
                    <div className='p-4 sm:px-6'>
                        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i}>
                                    <Skeleton className='mb-1 h-4 w-20' /> {/* Field label */}
                                    <Skeleton className='h-5 w-28' /> {/* Field value */}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
