// app/(admin)/admin/layout.tsx
import { ReactNode } from 'react';

import Link from 'next/link';
import { redirect } from 'next/navigation';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { authOptions } from '@/lib/auth-options';
import { roleService } from '@/lib/services/role-service';

import { getServerSession } from 'next-auth/next';

export default async function AdminLayout({ children }: { children: ReactNode }) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/login?callbackUrl=/admin');
    }

    // Check if user has admin role
    const isAdmin = await roleService.hasRole(session.user.id, 'admin');

    if (!isAdmin) {
        redirect('/dashboard');
    }

    return (
        <div className='container mx-auto px-4 py-8'>
            <h1 className='mb-6 text-3xl font-bold'>Admin Dashboard</h1>

            <Tabs defaultValue='users' className='w-full'>
                <TabsList className='mb-8'>
                    <Link href='/admin/users' passHref legacyBehavior>
                        <TabsTrigger value='users' asChild>
                            <a>Users</a>
                        </TabsTrigger>
                    </Link>
                    <Link href='/admin/roles' passHref legacyBehavior>
                        <TabsTrigger value='roles' asChild>
                            <a>Roles</a>
                        </TabsTrigger>
                    </Link>
                    <Link href='/admin/permissions' passHref legacyBehavior>
                        <TabsTrigger value='permissions' asChild>
                            <a>Permissions</a>
                        </TabsTrigger>
                    </Link>
                </TabsList>

                {children}
            </Tabs>
        </div>
    );
}
