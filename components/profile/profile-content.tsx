'use client';

import { useState } from 'react';

import { AccountInfoForm } from '@/components/profile/account-info-form';
import { PasswordChangeForm } from '@/components/profile/password-change-form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/ui/user-avatar';

interface ProfileContentProps {
    user: {
        id: string;
        name?: string | null;
        email?: string | null;
        image?: string | null;
    };
}

export default function ProfileContent({ user }: ProfileContentProps) {
    const [activeTab, setActiveTab] = useState<'account' | 'security'>('account');
    const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const showSuccessMessage = (message: string) => {
        setStatusMessage({ type: 'success', message });
        // Auto-dismiss success message after 5 seconds
        setTimeout(() => setStatusMessage(null), 5000);
    };

    const showErrorMessage = (message: string) => {
        setStatusMessage({ type: 'error', message });
    };

    return (
        <div className='container mx-auto max-w-4xl px-4 py-8'>
            <div className='mb-8 flex items-center justify-between'>
                <h1 className='text-3xl font-bold'>Profile Settings</h1>
                <UserAvatar name={user.name} imageUrl={user.image} size='lg' />
            </div>

            {statusMessage && (
                <Alert variant={statusMessage.type === 'error' ? 'destructive' : 'default'} className='mb-6'>
                    <AlertDescription>{statusMessage.message}</AlertDescription>
                </Alert>
            )}

            <div className='mb-6 flex space-x-2 border-b'>
                <Button
                    variant={activeTab === 'account' ? 'default' : 'ghost'}
                    className={`rounded-none ${activeTab === 'account' ? 'border-primary border-b-2' : ''}`}
                    onClick={() => setActiveTab('account')}>
                    Account Info
                </Button>
                <Button
                    variant={activeTab === 'security' ? 'default' : 'ghost'}
                    className={`rounded-none ${activeTab === 'security' ? 'border-primary border-b-2' : ''}`}
                    onClick={() => setActiveTab('security')}>
                    Security
                </Button>
            </div>

            <div className='bg-card rounded-lg border p-6 shadow-sm'>
                {activeTab === 'account' ? (
                    <AccountInfoForm user={user} onSuccess={showSuccessMessage} onError={showErrorMessage} />
                ) : (
                    <PasswordChangeForm userId={user.id} onSuccess={showSuccessMessage} onError={showErrorMessage} />
                )}
            </div>
        </div>
    );
}
