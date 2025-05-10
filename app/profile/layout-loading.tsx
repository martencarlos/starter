// app/profile/layout-loading.tsx
import { Skeleton } from '@/components/ui/skeleton';

export default function ProfileLayoutLoading() {
    return (
        <div className='container mx-auto max-w-4xl px-4 py-8'>
            <div className='mb-8 flex items-start justify-between'>
                <Skeleton className='h-9 w-44' />
                <Skeleton className='h-12 w-12 rounded-full' />
            </div>
            <Skeleton className='h-[500px] w-full rounded-lg' />
        </div>
    );
}
