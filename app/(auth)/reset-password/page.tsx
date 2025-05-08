// app/(auth)/reset-password/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';

import { ResetPasswordForm } from '@/components/auth/reset-password-form';

export const metadata: Metadata = {
    title: 'Reset Password',
    description: 'Reset your password'
};

export default function ResetPasswordPage({ searchParams }: { searchParams: { token?: string } }) {
    const { token } = searchParams;

    // If no token is provided, show an error message
    if (!token) {
        return (
            <div className='sm:mx-auto sm:w-full sm:max-w-md'>
                <h2 className='mt-6 text-center text-3xl font-bold tracking-tight'>Invalid Reset Link</h2>
                <p className='text-muted-foreground mt-2 text-center text-sm'>
                    The password reset link is invalid or has expired.
                </p>
                <div className='mt-6 text-center'>
                    <Link href='/forgot-password' className='text-primary hover:text-primary/80 font-medium'>
                        Request a new password reset link
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className='sm:mx-auto sm:w-full sm:max-w-md'>
            <h2 className='mt-6 text-center text-3xl font-bold tracking-tight'>Reset your password</h2>
            <p className='text-muted-foreground mt-2 text-center text-sm'>Enter a new password for your account.</p>

            <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
                <div className='bg-card px-4 py-8 shadow sm:rounded-lg sm:px-10'>
                    <ResetPasswordForm token={token} />
                </div>
            </div>
        </div>
    );
}
