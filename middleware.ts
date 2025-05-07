import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { getToken } from 'next-auth/jwt';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Define public paths that don't require authentication
    const publicPaths = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-email'];
    const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

    // Check if the path is for API routes
    const isApiPath = pathname.startsWith('/api');

    // Check if the user is authenticated
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    const isAuthenticated = !!token;

    // Redirect authenticated users away from auth pages
    if (isAuthenticated && isPublicPath) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Redirect unauthenticated users away from protected pages
    if (!isAuthenticated && !isPublicPath && !isApiPath) {
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
