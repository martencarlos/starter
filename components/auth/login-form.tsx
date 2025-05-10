'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoginFormValues, loginSchema } from '@/lib/validations/auth';
import { zodResolver } from '@hookform/resolvers/zod';

import { signIn, useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface LoginFormProps {
    callbackUrl?: string;
}

export function LoginForm({ callbackUrl = '/dashboard' }: LoginFormProps) {
    const router = useRouter();
    useSession();
    const searchParams = useSearchParams();

    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);
    const [verificationNeeded, setVerificationNeeded] = useState<boolean>(false);
    const [verificationEmail, setVerificationEmail] = useState<string>('');
    const [resendingEmail, setResendingEmail] = useState<boolean>(false);

    // Get registration success status from URL
    const registered = searchParams.get('registered') === 'true';
    const registeredEmail = searchParams.get('email');
    const verified = searchParams.get('verified') === 'true';
    const reset = searchParams.get('reset') === 'true';

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: registeredEmail || ''
        }
    });

    // Set default email if provided in URL
    useEffect(() => {
        if (registeredEmail) {
            setValue('email', registeredEmail);
        }
    }, [registeredEmail, setValue]);

    const handleResendVerification = async () => {
        if (!verificationEmail) return;

        setResendingEmail(true);
        try {
            const response = await fetch('/api/auth/resend-verification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: verificationEmail })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to resend verification email');
            }

            // Show success message
            toast.success('Verification email sent. Please check your inbox.');
        } catch (error) {
            console.error('Failed to resend verification email:', error);
            toast.error('Failed to resend verification email. Please try again later.');
        } finally {
            setResendingEmail(false);
        }
    };

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
                // Handle verification error specifically
                if (result.error === 'Please verify your email before signing in') {
                    setVerificationNeeded(true);
                    setVerificationEmail(data.email);
                }
                setError(result.error);
                setIsLoading(false);

                return;
            }

            // Redirect to callbackUrl or dashboard
            router.push(callbackUrl);
            router.refresh();
        } catch (error) {
            setError('An unexpected error occurred');
            console.error('Login error:', error);
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setIsGoogleLoading(true);

        try {
            await signIn('google', { callbackUrl });
        } catch (error) {
            console.error('Google sign in error:', error);
            setIsGoogleLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            {error && (
                <Alert variant='destructive'>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            {verificationNeeded && (
                <Alert>
                    <AlertDescription className='flex flex-col space-y-2'>
                        <p>
                            Your email address has not been verified. Please check your inbox for a verification link.
                        </p>
                        <Button
                            variant='outline'
                            size='sm'
                            onClick={handleResendVerification}
                            disabled={resendingEmail}
                            className='self-start'>
                            {resendingEmail ? 'Sending...' : 'Resend verification email'}
                        </Button>
                    </AlertDescription>
                </Alert>
            )}

            {registered && (
                <Alert>
                    <AlertDescription>
                        Registration successful! Please check your email to verify your account before signing in.
                    </AlertDescription>
                </Alert>
            )}

            {verified && (
                <Alert>
                    <AlertDescription>Your email has been verified successfully! You can now sign in.</AlertDescription>
                </Alert>
            )}

            {reset && (
                <Alert>
                    <AlertDescription>
                        Your password has been reset successfully! You can now sign in with your new password.
                    </AlertDescription>
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
                    <Link
                        href='/forgot-password'
                        className='text-primary hover:text-primary/80 text-sm font-medium'
                        tabIndex={-1}>
                        Forgot password?
                    </Link>
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

            <Button type='submit' className='w-full' disabled={isLoading || isGoogleLoading}>
                {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>

            <div className='relative'>
                <div className='absolute inset-0 flex items-center'>
                    <span className='w-full border-t'></span>
                </div>
                <div className='relative flex justify-center text-xs uppercase'>
                    <span className='bg-card text-muted-foreground px-2'>Or continue with</span>
                </div>
            </div>

            <Button
                type='button'
                variant='outline'
                className='flex w-full items-center justify-center gap-2'
                onClick={handleGoogleSignIn}
                disabled={isLoading || isGoogleLoading}>
                {!isGoogleLoading && (
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 24 24'
                        width='24'
                        height='24'
                        className='h-5 w-5'>
                        <path
                            fill='#4285F4'
                            d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                        />
                        <path
                            fill='#34A853'
                            d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                        />
                        <path
                            fill='#FBBC05'
                            d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                        />
                        <path
                            fill='#EA4335'
                            d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                        />
                    </svg>
                )}
                {isGoogleLoading ? 'Signing in...' : 'Sign in with Google'}
            </Button>
        </form>
    );
}
