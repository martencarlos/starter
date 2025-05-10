// app/admin/layout.tsx
import { ReactNode } from 'react';

import { Metadata } from 'next';

// Keep for main title link if needed

// It's good practice to have a general metadata for the layout
export const metadata: Metadata = {
    title: 'Admin', // Base title for admin section
    description: 'Administration Dashboard'
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <h1 className='mb-6 text-3xl font-bold'>Admin Dashboard</h1>
            {/* The children will be app/admin/view/page.tsx or specific pages like app/admin/roles/[id]/page.tsx */}
            {children}
        </>
    );
}
