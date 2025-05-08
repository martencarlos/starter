// components/rbac/with-role.tsx
'use client';

import { ReactNode } from 'react';

import { useRoles } from '@/hooks/use-rbac';

// components/rbac/with-role.tsx

interface WithRoleProps {
    role: string;
    children: ReactNode;
    fallback?: ReactNode;
}

export function WithRole({ role, children, fallback = null }: WithRoleProps) {
    const { hasRole } = useRoles();

    if (!hasRole(role)) {
        return fallback;
    }

    return <>{children}</>;
}
