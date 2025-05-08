// app/profile/layout.tsx
import { ReactNode } from 'react';

import { redirect } from 'next/navigation';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';

import { getServerSession } from 'next-auth/next';

export default async function ProfileLayout({ children }: { children: ReactNode }) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/login?callbackUrl=/profile');
    }

    return <>{children}</>;
}
