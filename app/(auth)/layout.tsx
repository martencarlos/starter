// app/(auth)/layout.tsx
import React from 'react';

import { NavigationHeader } from '@/components/navigation';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <NavigationHeader />
            <div className='flex min-h-screen flex-col items-center justify-center py-12 sm:px-6 lg:px-8'>
                {children}
            </div>
        </>
    );
}
