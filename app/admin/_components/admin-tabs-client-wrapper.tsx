// app/admin/_components/admin-tabs-client-wrapper.tsx
'use client';

import { ReactNode, Suspense } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// app/admin/_components/admin-tabs-client-wrapper.tsx

// For loading state

interface AdminTabsClientWrapperProps {
    usersContent: ReactNode;
    rolesContent: ReactNode;
    permissionsContent: ReactNode;
    analyticsContent: ReactNode;
    auditContent: ReactNode;
}

const validTabs = ['users', 'roles', 'permissions', 'analytics', 'audit'];

export default function AdminTabsClientWrapper({
    usersContent,
    rolesContent,
    permissionsContent,
    analyticsContent,
    auditContent
}: AdminTabsClientWrapperProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentTab = searchParams.get('tab') || 'users';

    const activeTab = validTabs.includes(currentTab) ? currentTab : 'users';

    const handleTabChange = (value: string) => {
        const newPath = `${pathname}?tab=${value}`;
        router.replace(newPath, { shallow: true });
    };

    // Helper for Suspense fallback
    const TabSkeleton = () => (
        <div className='space-y-4 p-4'>
            <Skeleton className='h-8 w-1/4' />
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-20 w-full' />
            <Skeleton className='h-20 w-full' />
        </div>
    );

    return (
        <Tabs value={activeTab} onValueChange={handleTabChange} className='w-full'>
            <TabsList className='mb-8'>
                <TabsTrigger value='users'>Users</TabsTrigger>
                <TabsTrigger value='roles'>Roles</TabsTrigger>
                <TabsTrigger value='permissions'>View Permissions</TabsTrigger>
                <TabsTrigger value='analytics'>Analytics</TabsTrigger>
                <TabsTrigger value='audit'>Audit Log</TabsTrigger>
            </TabsList>

            <TabsContent value='users'>
                <Suspense fallback={<TabSkeleton />}>{usersContent}</Suspense>
            </TabsContent>
            <TabsContent value='roles'>
                <Suspense fallback={<TabSkeleton />}>{rolesContent}</Suspense>
            </TabsContent>
            <TabsContent value='permissions'>
                <Suspense fallback={<TabSkeleton />}>{permissionsContent}</Suspense>
            </TabsContent>
            <TabsContent value='analytics'>
                <Suspense fallback={<TabSkeleton />}>{analyticsContent}</Suspense>
            </TabsContent>
            <TabsContent value='audit'>
                <Suspense fallback={<TabSkeleton />}>{auditContent}</Suspense>
            </TabsContent>
        </Tabs>
    );
}
