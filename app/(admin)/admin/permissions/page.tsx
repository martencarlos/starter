// app/(admin)/admin/permissions/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { authOptions } from '@/lib/auth-options';
import { query } from '@/lib/db';
import { roleService } from '@/lib/services/role-service';

import { getServerSession } from 'next-auth/next';

export const metadata: Metadata = {
    title: 'Admin - Permissions',
    description: 'Manage permissions'
};

export default async function AdminPermissionsPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect('/login?callbackUrl=/admin/permissions');
    }

    // Check if user has admin role
    const isAdmin = await roleService.hasRole(session.user.id, 'admin');

    if (!isAdmin) {
        redirect('/dashboard');
    }

    // Fetch all permissions with role counts
    const permissions = await query(
        `SELECT p.id, p.name, p.description, 
          (SELECT COUNT(*) FROM role_permissions WHERE permission_id = p.id) as role_count
         FROM permissions p
         ORDER BY p.name`
    );

    return (
        <div className='bg-card rounded-lg border p-6 shadow-sm'>
            <div className='mb-6 flex items-center justify-between'>
                <h2 className='text-2xl font-semibold'>Permissions Management</h2>
                <Button asChild>
                    <Link href='/admin/permissions/new'>Add Permission</Link>
                </Button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Assigned Roles</TableHead>
                        <TableHead className='text-right'>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {permissions.map((permission) => (
                        <TableRow key={permission.id}>
                            <TableCell className='font-medium'>{permission.name}</TableCell>
                            <TableCell>{permission.description || '-'}</TableCell>
                            <TableCell>{permission.role_count || 0}</TableCell>
                            <TableCell className='text-right'>
                                <Button variant='ghost' size='sm' asChild>
                                    <Link href={`/admin/permissions/${permission.id}`}>Edit</Link>
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
