// app/(admin)/admin/permissions/new/page.tsx
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import PermissionForm from '@/components/admin/permission-form';
import { authOptions } from '@/lib/auth-options';
import { query } from '@/lib/db';
import { roleService } from '@/lib/services/role-service';

import { getServerSession } from 'next-auth/next';

export const metadata: Metadata = {
    title: 'Admin - Create Permission',
    description: 'Create a new permission'
};

export default async function CreatePermissionPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect('/login?callbackUrl=/admin/permissions/new');
    }

    // Check if user has admin role
    const isAdmin = await roleService.hasRole(session.user.id, 'admin');

    if (!isAdmin) {
        redirect('/dashboard');
    }

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
