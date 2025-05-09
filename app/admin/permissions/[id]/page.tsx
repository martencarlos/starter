// app/(admin)/admin/permissions/[id]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import PermissionForm from '@/components/admin/permission-form';
import { query, queryOne } from '@/lib/db';

export const metadata: Metadata = {
    title: 'Admin - Edit Permission',
    description: 'Edit permission details'
};

export default async function EditPermissionPage({ params }: { params: { id: string } }) {
    const { id } = params;

    // Check if user has admin rol

    // Fetch permission with assigned roles
    const permission = await queryOne(
        `SELECT p.*, 
          (SELECT json_agg(json_build_object('id', r.id, 'name', r.name)) 
           FROM roles r 
           JOIN role_permissions rp ON r.id = rp.role_id 
           WHERE rp.permission_id = p.id) as roles
         FROM permissions p
         WHERE p.id = $1`,
        [id]
    );

    if (!permission) {
        return notFound();
    }

    // Get all roles for the form
    const allRoles = await query('SELECT id, name FROM roles ORDER BY name');

    return (
        <div className='container mx-auto px-4 py-8'>
            <h1 className='mb-8 text-3xl font-bold'>Edit Permission</h1>

            <div className='bg-card rounded-lg border p-6 shadow-sm'>
                <PermissionForm permission={permission} allRoles={allRoles} isNew={false} />
            </div>
        </div>
    );
}
