// components/navigation.tsx
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

import { Navigation } from './navigation-client';
import { getServerSession } from 'next-auth/next';

export async function NavigationHeader() {
    const session = await getServerSession(authOptions);
    const isAuthenticated = !!session?.user;
    const userName = session?.user?.name;

    return <Navigation isAuthenticated={isAuthenticated} userName={userName} />;
}
