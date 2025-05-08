// lib/api/with-authorization.ts
import { NextRequest, NextResponse } from 'next/server';

import { authOptions } from '@/lib/auth-options';
import { roleService } from '@/lib/services/role-service';

import { getServerSession } from 'next-auth/next';

type RouteHandler = (req: NextRequest, ...args: any[]) => Promise<NextResponse>;

/**
 * Higher-order function for protecting API routes with authentication
 */
export function withAuth(handler: RouteHandler): RouteHandler {
    return async (req: NextRequest, ...args) => {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        return handler(req, ...args);
    };
}

/**
 * Higher-order function for protecting API routes with role-based access control
 */
export function withRole(roleName: string, handler: RouteHandler): RouteHandler {
    return async (req: NextRequest, ...args) => {
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

/**
 * Higher-order function for protecting API routes with permission-based access control
 */
export function withPermission(permissionName: string, handler: RouteHandler): RouteHandler {
    return async (req: NextRequest, ...args) => {
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
