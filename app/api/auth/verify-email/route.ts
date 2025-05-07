import { NextRequest, NextResponse } from 'next/server';

import { userService } from '@/lib/services/user-service';

export async function GET(req: NextRequest) {
    try {
        // Get token from URL
        const { searchParams } = new URL(req.url);
        const token = searchParams.get('token');

        if (!token) {
            return NextResponse.json({ message: 'Verification token is required' }, { status: 400 });
        }

        // Verify email
        const success = await userService.verifyEmail(token);

        if (!success) {
            return NextResponse.json({ message: 'Invalid or expired token' }, { status: 400 });
        }

        // Redirect to login page with verified=true query parameter
        return NextResponse.redirect(new URL('/login?verified=true', req.url));
    } catch (error) {
        console.error('Email verification error:', error);

        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
