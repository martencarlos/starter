// app/(auth)/login/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';

import { LoginForm } from '@/components/auth/login-form';

export const metadata: Metadata = {
    title: 'Login',
    description: 'Login to your account'
};

type SearchParams = Promise<{
    registered?: string;
    reset?: string;
    error?: string;
}>;

export default async function LoginPage({ searchParams }: { searchParams: SearchParams }) {
    // No need to use search params directly in the component render
    // Just pass them to the login form component
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
                    <LoginForm searchParams={searchParams} />
                </div>
            </div>
        </div>
    );
}
