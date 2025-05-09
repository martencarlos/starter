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

    // If there's a session, user is logged in, provide user data
    // If not, the SupportContent component will handle unauthenticated users

    // Check if there's a tab query parameter
    const activeTab = searchParams?.tab || 'contact';

    // If user is not logged in and trying to access tickets tab, redirect to login
    if (!session?.user && activeTab === 'tickets') {
        redirect('/login?callbackUrl=/support?tab=tickets');
    }

    return (
        <SupportContent user={session?.user || null} initialActiveTab={activeTab as 'contact' | 'faq' | 'tickets'} />
    );
}
