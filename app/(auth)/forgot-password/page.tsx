// app/(auth)/forgot-password/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';

import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';

export const metadata: Metadata = {
    title: 'Forgot Password',
    description: 'Reset your password'
};

export default function ForgotPasswordPage() {
    return (
        <div className='sm:mx-auto sm:w-full sm:max-w-md'>
            <h2 className='mt-6 text-center text-3xl font-bold tracking-tight'>Forgot your password?</h2>
            <p className='text-muted-foreground mt-2 text-center text-sm'>
                Enter your email address and we'll send you a link to reset your password.
            </p>

            <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
                <div className='bg-card px-4 py-8 shadow sm:rounded-lg sm:px-10'>
                    <ForgotPasswordForm />

                    <div className='mt-6 flex items-center justify-center'>
                        <div className='text-sm'>
                            <Link href='/login' className='text-primary hover:text-primary/80 font-medium'>
                                Back to login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
