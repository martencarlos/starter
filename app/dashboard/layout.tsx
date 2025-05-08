// app/(dashboard)/layout.tsx
import React from 'react';

import { redirect } from 'next/navigation';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { NavigationHeader } from '@/components/navigation';

import { getServerSession } from 'next-auth/next';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect('/login');
    }

    return (
        <div className='flex min-h-screen flex-col'>
            <NavigationHeader />
            <main className='flex-1'>{children}</main>
            <footer className='border-t py-6'>
                <div className='text-muted-foreground container mx-auto px-4 text-center text-sm'>
                    &copy; {new Date().getFullYear()} Next.js 15 Starter Template
                </div>
            </footer>
        </div>
    );
}
