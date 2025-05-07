'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RegisterFormValues, registerSchema } from '@/lib/validations/auth';
import { zodResolver } from '@hookform/resolvers/zod';

import { useForm } from 'react-hook-form';

export function RegisterForm() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema)
    });

    const onSubmit = async (data: RegisterFormValues) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: data.name,
                    email: data.email,
                    password: data.password
                })
            });

            const responseData = await response.json();

            if (!response.ok) {
                // Enhanced error display
                console.error('Registration error:', responseData);
                if (responseData.formErrors) {
                    setError(
                        Object.entries(responseData.formErrors)
                            .filter(
                                ([key, value]) =>
                                    key !== '_errors' &&
                                    Array.isArray((value as any)?._errors) &&
                                    (value as any)._errors.length > 0
                            )
                            .map(([key, value]) => `${key}: ${(value as any)._errors.join(', ')}`)
                            .join('\n')
                    );
                } else {
                    setError(responseData.message || 'Something went wrong');
                }

                return;
            }

            // Redirect to login page on successful registration
            router.push('/login?registered=true');
        } catch (error) {
            setError('An unexpected error occurred');
            console.error('Registration error:', error);
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
                <Label htmlFor='name'>Name</Label>
                <Input
                    id='name'
                    type='text'
                    disabled={isLoading}
                    {...register('name')}
                    aria-invalid={errors.name ? 'true' : 'false'}
                />
                {errors.name && <p className='text-destructive text-sm'>{errors.name.message}</p>}
            </div>

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
                <Label htmlFor='password'>Password</Label>
                <Input
                    id='password'
                    type='password'
                    disabled={isLoading}
                    {...register('password')}
                    aria-invalid={errors.password ? 'true' : 'false'}
                />
                {errors.password && <p className='text-destructive text-sm'>{errors.password.message}</p>}
            </div>

            <div className='space-y-2'>
                <Label htmlFor='confirmPassword'>Confirm Password</Label>
                <Input
                    id='confirmPassword'
                    type='password'
                    disabled={isLoading}
                    {...register('confirmPassword')}
                    aria-invalid={errors.confirmPassword ? 'true' : 'false'}
                />
                {errors.confirmPassword && <p className='text-destructive text-sm'>{errors.confirmPassword.message}</p>}
            </div>

            <Button type='submit' className='w-full' disabled={isLoading}>
                {isLoading ? 'Creating account...' : 'Create account'}
            </Button>
        </form>
    );
}
