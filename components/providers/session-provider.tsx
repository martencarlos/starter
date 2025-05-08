// components/providers/session-provider.tsx
'use client';

import { ReactNode } from 'react';

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';

// components/providers/session-provider.tsx

export function NextAuthProvider({ children }: { children: ReactNode }) {
    return (
        <NextAuthSessionProvider
            // When refetchOnWindowFocus is true, it can trigger multiple session fetch attempts
            // that would result in these errors when logged out
            refetchOnWindowFocus={false}
            // Setting this to 0 prevents automatic polling for session changes
            refetchInterval={0}
            // Don't attempt to fetch sessions when offline
            refetchWhenOffline={false}>
            {children}
        </NextAuthSessionProvider>
    );
}
