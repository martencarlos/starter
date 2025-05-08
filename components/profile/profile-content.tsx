'use client';

import { useState } from 'react';

import { AccountInfoForm } from '@/components/profile/account-info-form';
import { PasswordChangeForm } from '@/components/profile/password-change-form';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/ui/user-avatar';

import { toast } from 'sonner';

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

    const showSuccessToast = (message: string) => {
        toast.success(message);
    };

    const showErrorToast = (message: string) => {
        toast.error(message);
    };

    return (
        <div className='container mx-auto max-w-4xl px-4 py-8'>
            <div className='mb-8 flex items-center justify-between'>
                <h1 className='text-3xl font-bold'>Profile Settings</h1>
                <UserAvatar name={user.name} imageUrl={user.image} size='lg' />
            </div>

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
                    <AccountInfoForm user={user} onSuccess={showSuccessToast} onError={showErrorToast} />
                ) : (
                    <PasswordChangeForm userId={user.id} onSuccess={showSuccessToast} onError={showErrorToast} />
                )}
            </div>
        </div>
    );
}
