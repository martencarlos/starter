// app/dashboard/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { authOptions } from '@/lib/auth-options';
import { roleService } from '@/lib/services/role-service';

import { getServerSession } from 'next-auth/next';

export const metadata: Metadata = {
    title: 'Dashboard',
    description: 'User dashboard'
};

export default async function DashboardPage() {
    // Get the user session
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!user) {
        redirect('/login?callbackUrl=/dashboard');
    }

    // Get user's roles and permissions for server-side checks
    const roles = await roleService.getUserRoles(user.id);
    const permissions = await roleService.getUserPermissions(user.id);

    // Check if user has admin role
    const isAdmin = roles.some((role) => role.name === 'admin');

    return (
        <div className='container mx-auto px-4 py-8'>
            <div className='mb-8'>
                <h1 className='text-3xl font-bold'>Welcome to your Dashboard</h1>
                <p className='text-muted-foreground mt-2'>
                    Your personalized dashboard based on your role and permissions.
                </p>
            </div>

            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
                {/* Card shown to all users */}
                <Card>
                    <CardHeader>
                        <CardTitle>User Profile</CardTitle>
                        <CardDescription>View and update your profile information</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild className='w-full'>
                            <Link href='/profile'>Manage Profile</Link>
                        </Button>
                    </CardContent>
                </Card>

                {/* Server-side role check for admin dashboard */}
                {isAdmin && (
                    <Card className='bg-primary/5'>
                        <CardHeader>
                            <CardTitle>Admin Dashboard</CardTitle>
                            <CardDescription>Manage users, roles and system settings</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild className='w-full'>
                                <Link href='/admin/users'>Go to Admin Panel</Link>
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Always visible card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Help & Support</CardTitle>
                        <CardDescription>Get help and support</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild variant='ghost' className='w-full'>
                            <Link href='/support'>Contact Support</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* User roles and permissions display */}
            <div className='bg-card mt-10 rounded-lg border p-6 shadow-sm'>
                <h2 className='mb-4 text-xl font-semibold'>Your Access Information</h2>

                <div className='space-y-4'>
                    <div>
                        <h3 className='text-lg font-medium'>Your Roles</h3>
                        <div className='mt-2 flex flex-wrap gap-2'>
                            {roles.length > 0 ? (
                                roles.map((role) => (
                                    <span
                                        key={role.id}
                                        className='bg-primary/10 text-primary rounded-full px-3 py-1 text-sm'>
                                        {role.name}
                                    </span>
                                ))
                            ) : (
                                <span className='text-muted-foreground'>No assigned roles</span>
                            )}
                        </div>
                    </div>

                    <div>
                        <h3 className='text-lg font-medium'>Your Permissions</h3>
                        <div className='mt-2 flex flex-wrap gap-2'>
                            {permissions.length > 0 ? (
                                permissions.map((permission) => (
                                    <span
                                        key={permission.id}
                                        className='bg-secondary/80 text-secondary-foreground rounded-full px-3 py-1 text-xs'>
                                        {permission.name}
                                    </span>
                                ))
                            ) : (
                                <span className='text-muted-foreground'>No assigned permissions</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
