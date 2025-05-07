import { Metadata } from 'next';
import Link from 'next/link';

import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';

export const metadata: Metadata = {
    title: 'Forgot Password',
    description: 'Reset your password'
};

export default function ForgotPasswordPage() {
    return (
        <div className='flex min-h-screen flex-col items-center justify-center py-12 sm:px-6 lg:px-8'>
            <div className='sm:mx-auto sm:w-full sm:max-w-md'>
                <h2 className='mt-6 text-center text-3xl font-bold tracking-tight text-gray-900'>
                    Forgot your password?
                </h2>
                <p className='mt-2 text-center text-sm text-gray-600'>
                    Enter your email address and we'll send you a link to reset your password.
                </p>
            </div>

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
