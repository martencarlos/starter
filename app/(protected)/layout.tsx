// app/(protected)/layout.tsx
import { ReactNode } from 'react';

import { redirect } from 'next/navigation';

import { RoleBasedMenu } from '@/components/navigation/role-based-menu';
import { authOptions } from '@/lib/auth-options';

import { getServerSession } from 'next-auth/next';

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect('/login');
    }

    return (
        <div className='flex min-h-screen flex-col md:flex-row'>
            <aside className='bg-card border-r p-4 md:min-h-screen md:w-64'>
                <div className='sticky top-20'>
                    <h2 className='mb-4 text-lg font-semibold'>Navigation</h2>
                    <RoleBasedMenu />
                </div>
            </aside>
            <main className='flex-1'>{children}</main>
        </div>
    );
}
