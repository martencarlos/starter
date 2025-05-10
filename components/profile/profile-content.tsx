// components/profile/profile-content.tsx - Enhanced version
'use client';

import { useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { AccountInfoForm } from '@/components/profile/account-info-form';
import { ActivityList } from '@/components/profile/activity-list';
import { PasswordChangeForm } from '@/components/profile/password-change-form';
import { PreferencesForm } from '@/components/profile/preferences-form';
import { UserStats } from '@/components/profile/user-stats';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserAvatar } from '@/components/ui/user-avatar';

import { Activity, AlertTriangle, Calendar, FileText, Key, LogOut, Settings, Shield, User } from 'lucide-react';
import { toast } from 'sonner';

// components/profile/profile-content.tsx - Enhanced version

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
    const router = useRouter();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [confirmEmail, setConfirmEmail] = useState('');
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const showSuccessToast = (message: string) => {
        toast.success(message);
    };

    const showErrorToast = (message: string) => {
        toast.error(message);
    };

    const handleDeleteAccount = async () => {
        if (confirmEmail !== user.email) {
            setDeleteError('Email does not match your account email');

            return;
        }

        setIsDeleting(true);
        setDeleteError(null);

        try {
            const response = await fetch('/api/user/delete-account', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to delete account');
            }

            // Sign out and redirect to homepage
            toast.success('Your account has been deleted successfully');
            router.push('/api/auth/signout?callbackUrl=/');
        } catch (error) {
            setDeleteError(error instanceof Error ? error.message : 'An unexpected error occurred');
            toast.error('Failed to delete your account');
        } finally {
            setIsDeleting(false);
        }
    };

    const formatDate = (dateString?: string | null) => {
        if (!dateString) return 'N/A';

        return new Date(dateString).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className='container mx-auto max-w-4xl px-4 py-8'>
            {/* Enhanced profile header with visual elements */}
            <div className='bg-card mb-8 rounded-lg border p-6 shadow-sm'>
                <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
                    <div className='flex items-center gap-4'>
                        <UserAvatar name={user.name} imageUrl={user.image} size='lg' />
                        <div>
                            <h1 className='text-2xl font-bold sm:text-3xl'>{user.name || 'User'}</h1>
                            <p className='text-muted-foreground'>{user.email}</p>
                            {user.emailVerified ? (
                                <Badge variant='default' className='mt-2'>
                                    Verified Account
                                </Badge>
                            ) : (
                                <Badge variant='secondary' className='mt-2'>
                                    Email Not Verified
                                </Badge>
                            )}
                        </div>
                    </div>
                    <div className='flex flex-col gap-2'>
                        {user.roles && user.roles.length > 0 && (
                            <div className='flex flex-wrap gap-2'>
                                {user.roles.map((role) => (
                                    <Badge key={role} variant='outline'>
                                        {role}
                                    </Badge>
                                ))}
                            </div>
                        )}
                        <p className='text-muted-foreground flex items-center text-sm'>
                            <Calendar className='mr-2 h-4 w-4' />
                            Member since {formatDate(user.createdAt)}
                        </p>
                    </div>
                </div>
            </div>

            {/* New User Stats Section */}
            <UserStats userId={user.id} />

            <Tabs defaultValue='account' className='mt-8 w-full'>
                <TabsList className='mb-6 w-full justify-start'>
                    <TabsTrigger value='account'>
                        <User className='mr-2 h-4 w-4' />
                        Account Info
                    </TabsTrigger>
                    <TabsTrigger value='security'>
                        <Key className='mr-2 h-4 w-4' />
                        Security
                    </TabsTrigger>
                    <TabsTrigger value='preferences'>
                        <Settings className='mr-2 h-4 w-4' />
                        Preferences
                    </TabsTrigger>
                    <TabsTrigger value='activity'>
                        <Activity className='mr-2 h-4 w-4' />
                        Activity
                    </TabsTrigger>
                </TabsList>

                <div className='bg-card rounded-lg border p-6 shadow-sm'>
                    <TabsContent value='account'>
                        <AccountInfoForm user={user} onSuccess={showSuccessToast} onError={showErrorToast} />
                    </TabsContent>

                    <TabsContent value='security'>
                        <PasswordChangeForm userId={user.id} onSuccess={showSuccessToast} onError={showErrorToast} />
                    </TabsContent>

                    <TabsContent value='preferences'>
                        <PreferencesForm userId={user.id} onSuccess={showSuccessToast} onError={showErrorToast} />
                    </TabsContent>

                    <TabsContent value='activity'>
                        <ActivityList userId={user.id} />
                    </TabsContent>
                </div>
            </Tabs>

            {/* Account Danger Zone */}
            <Card className='border-destructive/20 mt-8'>
                <CardHeader>
                    <CardTitle className='text-destructive flex items-center'>
                        <AlertTriangle className='mr-2 h-5 w-5' />
                        Danger Zone
                    </CardTitle>
                    <CardDescription>
                        Actions in this section can lead to permanent data loss. Please proceed with caution.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className='flex flex-col items-start justify-between gap-4 rounded-lg border p-4 sm:flex-row sm:items-center'>
                        <div>
                            <h3 className='font-medium'>Delete Account</h3>
                            <p className='text-muted-foreground mt-1 text-sm'>
                                Permanently delete your account and all of your data.
                            </p>
                        </div>
                        <Button
                            variant='destructive'
                            onClick={() => setIsDeleteDialogOpen(true)}
                            disabled={user.oauthProvider === 'google'}>
                            <LogOut className='mr-2 h-4 w-4' />
                            Delete Account
                        </Button>
                    </div>
                    {user.oauthProvider === 'google' && (
                        <p className='text-muted-foreground mt-2 text-sm'>
                            Google-connected accounts must be deleted from your Google Account settings.
                            <Link href='https://myaccount.google.com/' className='text-primary ml-1' target='_blank'>
                                Manage Google Account
                            </Link>
                        </p>
                    )}
                </CardContent>
            </Card>

            {/* Delete Account Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className='text-destructive'>Delete Account</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. It will permanently delete your account and remove your data
                            from our servers.
                        </DialogDescription>
                    </DialogHeader>

                    {deleteError && (
                        <Alert variant='destructive' className='my-4'>
                            <AlertDescription>{deleteError}</AlertDescription>
                        </Alert>
                    )}

                    <div className='my-4 space-y-4'>
                        <p>Please type your email address to confirm:</p>
                        <Input
                            value={confirmEmail}
                            onChange={(e) => setConfirmEmail(e.target.value)}
                            placeholder={user.email || ''}
                            disabled={isDeleting}
                        />
                    </div>

                    <DialogFooter>
                        <Button variant='outline' onClick={() => setIsDeleteDialogOpen(false)} disabled={isDeleting}>
                            Cancel
                        </Button>
                        <Button
                            variant='destructive'
                            onClick={handleDeleteAccount}
                            disabled={isDeleting || confirmEmail !== user.email}>
                            {isDeleting ? 'Deleting...' : 'Delete Account'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
