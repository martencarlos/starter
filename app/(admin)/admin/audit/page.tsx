// app/(admin)/admin/audit/page.tsx
import { Metadata } from 'next';

import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { query } from '@/lib/db';

import { formatDistanceToNow } from 'date-fns';

export const metadata: Metadata = {
    title: 'Admin - Audit Log',
    description: 'System audit log'
};

async function AuditLogPage() {
    // Get recent role assignment history
    const auditLog = await query(`
        SELECT 
            h.id, 
            h.user_id, 
            u.name as user_name, 
            u.email as user_email,
            r.name as role_name,
            h.action,
            h.created_at,
            a.name as assigned_by_name,
            a.email as assigned_by_email
        FROM role_assignment_history h
        JOIN users u ON h.user_id = u.id
        JOIN roles r ON h.role_id = r.id
        LEFT JOIN users a ON h.assigned_by = a.id
        ORDER BY h.created_at DESC
        LIMIT 100
    `);

    return (
        <div className='container mx-auto px-4 py-8'>
            <h1 className='mb-8 text-3xl font-bold'>System Audit Log</h1>

            <div className='bg-card rounded-lg border p-6 shadow-sm'>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Action</TableHead>
                            <TableHead>Performed By</TableHead>
                            <TableHead>Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {auditLog.map((entry) => (
                            <TableRow key={entry.id}>
                                <TableCell className='font-medium'>
                                    {entry.user_name}
                                    <br />
                                    <span className='text-muted-foreground text-xs'>{entry.user_email}</span>
                                </TableCell>
                                <TableCell>{entry.role_name}</TableCell>
                                <TableCell>
                                    {entry.action === 'assign' ? (
                                        <Badge variant='default'>Assigned</Badge>
                                    ) : (
                                        <Badge variant='destructive'>Removed</Badge>
                                    )}
                                </TableCell>
                                <TableCell>
                                    {entry.assigned_by_name ? (
                                        <>
                                            {entry.assigned_by_name}
                                            <br />
                                            <span className='text-muted-foreground text-xs'>
                                                {entry.assigned_by_email}
                                            </span>
                                        </>
                                    ) : (
                                        <span className='text-muted-foreground'>System</span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <span title={new Date(entry.created_at).toLocaleString()}>
                                        {formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })}
                                    </span>
                                </TableCell>
                            </TableRow>
                        ))}

                        {auditLog.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className='text-muted-foreground py-8 text-center'>
                                    No audit log entries found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

// Protect with role guard
export default AuditLogPage;
