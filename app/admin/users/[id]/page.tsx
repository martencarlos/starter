// app/(admin)/admin/users/[id]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import UserEditForm from '@/components/admin/user-edit-form';
import { query, queryOne } from '@/lib/db';
import { roleService } from '@/lib/services/role-service';

export const metadata: Metadata = {
    title: 'Admin - Edit User',
    description: 'Edit user details'
};

export default async function AdminUserEditPage({ params }: { params: { id: string } }) {
    const { id } = params;

    // Fetch user with roles
    const user = await queryOne(
        `SELECT u.id, u.name, u.email, u.email_verified, u.created_at
         FROM users u
         WHERE u.id = $1`,
        [id]
    );

    if (!user) {
        return notFound();
    }

    // Get user roles
    const userRoles = await roleService.getUserRoles(id);

    // Get all available roles for the dropdown
    const allRoles = await query('SELECT id, name, description FROM roles ORDER BY name');

    return (
        <div className='container mx-auto px-4 py-8'>
            <h1 className='mb-8 text-3xl font-bold'>Edit User</h1>

            <div className='bg-card rounded-lg border p-6 shadow-sm'>
                <UserEditForm
                    user={{
                        ...user,
                        roles: userRoles.map((role) => role.name)
                    }}
                    allRoles={allRoles}
                />
            </div>
        </div>
    );
}
