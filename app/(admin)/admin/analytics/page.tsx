// app/(admin)/admin/analytics/page.tsx
import { Metadata } from 'next';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { query } from '@/lib/db';
import { withRoleGuard } from '@/lib/rbac/with-role-guard';

import { CalendarIcon, KeyIcon, ShieldCheckIcon, UsersIcon } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Admin - Analytics',
    description: 'System analytics and metrics'
};

async function AdminAnalyticsPage() {
    // Get system statistics
    const stats = await query(`
        SELECT
            (SELECT COUNT(*) FROM users) as total_users,
            (SELECT COUNT(*) FROM users WHERE email_verified = true) as verified_users,
            (SELECT COUNT(*) FROM roles) as roles_count,
            (SELECT COUNT(*) FROM permissions) as permissions_count,
            (SELECT COUNT(*) FROM user_sessions) as active_sessions
    `);

    const { total_users, verified_users, roles_count, permissions_count, active_sessions } = stats[0];

    return (
        <div className='container mx-auto px-4 py-8'>
            <h1 className='mb-8 text-3xl font-bold'>System Analytics</h1>

            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
                <Card>
                    <CardHeader className='flex flex-row items-center justify-between pb-2'>
                        <CardTitle className='text-sm font-medium'>Total Users</CardTitle>
                        <UsersIcon className='text-muted-foreground h-4 w-4' />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>{total_users}</div>
                        <p className='text-muted-foreground text-xs'>
                            {verified_users} verified ({Math.round((verified_users / total_users) * 100)}%)
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className='flex flex-row items-center justify-between pb-2'>
                        <CardTitle className='text-sm font-medium'>Roles</CardTitle>
                        <ShieldCheckIcon className='text-muted-foreground h-4 w-4' />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>{roles_count}</div>
                        <p className='text-muted-foreground text-xs'>System roles configured</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className='flex flex-row items-center justify-between pb-2'>
                        <CardTitle className='text-sm font-medium'>Permissions</CardTitle>
                        <KeyIcon className='text-muted-foreground h-4 w-4' />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>{permissions_count}</div>
                        <p className='text-muted-foreground text-xs'>System permissions configured</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className='flex flex-row items-center justify-between pb-2'>
                        <CardTitle className='text-sm font-medium'>Active Sessions</CardTitle>
                        <CalendarIcon className='text-muted-foreground h-4 w-4' />
                    </CardHeader>
                    <CardContent>
                        <div className='text-2xl font-bold'>{active_sessions}</div>
                        <p className='text-muted-foreground text-xs'>Currently active user sessions</p>
                    </CardContent>
                </Card>
            </div>

            {/* Additional analytics content would go here */}
        </div>
    );
}

// Protect this page with role guard
export default withRoleGuard(AdminAnalyticsPage, 'admin');
