import { authOptions } from '@/lib/auth-options';

import { NavigationClient } from './navigation-client';
import { getServerSession } from 'next-auth/next';

export async function NavigationHeader() {
    // Get the session server-side
    const session = await getServerSession(authOptions);

    // Pre-render the navigation with the server-side session state
    return <NavigationClient initialSession={session} />;
}
