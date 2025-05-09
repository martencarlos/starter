// app/dashboard/loading.tsx
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardLoading() {
    return (
        <div className='container mx-auto px-4 py-8'>
            <div className='mb-8'>
                <Skeleton className='h-9 w-3/4 md:w-1/2' /> {/* Welcome H1 */}
                <Skeleton className='mt-2 h-5 w-full md:w-3/4' /> {/* Subtext */}
            </div>

            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                {/* Card skeletons */}
                {[1, 2, 3].map((i) => (
                    <div key={i} className='bg-card space-y-3 rounded-lg border p-6 shadow-sm'>
                        <Skeleton className='h-6 w-1/2' /> {/* CardTitle */}
                        <Skeleton className='h-4 w-3/4' /> {/* CardDescription */}
                        <Skeleton className='h-10 w-full pt-2' /> {/* Button */}
                    </div>
                ))}
            </div>

            <div className='bg-card mt-10 rounded-lg border p-6 shadow-sm'>
                <Skeleton className='mb-4 h-7 w-1/3' /> {/* "Your Access Information" H2 */}
                <div className='space-y-6'>
                    <div>
                        <Skeleton className='mb-2 h-5 w-1/4' /> {/* "Your Roles" H3 */}
                        <div className='flex flex-wrap gap-2'>
                            <Skeleton className='h-6 w-16 rounded-full' />
                            <Skeleton className='h-6 w-20 rounded-full' />
                        </div>
                    </div>
                    <div>
                        <Skeleton className='mb-2 h-5 w-1/4' /> {/* "Your Permissions" H3 */}
                        <div className='flex flex-wrap gap-2'>
                            <Skeleton className='h-5 w-24 rounded-full' />
                            <Skeleton className='h-5 w-28 rounded-full' />
                            <Skeleton className='h-5 w-20 rounded-full' />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
