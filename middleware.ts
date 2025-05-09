// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { getToken } from 'next-auth/jwt';

// Map of paths to required permissions
const PERMISSION_REQUIREMENTS: Record<string, string> = {
    '/users': 'read:users',
    '/api/users': 'read:users'
};

// Map of paths to required roles
const ROLE_REQUIREMENTS: Record<string, string> = {
    '/admin': 'admin',
    '/admin/users': 'admin',
    '/admin/roles': 'admin',
    '/admin/permissions': 'admin',
    '/admin/analytics': 'admin'
};

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Define public paths that don't require authentication
    const publicPaths = [
        '/', // Root path (homepage)
        '/login',
        '/register',
        '/forgot-password',
        '/reset-password',
        '/verify-email',
        '/api/auth' // NextAuth API routes
    ];

    // Static assets should always be accessible
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/static') ||
        pathname.startsWith('/images') ||
        pathname.startsWith('/favicon.ico')
    ) {
        return NextResponse.next();
    }

    // Check if the path is a public path
    const isPublicPath = publicPaths.some((path) => (path === '/' ? pathname === '/' : pathname.startsWith(path)));

    // Public assets and API routes should be accessible
    if (isPublicPath) {
        return NextResponse.next();
    }

    // Get the JWT token
    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET
    });

    const isAuthenticated = !!token;

    // If not authenticated and trying to access a protected route
    if (!isAuthenticated) {
        // For API routes, return 401 Unauthorized
        if (pathname.startsWith('/api')) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        // For regular routes, redirect to login
        const url = new URL('/login', request.url);
        url.searchParams.set('callbackUrl', encodeURIComponent(pathname));

        return NextResponse.redirect(url);
    }

    // If authenticated, check permission requirements
    if (isAuthenticated) {
        // Check if this path requires specific permissions
        for (const [pathPrefix, requiredPermission] of Object.entries(PERMISSION_REQUIREMENTS)) {
            if (pathname.startsWith(pathPrefix)) {
                // Get user permissions from the token
                const userPermissions = (token.permissions as string[]) || [];

                // If user doesn't have the required permission
                if (!userPermissions.includes(requiredPermission)) {
                    // For API routes, return 403 Forbidden
                    if (pathname.startsWith('/api')) {
                        return NextResponse.json(
                            {
                                message: `Forbidden: Missing required permission: ${requiredPermission}`
                            },
                            { status: 403 }
                        );
                    }

                    // For regular routes, redirect to access denied page
                    return NextResponse.redirect(new URL('/access-denied', request.url));
                }
            }
        }

        // Check if this path requires specific roles
        for (const [pathPrefix, requiredRole] of Object.entries(ROLE_REQUIREMENTS)) {
            if (pathname.startsWith(pathPrefix)) {
                // Get user roles from the token
                const userRoles = (token.roles as string[]) || [];

                // If user doesn't have the required role
                if (!userRoles.includes(requiredRole)) {
                    // For API routes, return 403 Forbidden
                    if (pathname.startsWith('/api')) {
                        return NextResponse.json(
                            {
                                message: `Forbidden: Missing required role: ${requiredRole}`
                            },
                            { status: 403 }
                        );
                    }

                    // For regular routes, redirect to access denied page
                    return NextResponse.redirect(new URL('/access-denied', request.url));
                }
            }
        }
    }

    return NextResponse.next();
}

// Configure middleware to run on specific paths and exclude static files
export const config = {
    matcher: [
        // Match all request paths except for the ones starting with:
        // - _next/static (static files)
        // - _next/image (image optimization files)
        // - favicon.ico (favicon file)
        // - public folder files
        '/((?!_next/static|_next/image|favicon.ico|public).*)'
    ]
};
