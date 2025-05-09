'use client';

import { ReactNode } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AdminTabsProps {
    children: ReactNode;
}

export function AdminTabs({ children }: AdminTabsProps) {
    // Get the current path to set the active tab
    const pathname = usePathname();
    let activeTab = 'users';

    if (pathname.includes('/admin/roles')) {
        activeTab = 'roles';
    } else if (pathname.includes('/admin/analytics')) {
        activeTab = 'analytics';
    } else if (pathname.includes('/admin/audit')) {
        // Assuming /admin/audit is a tab
        activeTab = 'audit';
    } else if (pathname.includes('/admin/permissions')) {
        // For viewing predefined permissions
        activeTab = 'permissions';
    }

    return (
        <Tabs defaultValue={activeTab} value={activeTab} className='w-full'>
            <TabsList className='mb-8'>
                <Link href='/admin/users'>
                    <TabsTrigger value='users'>Users</TabsTrigger>
                </Link>
                <Link href='/admin/roles'>
                    <TabsTrigger value='roles'>Roles</TabsTrigger>
                </Link>
                <Link href='/admin/permissions'>
                    <TabsTrigger value='permissions'>View Permissions</TabsTrigger>
                </Link>
                <Link href='/admin/analytics'>
                    <TabsTrigger value='analytics'>Analytics</TabsTrigger>
                </Link>
                <Link href='/admin/audit'>
                    <TabsTrigger value='audit'>Audit Log</TabsTrigger>
                </Link>
            </TabsList>

            {children}
        </Tabs>
    );
}
