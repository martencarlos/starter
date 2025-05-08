// components/providers/session-provider.tsx
'use client';

import { ReactNode } from 'react';

import { SessionProvider } from 'next-auth/react';

// components/providers/session-provider.tsx

export function NextAuthProvider({ children }: { children: ReactNode }) {
    return <SessionProvider>{children}</SessionProvider>;
}
