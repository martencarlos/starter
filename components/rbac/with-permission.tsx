// components/rbac/with-permission.tsx
'use client';

import { ReactNode } from 'react';

import { usePermissions } from '@/hooks/use-rbac';

// components/rbac/with-permission.tsx

interface WithPermissionProps {
    permission: string;
    children: ReactNode;
    fallback?: ReactNode;
}

export function WithPermission({ permission, children, fallback = null }: WithPermissionProps) {
    const { hasPermission } = usePermissions();

    if (!hasPermission(permission)) {
        return fallback;
    }

    return <>{children}</>;
}
