'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NewPasswordFormValues, newPasswordSchema } from '@/lib/validations/auth';
import { zodResolver } from '@hookform/resolvers/zod';

import { useForm } from 'react-hook-form';

interface ResetPasswordFormProps {
    token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<NewPasswordFormValues>({
        resolver: zodResolver(newPasswordSchema)
    });

    const onSubmit = async (data: NewPasswordFormValues) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token,
                    password: data.password,
                    confirmPassword: data.confirmPassword
                })
            });

            const responseData = await response.json();

            if (!response.ok) {
                setError(responseData.message || 'Something went wrong');

                return;
            }

            setSuccess(true);

            // Redirect to login page after a short delay
            setTimeout(() => {
                router.push('/login?reset=true');
            }, 3000);
        } catch (error) {
            setError('An unexpected error occurred');
            console.error('Reset password error:', error);
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
                        Your password has been reset successfully. Redirecting to login page...
                    </AlertDescription>
                </Alert>
            )}

            <div className='space-y-2'>
                <Label htmlFor='password'>New Password</Label>
                <Input
                    id='password'
                    type='password'
                    disabled={isLoading || success}
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
                    disabled={isLoading || success}
                    {...register('confirmPassword')}
                    aria-invalid={errors.confirmPassword ? 'true' : 'false'}
                />
                {errors.confirmPassword && <p className='text-destructive text-sm'>{errors.confirmPassword.message}</p>}
            </div>

            <Button type='submit' className='w-full' disabled={isLoading || success}>
                {isLoading ? 'Resetting...' : 'Reset Password'}
            </Button>
        </form>
    );
}
