// app/(dashboard)/dashboard/page.tsx
import { Metadata } from 'next';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';

import { getServerSession } from 'next-auth/next';

export const metadata: Metadata = {
    title: 'Dashboard',
    description: 'User dashboard'
};

export default async function DashboardPage() {
    // Get the user session (although we already check in the layout, this is for the user data)
    const session = await getServerSession(authOptions);
    const user = session?.user;

    return (
        <div className='container mx-auto px-4 py-8'>
            <div className='mb-8'>
                <h1 className='text-3xl font-bold'>Welcome to your Dashboard</h1>
                <p className='text-muted-foreground mt-2'>
                    This is a protected page. You can only see this if you are logged in.
                </p>
            </div>

            <div className='bg-card rounded-lg p-6 shadow'>
                <div className='mb-6'>
                    <h2 className='mb-2 text-xl font-semibold'>User Information</h2>
                    <div className='bg-muted rounded-md p-4'>
                        <p>
                            <strong>Name:</strong> {user?.name || 'User'}
                        </p>
                        <p>
                            <strong>Email:</strong> {user?.email}
                        </p>
                    </div>
                </div>

                <div className='mt-8 grid grid-cols-1 gap-6 md:grid-cols-3'>
                    <div className='bg-accent rounded-lg p-6 shadow-sm'>
                        <h3 className='mb-2 font-medium'>User Profile</h3>
                        <p className='text-muted-foreground text-sm'>View and update your profile information</p>
                    </div>

                    <div className='bg-accent rounded-lg p-6 shadow-sm'>
                        <h3 className='mb-2 font-medium'>Security</h3>
                        <p className='text-muted-foreground text-sm'>Manage your account security settings</p>
                    </div>

                    <div className='bg-accent rounded-lg p-6 shadow-sm'>
                        <h3 className='mb-2 font-medium'>Notifications</h3>
                        <p className='text-muted-foreground text-sm'>Configure your notification preferences</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
