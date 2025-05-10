// app/admin/layout.tsx
import { ReactNode } from 'react';

import { Metadata } from 'next';
// Keep for main title link if needed
import { redirect } from 'next/navigation';

import { authOptions } from '@/lib/auth-options';
import { roleService } from '@/lib/services/role-service';

import { getServerSession } from 'next-auth/next';

// It's good practice to have a general metadata for the layout
export const metadata: Metadata = {
    title: 'Admin', // Base title for admin section
    description: 'Administration Dashboard'
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
    const session = await getServerSession(authOptions);

    if (!session) {
        // If accessing /admin/* directly, preserve the full path
        // The callbackUrl should be dynamic based on the attempted access path
        // This logic is likely handled by middleware.ts, but good to be robust.
        redirect('/login?callbackUrl=/admin/view'); // Redirect to the new default admin view
    }

    const isAdmin = await roleService.hasRole(session.user.id, 'admin');

    if (!isAdmin) {
        // If not an admin, redirect to a general dashboard or access denied page
        redirect('/dashboard'); // Or '/access-denied' if preferred
    }

    return (
        <div className='container mx-auto px-4 py-8'>
            {/* The children will be app/admin/view/page.tsx or specific pages like app/admin/roles/[id]/page.tsx */}
            {children}
        </div>
    );
}
