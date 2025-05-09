// app/admin/_components/roles-tab.tsx
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { query } from '@/lib/db';

export default async function RolesTab() {
    const roles = await query(
        `SELECT r.id, r.name, r.description,
         array_agg(p.name) FILTER (WHERE p.name IS NOT NULL) as permissions
         FROM roles r
         LEFT JOIN role_permissions rp ON r.id = rp.role_id
         LEFT JOIN permissions p ON rp.permission_id = p.id
         GROUP BY r.id, r.name, r.description
         ORDER BY r.name`
    );

    return (
        <div className='bg-card rounded-lg border p-6 shadow-sm'>
            <div className='mb-6 flex items-center justify-between'>
                <h2 className='text-2xl font-semibold'>Roles Management</h2>
                <Button asChild>
                    <Link href='/admin/roles/new'>Add Role</Link>
                </Button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Permissions</TableHead>
                        <TableHead className='text-right'>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {roles.map((role) => (
                        <TableRow key={role.id}>
                            <TableCell className='font-medium'>{role.name}</TableCell>
                            <TableCell>{role.description || '-'}</TableCell>
                            <TableCell>
                                <div className='flex flex-wrap gap-1'>
                                    {role.permissions &&
                                        role.permissions.filter(Boolean).map((permission) => (
                                            <Badge key={permission} variant='outline'>
                                                {permission}
                                            </Badge>
                                        ))}
                                    {(!role.permissions || role.permissions.length === 0) && (
                                        <span className='text-muted-foreground text-sm'>No permissions</span>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell className='text-right'>
                                <Button variant='ghost' size='sm' asChild>
                                    <Link href={`/admin/roles/${role.id}`}>Edit</Link>
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
