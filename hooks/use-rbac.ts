// hooks/use-rbac.ts
'use client';

import { useSession } from 'next-auth/react';

// hooks/use-rbac.ts

export function useRoles() {
    const { data: session } = useSession();

    const hasRole = (roleName: string): boolean => {
        if (!session?.user?.roles) return false;

        return session.user.roles.includes(roleName);
    };

    const isAdmin = (): boolean => {
        return hasRole('admin');
    };

    return {
        roles: session?.user?.roles || [],
        hasRole,
        isAdmin
    };
}

export function usePermissions() {
    const { data: session } = useSession();

    const hasPermission = (permissionName: string): boolean => {
        if (!session?.user?.permissions) return false;

        return session.user.permissions.includes(permissionName);
    };

    return {
        permissions: session?.user?.permissions || [],
        hasPermission
    };
}
