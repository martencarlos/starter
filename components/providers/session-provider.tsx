'use client';

import { ReactNode } from 'react';

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';

export function NextAuthProvider({ children }: { children: ReactNode }) {
    return (
        <NextAuthSessionProvider
            // Refresh session if it's stale when window gets focus
            refetchOnWindowFocus={true}
            // Don't auto-poll for session changes (manual refresh is better for performance)
            refetchInterval={0}
            // Disabling this helps prevent hydration mismatch
            refetchWhenOffline={false}
            // This is important - it tells NextAuth to use the initial server-side session
            // rather than triggering a revalidation immediately on mount
            // (which would cause the flash we're seeing)
        >
            {children}
        </NextAuthSessionProvider>
    );
}
