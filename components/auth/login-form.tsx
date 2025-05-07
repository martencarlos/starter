'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoginFormValues, loginSchema } from '@/lib/validations/auth';
import { zodResolver } from '@hookform/resolvers/zod';

import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';

export function LoginForm() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema)
    });

    const onSubmit = async (data: LoginFormValues) => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await signIn('credentials', {
                email: data.email,
                password: data.password,
                redirect: false
            });

            if (result?.error) {
                setError(result.error);

                return;
            }

            // Redirect to dashboard on success
            router.refresh();
            router.push('/dashboard');
        } catch (error) {
            setError('An unexpected error occurred');
            console.error('Login error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            {error && (
                <Alert variant='destructive'>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <div className='space-y-2'>
                <Label htmlFor='email'>Email</Label>
                <Input
                    id='email'
                    type='email'
                    placeholder='name@example.com'
                    disabled={isLoading}
                    {...register('email')}
                    aria-invalid={errors.email ? 'true' : 'false'}
                />
                {errors.email && <p className='text-destructive text-sm'>{errors.email.message}</p>}
            </div>

            <div className='space-y-2'>
                <div className='flex items-center justify-between'>
                    <Label htmlFor='password'>Password</Label>
                </div>
                <Input
                    id='password'
                    type='password'
                    disabled={isLoading}
                    {...register('password')}
                    aria-invalid={errors.password ? 'true' : 'false'}
                />
                {errors.password && <p className='text-destructive text-sm'>{errors.password.message}</p>}
            </div>

            <Button type='submit' className='w-full' disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
        </form>
    );
}
