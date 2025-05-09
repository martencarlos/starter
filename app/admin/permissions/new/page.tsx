// app/(admin)/admin/permissions/new/page.tsx
import { Metadata } from 'next';

import PermissionForm from '@/components/admin/permission-form';
import { query } from '@/lib/db';

export const metadata: Metadata = {
    title: 'Admin - Create Permission',
    description: 'Create a new permission'
};

export default async function CreatePermissionPage() {
    // Get all roles for the form
    const allRoles = await query('SELECT id, name FROM roles ORDER BY name');

    return (
        <div className='container mx-auto px-4 py-8'>
            <h1 className='mb-8 text-3xl font-bold'>Create Permission</h1>

            <div className='bg-card rounded-lg border p-6 shadow-sm'>
                <PermissionForm allRoles={allRoles} isNew={true} />
            </div>
        </div>
    );
}
