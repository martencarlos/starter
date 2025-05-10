// components/profile/profile-content.tsx
'use client';

import { AccountInfoForm } from '@/components/profile/account-info-form';
import { PasswordChangeForm } from '@/components/profile/password-change-form';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserAvatar } from '@/components/ui/user-avatar';

import { toast } from 'sonner';

// components/profile/profile-content.tsx

// components/profile/profile-content.tsx

interface ProfileContentProps {
    user: {
        id: string;
        name?: string | null;
        email?: string | null;
        image?: string | null;
        roles?: string[];
        // Added fields
        createdAt?: string | null; // ISO date string
        emailVerified?: boolean | null;
        oauthProvider?: string | null;
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

            {/* Account Overview Section */}
            <div className='mb-8'>
                <div className='bg-card rounded-lg border p-6 shadow-sm'>
                    <h2 className='mb-4 text-xl font-semibold'>Account Overview</h2>
                    <div className='grid grid-cols-1 gap-x-4 gap-y-3 md:grid-cols-2'>
                        <div>
                            <p className='text-muted-foreground text-sm font-medium'>User ID</p>
                            <p className='text-sm break-all'>{user.id}</p>
                        </div>
                        {user.createdAt && (
                            <div>
                                <p className='text-muted-foreground text-sm font-medium'>Member Since</p>
                                <p className='text-sm'>
                                    {new Date(user.createdAt).toLocaleDateString(undefined, {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                        )}
                        <div>
                            <p className='text-muted-foreground text-sm font-medium'>Email Status</p>
                            <Badge variant={user.emailVerified ? 'default' : 'secondary'}>
                                {user.emailVerified ? 'Verified' : 'Not Verified'}
                            </Badge>
                        </div>
                        {user.oauthProvider && (
                            <div>
                                <p className='text-muted-foreground text-sm font-medium'>Connected Account</p>
                                <p className='text-sm capitalize'>{user.oauthProvider}</p>
                            </div>
                        )}
                    </div>
                </div>
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
