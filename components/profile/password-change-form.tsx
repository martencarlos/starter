'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';

import { useForm } from 'react-hook-form';
import { z } from 'zod';

const passwordChangeSchema = z
    .object({
        currentPassword: z.string().min(1, { message: 'Current password is required' }),
        newPassword: z
            .string()
            .min(8, { message: 'Password must be at least 8 characters long' })
            .max(100, { message: 'Password must be less than 100 characters' })
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
                message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
            }),
        confirmPassword: z.string()
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword']
    });

type PasswordChangeFormValues = z.infer<typeof passwordChangeSchema>;

interface PasswordChangeFormProps {
    userId: string;
    onSuccess: (message: string) => void;
    onError: (message: string) => void;
}

export function PasswordChangeForm({ userId, onSuccess, onError }: PasswordChangeFormProps) {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<PasswordChangeFormValues>({
        resolver: zodResolver(passwordChangeSchema)
    });

    const onSubmit = async (data: PasswordChangeFormValues) => {
        setIsLoading(true);

        try {
            const response = await fetch('/api/user/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId,
                    currentPassword: data.currentPassword,
                    newPassword: data.newPassword,
                    confirmPassword: data.confirmPassword
                })
            });

            const responseData = await response.json();

            if (!response.ok) {
                onError(responseData.message || 'Something went wrong');

                return;
            }

            onSuccess('Password changed successfully');
            reset();
        } catch (error) {
            onError('An unexpected error occurred');
            console.error('Password change error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='space-y-6'>
            <div>
                <h2 className='text-xl font-semibold'>Change Password</h2>
                <p className='text-muted-foreground text-sm'>Update your password to keep your account secure</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                <div className='space-y-2'>
                    <Label htmlFor='currentPassword'>Current Password</Label>
                    <Input
                        id='currentPassword'
                        type='password'
                        {...register('currentPassword')}
                        disabled={isLoading}
                        aria-invalid={errors.currentPassword ? 'true' : 'false'}
                    />
                    {errors.currentPassword && (
                        <p className='text-destructive text-sm'>{errors.currentPassword.message}</p>
                    )}
                </div>

                <div className='space-y-2'>
                    <Label htmlFor='newPassword'>New Password</Label>
                    <Input
                        id='newPassword'
                        type='password'
                        {...register('newPassword')}
                        disabled={isLoading}
                        aria-invalid={errors.newPassword ? 'true' : 'false'}
                    />
                    {errors.newPassword && <p className='text-destructive text-sm'>{errors.newPassword.message}</p>}
                </div>

                <div className='space-y-2'>
                    <Label htmlFor='confirmPassword'>Confirm New Password</Label>
                    <Input
                        id='confirmPassword'
                        type='password'
                        {...register('confirmPassword')}
                        disabled={isLoading}
                        aria-invalid={errors.confirmPassword ? 'true' : 'false'}
                    />
                    {errors.confirmPassword && (
                        <p className='text-destructive text-sm'>{errors.confirmPassword.message}</p>
                    )}
                </div>

                <Button type='submit' disabled={isLoading}>
                    {isLoading ? 'Changing Password...' : 'Change Password'}
                </Button>
            </form>
        </div>
    );
}
