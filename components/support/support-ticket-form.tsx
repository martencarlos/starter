'use client';

import { useState } from 'react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { categoryNames, ticketSchema } from '@/lib/support-utils';
import { zodResolver } from '@hookform/resolvers/zod';

import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// Type for the form values
type SupportTicketFormValues = z.infer<typeof ticketSchema>;

interface SupportTicketFormProps {
    user: {
        id: string;
        name?: string | null;
        email?: string | null;
    } | null;
    onSuccess: (message: string) => void;
    onError: (message: string) => void;
}

export function SupportTicketForm({ user, onSuccess, onError }: SupportTicketFormProps) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [formSubmitted, setFormSubmitted] = useState<boolean>(false);

    // Set default values based on authenticated user
    const defaultValues: Partial<SupportTicketFormValues> = {
        name: user?.name || '',
        email: user?.email || ''
    };

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
        setValue
    } = useForm<SupportTicketFormValues>({
        resolver: zodResolver(ticketSchema),
        defaultValues
    });

    const onSubmit = async (data: SupportTicketFormValues) => {
        setIsLoading(true);
        setSubmitError(null);

        try {
            // Submit the support ticket to the API
            const response = await fetch('/api/support/tickets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...data,
                    userId: user?.id || null
                })
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message || 'Failed to submit support ticket');
            }

            // Success! Reset the form and show a success message
            onSuccess(`Your support ticket #${responseData.ticketId} has been submitted successfully`);
            setFormSubmitted(true);
            reset(); // Reset the form values
        } catch (error) {
            setSubmitError(error instanceof Error ? error.message : 'An unexpected error occurred');
            onError('Failed to submit your support ticket. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCategoryChange = (value: string) => {
        setValue('category', value as any);
    };

    // If the form has been submitted successfully, show a success state
    if (formSubmitted) {
        return (
            <div className='py-6 text-center'>
                <div className='bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full'>
                    <svg
                        className='text-primary h-6 w-6'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                        xmlns='http://www.w3.org/2000/svg'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                    </svg>
                </div>
                <h3 className='text-lg font-medium'>Support Request Submitted</h3>
                <p className='text-muted-foreground mt-2'>
                    Thank you for reaching out. Our support team will review your request and respond as soon as
                    possible.
                </p>
                <Button className='mt-4' onClick={() => setFormSubmitted(false)}>
                    Submit Another Request
                </Button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            {submitError && (
                <Alert variant='destructive'>
                    <AlertDescription>{submitError}</AlertDescription>
                </Alert>
            )}

            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                <div className='space-y-2'>
                    <Label htmlFor='name'>Name</Label>
                    <Input
                        id='name'
                        {...register('name')}
                        disabled={isLoading || !!user?.name}
                        aria-invalid={errors.name ? 'true' : 'false'}
                    />
                    {errors.name && <p className='text-destructive text-sm'>{errors.name.message}</p>}
                </div>

                <div className='space-y-2'>
                    <Label htmlFor='email'>Email</Label>
                    <Input
                        id='email'
                        type='email'
                        {...register('email')}
                        disabled={isLoading || !!user?.email}
                        aria-invalid={errors.email ? 'true' : 'false'}
                    />
                    {errors.email && <p className='text-destructive text-sm'>{errors.email.message}</p>}
                </div>
            </div>

            <div className='space-y-2'>
                <Label htmlFor='subject'>Subject</Label>
                <Input
                    id='subject'
                    {...register('subject')}
                    disabled={isLoading}
                    aria-invalid={errors.subject ? 'true' : 'false'}
                    placeholder='Brief description of your issue'
                />
                {errors.subject && <p className='text-destructive text-sm'>{errors.subject.message}</p>}
            </div>

            <div className='space-y-2'>
                <Label htmlFor='category'>Category</Label>
                <Select onValueChange={handleCategoryChange} disabled={isLoading}>
                    <SelectTrigger id='category' aria-invalid={errors.category ? 'true' : 'false'}>
                        <SelectValue placeholder='Select a category' />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value='general'>{categoryNames.general}</SelectItem>
                        <SelectItem value='account'>{categoryNames.account}</SelectItem>
                        <SelectItem value='billing'>{categoryNames.billing}</SelectItem>
                        <SelectItem value='technical'>{categoryNames.technical}</SelectItem>
                        <SelectItem value='other'>{categoryNames.other}</SelectItem>
                    </SelectContent>
                </Select>
                {errors.category && <p className='text-destructive text-sm'>{errors.category.message}</p>}
            </div>

            <div className='space-y-2'>
                <Label htmlFor='message'>Message</Label>
                <Textarea
                    id='message'
                    rows={5}
                    {...register('message')}
                    disabled={isLoading}
                    aria-invalid={errors.message ? 'true' : 'false'}
                    placeholder='Please describe your issue in detail...'
                />
                {errors.message && <p className='text-destructive text-sm'>{errors.message.message}</p>}
            </div>

            <div className='text-right'>
                <Button type='submit' disabled={isLoading}>
                    {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                    {isLoading ? 'Submitting...' : 'Submit Ticket'}
                </Button>
            </div>
        </form>
    );
}
