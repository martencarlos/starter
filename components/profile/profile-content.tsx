// components/profile/profile-content.tsx (update)
'use client';

import { useState } from 'react';

import { AccountInfoForm } from '@/components/profile/account-info-form';
import { PasswordChangeForm } from '@/components/profile/password-change-form';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserAvatar } from '@/components/ui/user-avatar';

import { toast } from 'sonner';

// components/profile/profile-content.tsx (update)

interface ProfileContentProps {
    user: {
        id: string;
        name?: string | null;
        email?: string | null;
        image?: string | null;
        roles?: string[];
    };
}

export default function ProfileContent({ user }: ProfileContentProps) {
    const showSuccessToast = (message: string) => {
        toast.success(message);
    };

    const showErrorToast = (message: string) => {
        toast.error(message);
    };

    return (
        <div className='container mx-auto max-w-4xl px-4 py-8'>
            <div className='mb-8 flex items-center justify-between'>
                <div>
                    <h1 className='text-3xl font-bold'>Profile Settings</h1>

                    {/* Display user roles as badges */}
                    {user.roles && user.roles.length > 0 && (
                        <div className='mt-2 flex flex-wrap gap-2'>
                            {user.roles.map((role) => (
                                <Badge key={role} variant='outline'>
                                    {role}
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>
                <UserAvatar name={user.name} imageUrl={user.image} size='lg' />
            </div>

            <Tabs defaultValue='account' className='w-full'>
                <TabsList className='mb-6 w-full justify-start'>
                    <TabsTrigger value='account'>Account Info</TabsTrigger>
                    <TabsTrigger value='security'>Security</TabsTrigger>
                </TabsList>

                <div className='bg-card rounded-lg border p-6 shadow-sm'>
                    <TabsContent value='account'>
                        <AccountInfoForm user={user} onSuccess={showSuccessToast} onError={showErrorToast} />
                    </TabsContent>

                    <TabsContent value='security'>
                        <PasswordChangeForm userId={user.id} onSuccess={showSuccessToast} onError={showErrorToast} />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
}
