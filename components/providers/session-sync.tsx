// components/providers/session-sync.tsx
'use client';

import { useEffect } from 'react';

import { usePathname, useRouter } from 'next/navigation';

import { useSession } from 'next-auth/react';

// components/providers/session-sync.tsx

/**
 * Component to synchronize session state and force refresh when session state changes
 * This helps prevent flashes of unauthenticated content
 */
export function SessionSync() {
    const { status, data: session } = useSession();
    const router = useRouter();
    const pathname = usePathname();

    // Track session status changes
    useEffect(() => {
        // When session state changes, refresh the page
        if (status === 'authenticated' || status === 'unauthenticated') {
            router.refresh();
        }
    }, [status, router]);

    // Use a div with hidden role to prevent affecting page structure
    return <div role='none' style={{ display: 'none' }} />;
}
