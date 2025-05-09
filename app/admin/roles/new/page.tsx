// app/admin/roles/new/page.tsx
import { Metadata } from 'next';

import RoleForm from '@/components/admin/role-form';
import { query } from '@/lib/db';

export const metadata: Metadata = {
    title: 'Admin - Create Role',
    description: 'Create a new role'
};

export default async function CreateRolePage() {
    // Get all permissions for the form
    const allPermissions = await query('SELECT id, name, description FROM permissions ORDER BY name');

    return (
        <div className='container mx-auto px-4 py-8'>
            <h1 className='mb-8 text-3xl font-bold'>Create Role</h1>

            <div className='bg-card rounded-lg border p-6 shadow-sm'>
                <RoleForm allPermissions={allPermissions} isNew={true} />
            </div>
        </div>
    );
}
