// app/(admin)/admin/roles/new/page.tsx
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import RoleForm from '@/components/admin/role-form';
import { authOptions } from '@/lib/auth-options';
import { query } from '@/lib/db';
import { roleService } from '@/lib/services/role-service';

import { getServerSession } from 'next-auth/next';

export const metadata: Metadata = {
    title: 'Admin - Create Role',
    description: 'Create a new role'
};

export default async function CreateRolePage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect('/login?callbackUrl=/admin/roles/new');
    }

    // Check if user has admin role
    const isAdmin = await roleService.hasRole(session.user.id, 'admin');

    if (!isAdmin) {
        redirect('/dashboard');
    }

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
