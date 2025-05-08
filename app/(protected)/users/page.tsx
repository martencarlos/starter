// app/(protected)/users/page.tsx
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UserAvatar } from '@/components/ui/user-avatar';
import { authOptions } from '@/lib/auth-options';
import { query } from '@/lib/db';
import { roleService } from '@/lib/services/role-service';

import { getServerSession } from 'next-auth/next';

export const metadata: Metadata = {
    title: 'User Directory',
    description: 'Browse the user directory'
};

export default async function UsersDirectoryPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect('/login?callbackUrl=/users');
    }

    // Check if user has permission to view users
    const hasPermission = await roleService.hasPermission(session.user.id, 'read:users');

    if (!hasPermission) {
        redirect('/dashboard');
    }

    // Fetch users with their roles
    const users = await query(
        `SELECT u.id, u.name, u.email, u.email_verified, u.created_at,
         array_agg(r.name) FILTER (WHERE r.name IS NOT NULL) as roles
         FROM users u
         LEFT JOIN user_roles ur ON u.id = ur.user_id
         LEFT JOIN roles r ON ur.role_id = r.id
         GROUP BY u.id, u.name, u.email, u.email_verified, u.created_at
         ORDER BY u.name`
    );

    return (
        <div className='container mx-auto px-4 py-8'>
            <h1 className='mb-8 text-3xl font-bold'>User Directory</h1>

            <div className='bg-card rounded-lg border p-6 shadow-sm'>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Roles</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Joined</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>
                                    <div className='flex items-center gap-3'>
                                        <UserAvatar name={user.name} size='sm' />
                                        <span className='font-medium'>{user.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <div className='flex flex-wrap gap-1'>
                                        {user.roles && user.roles.length > 0 ? (
                                            user.roles.map((role) => (
                                                <Badge key={role} variant='outline' className='text-xs'>
                                                    {role}
                                                </Badge>
                                            ))
                                        ) : (
                                            <span className='text-muted-foreground text-sm'>None</span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {user.email_verified ? (
                                        <Badge variant='default'>Verified</Badge>
                                    ) : (
                                        <Badge variant='secondary'>Pending</Badge>
                                    )}
                                </TableCell>
                                <TableCell className='text-muted-foreground text-sm'>
                                    {new Date(user.created_at).toLocaleDateString()}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
