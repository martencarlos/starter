// lib/auth-helpers.ts
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

// To get pathname in Server Components

import { authOptions } from '@/lib/auth-options';
import { roleService } from '@/lib/services/role-service';

import { getServerSession } from 'next-auth/next';

// Helper to get current pathname on the server
async function getCurrentPathname(): Promise<string> {
    const headersList = await headers();
    const url = headersList.get('x-url') || headersList.get('referer') || '';
    try {
        return new URL(url).pathname;
    } catch {
        return '/'; // Fallback
    }
}

export async function requirePermission(
    permissionName: string,
    options: { redirectTo?: string; currentPathname?: string } = {}
) {
    const { redirectTo = '/dashboard', currentPathname = await getCurrentPathname() } = options;
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect(`/login?callbackUrl=${encodeURIComponent(currentPathname)}`);
    }

    const hasPermission = await roleService.hasPermission(session.user.id, permissionName);

    if (!hasPermission) {
        redirect(redirectTo);
    }

    return session.user;
}
