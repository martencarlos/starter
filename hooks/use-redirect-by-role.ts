// hooks/use-redirect-by-role.ts
'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { useSession } from 'next-auth/react';

// hooks/use-redirect-by-role.ts

/**
 * Hook that redirects users based on their roles after login
 * @param defaultPath Default path to redirect to if no role-specific redirect applies
 */
export function useRedirectByRole(defaultPath: string = '/dashboard') {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'authenticated' && session?.user?.roles) {
            const roles = session.user.roles;

            // Define role-based redirects
            if (roles.includes('admin')) {
                router.push('/admin/dashboard');
            } else if (roles.includes('editor')) {
                router.push('/editor');
            } else {
                router.push(defaultPath);
            }
        }
    }, [status, session, router, defaultPath]);
}
