// app/admin/layout.tsx
import { ReactNode } from 'react';

import Link from 'next/link';
import { redirect } from 'next/navigation';

import { AdminTabs } from '@/components/admin/admin-tabs';
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
            <AdminTabs>{children}</AdminTabs>
        </div>
    );
}
