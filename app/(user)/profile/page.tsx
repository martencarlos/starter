// app/profile/page.tsx
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import ProfileContent from '@/components/profile/profile-content';

import { getServerSession } from 'next-auth/next';

export const metadata: Metadata = {
    title: 'Profile',
    description: 'Manage your account settings'
};

export default async function ProfilePage() {
    // Get the user session
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect('/login');
    }

    return <ProfileContent user={session.user} />;
}
