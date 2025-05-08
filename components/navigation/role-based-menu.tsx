// components/navigation/role-based-menu.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { usePermissions, useRoles } from '@/hooks/use-rbac';

// components/navigation/role-based-menu.tsx

export function RoleBasedMenu() {
    const pathname = usePathname();
    const { hasRole } = useRoles();
    const { hasPermission } = usePermissions();

    const isActive = (path: string) => {
        return pathname.startsWith(path) ? 'text-primary font-medium' : 'text-foreground/60';
    };

    return (
        <nav className='flex flex-col space-y-1'>
            {/* Always visible */}
            <Link
                href='/dashboard'
                className={`hover:text-primary text-sm transition-colors ${isActive('/dashboard')}`}>
                Dashboard
            </Link>

            <Link href='/profile' className={`hover:text-primary text-sm transition-colors ${isActive('/profile')}`}>
                Profile
            </Link>

            {/* Role-based links */}
            {hasRole('admin') && (
                <Link
                    href='/admin/users'
                    className={`hover:text-primary text-sm transition-colors ${isActive('/admin')}`}>
                    Admin
                </Link>
            )}

            {/* Permission-based links */}
            {hasPermission('read:users') && (
                <Link href='/users' className={`hover:text-primary text-sm transition-colors ${isActive('/users')}`}>
                    Users
                </Link>
            )}

            {hasPermission('read:reports') && (
                <Link
                    href='/reports'
                    className={`hover:text-primary text-sm transition-colors ${isActive('/reports')}`}>
                    Reports
                </Link>
            )}
        </nav>
    );
}
