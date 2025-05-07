import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';

import { getServerSession } from 'next-auth/next';

export const metadata: Metadata = {
    title: 'Dashboard',
    description: 'User dashboard'
};

export default async function DashboardPage() {
    // Get the user session
    const session = await getServerSession(authOptions);

    // Redirect to login if not authenticated
    if (!session?.user) {
        redirect('/login');
    }

    return (
        <div className='flex min-h-screen flex-col'>
            <header className='bg-primary text-primary-foreground shadow'>
                <div className='container mx-auto px-4 py-4'>
                    <div className='flex items-center justify-between'>
                        <h1 className='text-xl font-bold'>Dashboard</h1>
                        <div className='flex items-center space-x-4'>
                            <span>Hello, {session.user.name || 'User'}</span>
                            <form action='/api/auth/signout' method='POST'>
                                <button
                                    type='submit'
                                    className='bg-primary-foreground text-primary hover:bg-primary-foreground/90 rounded-md px-4 py-2 text-sm'>
                                    Sign out
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </header>

            <main className='container mx-auto flex-1 px-4 py-8'>
                <div className='bg-card rounded-lg p-6 shadow'>
                    <h2 className='mb-4 text-2xl font-bold'>Welcome to your Dashboard</h2>
                    <p className='text-muted-foreground'>
                        This is a protected page. You can only see this if you are logged in.
                    </p>

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
            </main>

            <footer className='bg-muted py-6'>
                <div className='text-muted-foreground container mx-auto px-4 text-center text-sm'>
                    &copy; {new Date().getFullYear()} Your Application. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
