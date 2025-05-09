// app/admin/_components/permissions-tab.tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { query } from '@/lib/db';

export default async function PermissionsTab() {
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
