// lib/rbac/with-permission-guard.tsx
import { redirect } from 'next/navigation';

import { authOptions } from '@/lib/auth-options';
import { roleService } from '@/lib/services/role-service';

import { getServerSession } from 'next-auth/next';

/**
 * Higher-order function to protect routes based on permissions
 * @param Component The component to render if the user has the required permission
 * @param permissionName The permission name required to access the component
 * @param redirectTo Where to redirect if the user doesn't have the required permission
 */
export function withPermissionGuard(
    Component: React.ComponentType<any>,
    permissionName: string,
    redirectTo: string = '/access-denied'
) {
    return async function GuardedComponent(props: any) {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            redirect('/login');
        }

        const hasPermission = await roleService.hasPermission(session.user.id, permissionName);

        if (!hasPermission) {
            redirect(redirectTo);
        }

        return <Component {...props} />;
    };
}
