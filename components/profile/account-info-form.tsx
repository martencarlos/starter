'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSessionUpdate } from '@/lib/session-update';
import { zodResolver } from '@hookform/resolvers/zod';

import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const accountInfoSchema = z.object({
    name: z
        .string()
        .min(2, { message: 'Name must be at least 2 characters long' })
        .max(50, { message: 'Name must be less than 50 characters' })
});

type AccountInfoFormValues = z.infer<typeof accountInfoSchema>;

interface AccountInfoFormProps {
    user: {
        id: string;
        name?: string | null;
        email?: string | null;
    };
    onSuccess: (message: string) => void;
    onError: (message: string) => void;
}

export function AccountInfoForm({ user, onSuccess, onError }: AccountInfoFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { updateSession } = useSessionUpdate();
    const { update } = useSession();

    const {
        register,
        handleSubmit,
        formState: { errors, isDirty }
    } = useForm<AccountInfoFormValues>({
        resolver: zodResolver(accountInfoSchema),
        defaultValues: {
            name: user.name || ''
        }
    });

    const onSubmit = async (data: AccountInfoFormValues) => {
        if (!isDirty) {
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/user/update-profile', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: data.name
                })
            });

            const responseData = await response.json();

            if (!response.ok) {
                onError(responseData.message || 'Something went wrong');
                console.error('Error updating profile:', responseData);

                return;
            }

            // Update the session with the new user data
            await update({
                name: data.name
            });

            // Show success message
            onSuccess('Account information updated successfully');

            // Force refresh to ensure the UI updates
            router.refresh();
        } catch (error) {
            onError('An unexpected error occurred');
            console.error('Update profile error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='space-y-6'>
            <div>
                <h2 className='text-xl font-semibold'>Account Information</h2>
                <p className='text-muted-foreground text-sm'>Update your account details</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                <div className='space-y-2'>
                    <Label htmlFor='name'>Name</Label>
                    <Input
                        id='name'
                        placeholder='Your name'
                        {...register('name')}
                        disabled={isLoading}
                        aria-invalid={errors.name ? 'true' : 'false'}
                    />
                    {errors.name && <p className='text-destructive text-sm'>{errors.name.message}</p>}
                </div>

                <div className='space-y-2'>
                    <Label htmlFor='email'>Email</Label>
                    <Input id='email' value={user.email || ''} disabled={true} readOnly aria-readonly='true' />
                    <p className='text-muted-foreground text-xs'>Your email address cannot be changed</p>
                </div>

                <Button type='submit' disabled={isLoading || !isDirty}>
                    {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
            </form>
        </div>
    );
}
