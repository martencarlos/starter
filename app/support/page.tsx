// app/support/page.tsx
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import SupportContent from '@/components/support/support-content';
import { authOptions } from '@/lib/auth-options';

import { getServerSession } from 'next-auth/next';

export const metadata: Metadata = {
    title: 'Support',
    description: 'Get help and support for your account'
};

export default async function SupportPage({ searchParams }: { searchParams?: { tab?: string } }) {
    // Get the user session to check if the user is logged in
    const session = await getServerSession(authOptions);
    const user = session?.user || null;
    const isAdmin = user?.roles?.includes('admin') || false;

    // If there's a session, user is logged in, provide user data
    // If not, the SupportContent component will handle unauthenticated users

    // Check if there's a tab query parameter
    let initialTab = await searchParams?.tab;

    // Determine the effective initial tab
    if (isAdmin) {
        // Admins should only see 'tickets'. If URL specifies 'contact' or 'faq', or no tab, force 'tickets'.
        if (!initialTab || initialTab === 'contact' || initialTab === 'faq') {
            initialTab = 'tickets';
        }
    } else {
        // Non-admins default to 'contact' if no tab is specified.
        if (!initialTab) {
            initialTab = 'contact';
        }
    }

    // If user is not logged in and trying to access tickets tab, redirect to login
    if (!user && initialTab === 'tickets') {
        redirect(`/login?callbackUrl=/support?tab=tickets`);
    }

    // If the URL's tab param is different for an admin (e.g., tried to access contact/faq), redirect.
    if (
        isAdmin &&
        searchParams?.tab &&
        searchParams.tab !== 'tickets' &&
        (searchParams.tab === 'contact' || searchParams.tab === 'faq')
    ) {
        redirect('/support?tab=tickets');
    }

    return <SupportContent user={user} initialActiveTab={initialTab as 'contact' | 'faq' | 'tickets'} />;
}
