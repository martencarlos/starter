// middleware.ts (additional updates)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { getToken } from 'next-auth/jwt';

// Map of paths to required permissions
const PERMISSION_REQUIREMENTS: Record<string, string> = {
    '/users': 'read:users',
    '/reports': 'read:reports',
    '/api/users': 'read:users',
    '/api/reports': 'read:reports'
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
        '/', // Root path
        '/home', // Main homepage
        '/login',
        '/register',
        '/forgot-password',
        '/reset-password',
        '/verify-email'
    ];

    // Check if the path is a public path
    const isPublicPath = publicPaths.some((path) => (path === '/' ? pathname === '/' : pathname.startsWith(path)));

    // Check if the path is for main pages (excluding dashboard and other protected routes)
    const isMainPath =
        pathname.startsWith('/home') ||
        pathname.startsWith('/about') ||
        pathname.startsWith('/contact') ||
        pathname.startsWith('/pricing');

    // Check if the path is for API routes
    const isApiPath = pathname.startsWith('/api');

    // Get the JWT token
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    const isAuthenticated = !!token;

    // Redirect authenticated users away from auth pages
    if (
        isAuthenticated &&
        (pathname === '/login' ||
            pathname === '/register' ||
            pathname === '/forgot-password' ||
            pathname.startsWith('/reset-password'))
    ) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // If not authenticated and trying to access a protected route
    if (!isAuthenticated && !isPublicPath && !isMainPath) {
        // For API routes, return 401 Unauthorized
        if (isApiPath) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        // For regular routes, redirect to login
        const url = new URL('/login', request.url);
        url.searchParams.set('callbackUrl', encodeURI(pathname));

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
                    if (isApiPath) {
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
                    if (isApiPath) {
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

// Configure middleware to run on specific paths
export const config = {
    matcher: [
        // Match all request paths except for the ones starting with:
        // - _next/static (static files)
        // - _next/image (image optimization files)
        // - favicon.ico (favicon file)
        // - public (public files)
        '/((?!_next/static|_next/image|favicon.ico|public).*)'
    ]
};
