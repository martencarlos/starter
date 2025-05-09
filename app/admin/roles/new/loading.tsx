// app/admin/roles/new/loading.tsx
import { Skeleton } from '@/components/ui/skeleton';

export default function CreateRoleLoading() {
    return (
        <div className='container mx-auto px-4 py-8'>
            <Skeleton className='mb-8 h-9 w-1/3 md:w-1/4' /> {/* Matches "Create Role" H1 */}
            <div className='bg-card space-y-6 rounded-lg border p-6 shadow-sm'>
                {/* Form field skeletons */}
                <div className='space-y-2'>
                    <Skeleton className='h-4 w-20' /> {/* Label: Role Name */}
                    <Skeleton className='h-9 w-full' /> {/* Input */}
                </div>
                <div className='space-y-2'>
                    <Skeleton className='h-4 w-24' /> {/* Label: Description */}
                    <Skeleton className='h-20 w-full' /> {/* Textarea */}
                </div>
                <div className='space-y-2'>
                    <Skeleton className='h-4 w-32' /> {/* Label: Permissions */}
                    <Skeleton className='h-9 w-full' /> {/* Select */}
                </div>

                {/* Button skeletons */}
                <div className='flex justify-end gap-4 pt-4'>
                    <Skeleton className='h-9 w-24' /> {/* Cancel Button */}
                    <Skeleton className='h-9 w-32' /> {/* Create Role Button */}
                </div>
            </div>
        </div>
    );
}
