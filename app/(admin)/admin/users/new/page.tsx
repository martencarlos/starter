// app/(admin)/admin/users/new/page.tsx
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import UserCreateForm from '@/components/admin/user-create-form';
import { authOptions } from '@/lib/auth-options';
import { query } from '@/lib/db';
import { roleService } from '@/lib/services/role-service';

import { getServerSession } from 'next-auth/next';

export const metadata: Metadata = {
    title: 'Admin - Create User',
    description: 'Create a new user'
};

export default async function AdminUserCreatePage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect('/login?callbackUrl=/admin/users/new');
    }

    // Check if user has admin role
    const isAdmin = await roleService.hasRole(session.user.id, 'admin');

    if (!isAdmin) {
        redirect('/dashboard');
    }

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
