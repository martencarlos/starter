// app/(main)/layout.tsx
import React from 'react';

import { NavigationHeader } from '@/components/navigation';

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <NavigationHeader />
            <main>{children}</main>
            <footer className='border-t py-6'>
                <div className='text-muted-foreground container mx-auto px-4 text-center text-sm'>
                    &copy; {new Date().getFullYear()} Next.js 15 Starter Template
                </div>
            </footer>
        </>
    );
}
