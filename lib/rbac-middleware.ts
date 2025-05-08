// lib/rbac-middleware.ts
import { NextRequest, NextResponse } from 'next/server';

import { authOptions } from '@/lib/auth-options';
import { roleService } from '@/lib/services/role-service';

import { getServerSession } from 'next-auth/next';

export function withAuth(handler: Function) {
    return async (req: NextRequest, ...args: any[]) => {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        return handler(req, ...args);
    };
}

export function withRole(roleName: string, handler: Function) {
    return async (req: NextRequest, ...args: any[]) => {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const hasRole = await roleService.hasRole(session.user.id, roleName);

        if (!hasRole) {
            return NextResponse.json({ message: 'Forbidden: Insufficient role' }, { status: 403 });
        }

        return handler(req, ...args);
    };
}

export function withPermission(permissionName: string, handler: Function) {
    return async (req: NextRequest, ...args: any[]) => {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const hasPermission = await roleService.hasPermission(session.user.id, permissionName);

        if (!hasPermission) {
            return NextResponse.json({ message: 'Forbidden: Insufficient permission' }, { status: 403 });
        }

        return handler(req, ...args);
    };
}
