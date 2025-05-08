// app/(auth)/login/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';

import { LoginForm } from '@/components/auth/login-form';

export const metadata: Metadata = {
    title: 'Login',
    description: 'Login to your account'
};

export default async function LoginPage({ searchParams }) {
    // In Next.js 15, searchParams needs to be awaited
    const resolvedSearchParams = await searchParams;

    return (
        <div className='sm:mx-auto sm:w-full sm:max-w-md'>
            <h2 className='mt-6 text-center text-3xl font-bold tracking-tight'>Sign in to your account</h2>
            <p className='text-muted-foreground mt-2 text-center text-sm'>
                Or{' '}
                <Link href='/register' className='text-primary hover:text-primary/80 font-medium'>
                    create a new account
                </Link>
            </p>

            <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
                <div className='bg-card px-4 py-4 shadow sm:rounded-lg sm:px-10'>
                    <LoginForm callbackUrl={resolvedSearchParams?.callbackUrl} />
                </div>
            </div>
        </div>
    );
}
