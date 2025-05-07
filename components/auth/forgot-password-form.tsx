'use client';

import { useState } from 'react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ResetPasswordFormValues, resetPasswordSchema } from '@/lib/validations/auth';
import { zodResolver } from '@hookform/resolvers/zod';

import { useForm } from 'react-hook-form';

export function ForgotPasswordForm() {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<ResetPasswordFormValues>({
        resolver: zodResolver(resetPasswordSchema)
    });

    const onSubmit = async (data: ResetPasswordFormValues) => {
        setIsLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: data.email
                })
            });

            const responseData = await response.json();

            if (!response.ok) {
                setError(responseData.message || 'Something went wrong');

                return;
            }

            setSuccess(true);
        } catch (error) {
            setError('An unexpected error occurred');
            console.error('Forgot password error:', error);
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

            {success && (
                <Alert>
                    <AlertDescription>
                        If your email is registered, you will receive reset instructions shortly.
                    </AlertDescription>
                </Alert>
            )}

            <div className='space-y-2'>
                <Label htmlFor='email'>Email</Label>
                <Input
                    id='email'
                    type='email'
                    placeholder='name@example.com'
                    disabled={isLoading || success}
                    {...register('email')}
                    aria-invalid={errors.email ? 'true' : 'false'}
                />
                {errors.email && <p className='text-destructive text-sm'>{errors.email.message}</p>}
            </div>

            <Button type='submit' className='w-full' disabled={isLoading || success}>
                {isLoading ? 'Sending...' : 'Send reset link'}
            </Button>
        </form>
    );
}
