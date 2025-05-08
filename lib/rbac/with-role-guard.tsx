// lib/rbac/with-role-guard.tsx
import { redirect } from 'next/navigation';

import { authOptions } from '@/lib/auth-options';
import { roleService } from '@/lib/services/role-service';

import { getServerSession } from 'next-auth/next';

/**
 * Higher-order function to protect routes based on roles
 * @param Component The component to render if the user has the required role
 * @param roleName The role name required to access the component
 * @param redirectTo Where to redirect if the user doesn't have the required role
 */
export function withRoleGuard(
    Component: React.ComponentType<any>,
    roleName: string,
    redirectTo: string = '/access-denied'
) {
    return async function GuardedComponent(props: any) {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            redirect('/login');
        }

        const hasRole = await roleService.hasRole(session.user.id, roleName);

        if (!hasRole) {
            redirect(redirectTo);
        }

        return <Component {...props} />;
    };
}
