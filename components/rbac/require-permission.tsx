// components/rbac/require-permission.tsx
'use client';

import { ReactNode, useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { usePermissions } from '@/hooks/use-rbac';

// components/rbac/require-permission.tsx

interface RequirePermissionProps {
    permission: string;
    children: ReactNode;
    fallback?: ReactNode | null;
    redirectTo?: string;
}

export function RequirePermission({ permission, children, fallback = null, redirectTo }: RequirePermissionProps) {
    const { hasPermission } = usePermissions();
    const router = useRouter();

    useEffect(() => {
        if (redirectTo && !hasPermission(permission)) {
            router.push(redirectTo);
        }
    }, [permission, hasPermission, redirectTo, router]);

    if (!hasPermission(permission)) {
        return fallback;
    }

    return <>{children}</>;
}
