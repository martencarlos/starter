// app/admin/roles/[id]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import RoleForm from '@/components/admin/role-form';
import { query, queryOne } from '@/lib/db';

export const metadata: Metadata = {
    title: 'Admin - Edit Role',
    description: 'Edit role details'
};

export default async function EditRolePage({ params }: { params: { id: string } }) {
    const { id } = await params;

    // Fetch role with assigned permissions
    const role = await queryOne(
        `SELECT r.*, 
          (SELECT array_agg(p.name) 
           FROM permissions p 
           JOIN role_permissions rp ON p.id = rp.permission_id 
           WHERE rp.role_id = r.id) as permissions
         FROM roles r
         WHERE r.id = $1`,
        [id]
    );

    if (!role) {
        return notFound();
    }

    // Get all permissions for the form
    const allPermissions = await query('SELECT id, name, description FROM permissions ORDER BY name');

    return (
        <div className='container mx-auto px-4 py-8'>
            <h1 className='mb-8 text-3xl font-bold'>Edit Role</h1>

            <div className='bg-card rounded-lg border p-6 shadow-sm'>
                <RoleForm role={role} allPermissions={allPermissions} isNew={false} />
            </div>
        </div>
    );
}
