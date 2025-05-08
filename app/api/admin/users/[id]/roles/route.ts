// app/api/admin/users/[id]/roles/route.ts
import { NextRequest, NextResponse } from 'next/server';

import { withRole } from '@/lib/api/with-authorization';
import { roleService } from '@/lib/services/role-service';

async function putHandler(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;
    const body = await req.json();

    if (!body.roles || !Array.isArray(body.roles)) {
        return NextResponse.json({ message: 'Roles array is required' }, { status: 400 });
    }

    try {
        // Get current roles
        const currentRoles = await roleService.getUserRoles(id);
        const currentRoleNames = currentRoles.map((role) => role.name);

        // Determine roles to add and remove
        const rolesToAdd = body.roles.filter((role) => !currentRoleNames.includes(role));
        const rolesToRemove = currentRoleNames.filter((role) => !body.roles.includes(role));

        // Process role changes
        for (const role of rolesToAdd) {
            await roleService.assignRoleToUser(id, role);
        }

        for (const role of rolesToRemove) {
            await roleService.removeRoleFromUser(id, role);
        }

        return NextResponse.json({
            message: 'User roles updated successfully',
            added: rolesToAdd,
            removed: rolesToRemove
        });
    } catch (error) {
        console.error('Error updating user roles:', error);

        return NextResponse.json({ message: 'Failed to update user roles' }, { status: 500 });
    }
}

// Only admins can update user roles
export const PUT = withRole('admin', putHandler);
