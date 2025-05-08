// lib/auth-helpers.ts
import { redirect } from 'next/navigation';

import { authOptions } from '@/lib/auth-options';
import { roleService } from '@/lib/services/role-service';

import { getServerSession } from 'next-auth/next';

export async function requireAuthentication(redirectTo: string = '/login') {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect(`${redirectTo}?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
    }

    return session.user;
}

export async function requireRole(roleName: string, redirectTo: string = '/dashboard') {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect('/login');
    }

    const hasRole = await roleService.hasRole(session.user.id, roleName);

    if (!hasRole) {
        redirect(redirectTo);
    }

    return session.user;
}

export async function requirePermission(permissionName: string, redirectTo: string = '/dashboard') {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect('/login');
    }

    const hasPermission = await roleService.hasPermission(session.user.id, permissionName);

    if (!hasPermission) {
        redirect(redirectTo);
    }

    return session.user;
}
