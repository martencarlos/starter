// app/(auth)/register/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';

import { RegisterForm } from '@/components/auth/register-form';

export const metadata: Metadata = {
    title: 'Register',
    description: 'Create a new account'
};

export default function RegisterPage() {
    return (
        <div className='sm:mx-auto sm:w-full sm:max-w-md'>
            <h2 className='mt-6 text-center text-3xl font-bold tracking-tight'>Create a new account</h2>
            <p className='text-muted-foreground mt-2 text-center text-sm'>
                Already have an account?{' '}
                <Link href='/login' className='text-primary hover:text-primary/80 font-medium'>
                    Sign in
                </Link>
            </p>

            <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
                <div className='bg-card px-4 py-8 shadow sm:rounded-lg sm:px-10'>
                    <RegisterForm />
                </div>
            </div>
        </div>
    );
}
