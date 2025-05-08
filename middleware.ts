// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { getToken } from 'next-auth/jwt';

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

    // Check if the user is authenticated
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

    // Redirect unauthenticated users away from protected pages
    // But allow them to access public paths, main paths, and API paths
    if (!isAuthenticated && !isPublicPath && !isMainPath && !isApiPath) {
        const url = new URL('/login', request.url);
        url.searchParams.set('callbackUrl', encodeURI(pathname));

        return NextResponse.redirect(url);
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
