// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { getToken } from 'next-auth/jwt';

// Map of paths to required permissions
const PERMISSION_REQUIREMENTS: Record<string, string> = {
    '/users': 'read:users', // Example UI route requiring permission
    '/api/users': 'read:users', // Example API route requiring permission
    // Admin support management routes
    '/api/admin/support': 'manage:support',
    '/admin/support': 'manage:support',
    // Support agent routes
    '/api/support/admin': 'view:support'
    // Add other permission-protected paths here
};

// Map of paths to required roles
const ROLE_REQUIREMENTS: Record<string, string> = {
    '/admin': 'admin', // Covers /admin and its subpaths like /admin/users, /admin/roles etc.
    '/api/admin': 'admin', // Covers all API routes under /api/admin/*
    // Allow access to support agent dashboard for both admins and support agents
    '/support/dashboard': 'support_agent' // This is handled differently in the middleware function
    // Add other role-protected paths here
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
        '/access-denied', // Access denied page is public
        '/api/auth', // NextAuth API routes
        '/support' // Main support page is public (authentication handled within page)
    ];

    // Static assets should always be accessible
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/static') || // if you have a /public/static folder
        pathname.startsWith('/images') || // if you have a /public/images folder
        pathname.startsWith('/fonts') || // if you have a /public/fonts folder or /app/fonts
        pathname.endsWith('.ico') || // favicons
        pathname.endsWith('.png') ||
        pathname.endsWith('.jpg') ||
        pathname.endsWith('.svg') ||
        pathname.endsWith('.woff') ||
        pathname.endsWith('.woff2')
    ) {
        return NextResponse.next();
    }

    // Check if the path is a public path (exact match or prefix for /api/auth)
    const isPublicPath = publicPaths.some((publicPath) => {
        if (publicPath === '/') return pathname === '/';
        if (publicPath === '/api/auth') return pathname.startsWith('/api/auth');
        if (publicPath === '/support') return pathname === '/support';

        return pathname === publicPath || pathname.startsWith(publicPath + '/');
    });

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
        if (pathname.startsWith('/api/')) {
            // More specific check for API routes
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        // For regular routes, redirect to login
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('callbackUrl', pathname + request.nextUrl.search);

        return NextResponse.redirect(loginUrl);
    }

    // If authenticated, perform role and permission checks
    if (isAuthenticated) {
        const userRoles = (token.roles as string[]) || [];
        const userPermissions = (token.permissions as string[]) || [];

        // Special handling for routes that can be accessed by multiple roles
        // For example, support agent dashboard can be accessed by both 'admin' and 'support_agent' roles
        if (pathname.startsWith('/support/dashboard')) {
            const hasAccess = userRoles.includes('admin') || userRoles.includes('support_agent');

            if (!hasAccess) {
                if (pathname.startsWith('/api/')) {
                    return NextResponse.json({ message: 'Forbidden: Insufficient permissions' }, { status: 403 });
                }

                return NextResponse.redirect(new URL('/access-denied', request.url));
            }

            // If they have access, continue to the next middleware
            return NextResponse.next();
        }

        // For ticket detail pages, ensure users can only access their own tickets
        // (unless they have admin or support_agent roles)
        if (pathname.match(/\/support\/tickets\/[\w-]+$/)) {
            const hasAdminAccess = userRoles.includes('admin') || userRoles.includes('support_agent');

            // If user has admin access, they can view any ticket
            if (hasAdminAccess) {
                return NextResponse.next();
            }

            // Otherwise, we'll let the page component handle access control
            // The page component will verify if the ticket belongs to the user
            return NextResponse.next();
        }

        // Check Role Requirements
        // Iterate through ROLE_REQUIREMENTS to find a match for the current pathname
        for (const [pathPrefix, requiredRole] of Object.entries(ROLE_REQUIREMENTS)) {
            if (pathname.startsWith(pathPrefix)) {
                if (!userRoles.includes(requiredRole)) {
                    if (pathname.startsWith('/api/')) {
                        return NextResponse.json(
                            { message: `Forbidden: Role '${requiredRole}' required.` },
                            { status: 403 }
                        );
                    }

                    return NextResponse.redirect(new URL('/access-denied', request.url));
                }
                // If role requirement is met for this prefix, no need to check other role prefixes
                // But continue to check permissions if any
                break;
            }
        }

        // Check Permission Requirements
        // Iterate through PERMISSION_REQUIREMENTS to find a match
        for (const [pathPrefix, requiredPermission] of Object.entries(PERMISSION_REQUIREMENTS)) {
            if (pathname.startsWith(pathPrefix)) {
                if (!userPermissions.includes(requiredPermission)) {
                    if (pathname.startsWith('/api/')) {
                        return NextResponse.json(
                            { message: `Forbidden: Permission '${requiredPermission}' required.` },
                            { status: 403 }
                        );
                    }

                    return NextResponse.redirect(new URL('/access-denied', request.url));
                }
                // If permission requirement is met for this prefix, no need to check other permission prefixes
                break;
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
        // - (these are already handled by the conditional return above, but good for clarity)
        '/((?!_next/static|_next/image|.*\\.ico$|.*\\.png$|.*\\.jpg$|.*\\.svg$|.*\\.woff$|.*\\.woff2$).*)'
    ]
};
