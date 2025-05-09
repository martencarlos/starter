// app/(admin)/admin/users/new/page.tsx
import { Metadata } from 'next';

import UserCreateForm from '@/components/admin/user-create-form';
import { query } from '@/lib/db';

export const metadata: Metadata = {
    title: 'Admin - Create User',
    description: 'Create a new user'
};

export default async function AdminUserCreatePage() {
    // Get all available roles for the dropdown
    const allRoles = await query('SELECT id, name, description FROM roles ORDER BY name');

    return (
        <div className='container mx-auto px-4 py-8'>
            <h1 className='mb-8 text-3xl font-bold'>Create User</h1>

            <div className='bg-card rounded-lg border p-6 shadow-sm'>
                <UserCreateForm allRoles={allRoles} />
            </div>
        </div>
    );
}
