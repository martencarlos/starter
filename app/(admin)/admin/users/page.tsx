// app/(admin)/admin/users/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { authOptions } from '@/lib/auth-options';
import { query } from '@/lib/db';
import { roleService } from '@/lib/services/role-service';

import { getServerSession } from 'next-auth/next';

export const metadata: Metadata = {
    title: 'Admin - Users',
    description: 'Manage users'
};

export default async function AdminUsersPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect('/login?callbackUrl=/admin/users');
    }

    // Check if user has admin role
    const isAdmin = await roleService.hasRole(session.user.id, 'admin');

    if (!isAdmin) {
        redirect('/dashboard');
    }

    // Fetch all users with their roles
    const users = await query(
        `SELECT u.id, u.name, u.email, u.email_verified, u.created_at,
         array_agg(r.name) as roles
         FROM users u
         LEFT JOIN user_roles ur ON u.id = ur.user_id
         LEFT JOIN roles r ON ur.role_id = r.id
         GROUP BY u.id, u.name, u.email, u.email_verified, u.created_at
         ORDER BY u.created_at DESC`
    );

    return (
        <div className='container mx-auto px-4 py-8'>
            <div className='mb-8 flex items-center justify-between'>
                <h1 className='text-3xl font-bold'>User Management</h1>
                <Button asChild>
                    <Link href='/admin/users/new'>Add User</Link>
                </Button>
            </div>

            <div className='bg-card rounded-lg border p-6 shadow-sm'>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Verified</TableHead>
                            <TableHead>Roles</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead className='text-right'>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell className='font-medium'>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    {user.email_verified ? (
                                        <Badge variant='default'>Verified</Badge>
                                    ) : (
                                        <Badge variant='secondary'>Pending</Badge>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <div className='flex flex-wrap gap-1'>
                                        {user.roles.filter(Boolean).map((role) => (
                                            <Badge key={role} variant='outline'>
                                                {role}
                                            </Badge>
                                        ))}
                                    </div>
                                </TableCell>
                                <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                                <TableCell className='text-right'>
                                    <Button variant='ghost' size='sm' asChild>
                                        <Link href={`/admin/users/${user.id}`}>Edit</Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
