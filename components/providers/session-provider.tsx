// components/providers/session-provider.tsx
'use client';

import { ReactNode } from 'react';

import { SessionProvider } from 'next-auth/react';

// components/providers/session-provider.tsx

export function NextAuthProvider({ children }: { children: ReactNode }) {
    return (
        <SessionProvider
            // Refresh session if it's stale when window gets focus
            refetchOnWindowFocus={true}
            // Don't auto-poll for session changes (we'll handle this via SessionSync)
            refetchInterval={0}
            // Disabling this helps prevent hydration mismatch
            refetchWhenOffline={false}>
            {children}
        </SessionProvider>
    );
}
