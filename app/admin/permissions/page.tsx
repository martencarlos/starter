// app/admin/permissions/page.tsx
// This page is modified to only list predefined permissions. Management (add/edit/delete) is removed.
import { Metadata } from 'next';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { query } from '@/lib/db';

export const metadata: Metadata = {
    title: 'Admin - Predefined Permissions',
    description: 'View system-defined permissions'
};

export default async function AdminPermissionsPage() {
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
                <h2 className='text-2xl font-semibold'>Predefined System Permissions</h2>
                <p className='text-muted-foreground text-sm'>
                    Permissions are managed in <code>sql/init.sql</code> and assigned to roles.
                </p>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Assigned to Roles (Count)</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {permissions.map((permission) => (
                        <TableRow key={permission.id}>
                            <TableCell className='font-medium'>{permission.name}</TableCell>
                            <TableCell>{permission.description || '-'}</TableCell>
                            <TableCell>{permission.role_count || 0}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
