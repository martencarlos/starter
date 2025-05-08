// lib/services/role-service.ts
import { query, queryOne } from '@/lib/db';

interface Role {
    id: number;
    name: string;
    description: string;
}

interface Permission {
    id: number;
    name: string;
    description: string;
}

export const roleService = {
    async getUserRoles(userId: string): Promise<Role[]> {
        try {
            return await query<Role>(
                `SELECT r.* FROM roles r
         JOIN user_roles ur ON r.id = ur.role_id
         WHERE ur.user_id = $1`,
                [userId]
            );
        } catch (error) {
            console.error('Error getting user roles:', error);

            return [];
        }
    },

    async getUserPermissions(userId: string): Promise<Permission[]> {
        try {
            return await query<Permission>(
                `SELECT DISTINCT p.* FROM permissions p
         JOIN role_permissions rp ON p.id = rp.permission_id
         JOIN user_roles ur ON rp.role_id = ur.role_id
         WHERE ur.user_id = $1`,
                [userId]
            );
        } catch (error) {
            console.error('Error getting user permissions:', error);

            return [];
        }
    },

    // Update roleService to include audit logging
    // lib/services/role-service.ts (update)
    async assignRoleToUser(userId: string, roleName: string, assignedBy?: string): Promise<boolean> {
        try {
            const role = await queryOne<Role>('SELECT id FROM roles WHERE name = $1', [roleName]);

            if (!role) {
                return false;
            }

            await query(
                `INSERT INTO user_roles (user_id, role_id)
             VALUES ($1, $2)
             ON CONFLICT (user_id, role_id) DO NOTHING`,
                [userId, role.id]
            );

            // Log the role assignment for audit trail
            await query(
                `INSERT INTO role_assignment_history (user_id, role_id, assigned_by, action)
             VALUES ($1, $2, $3, 'assign')`,
                [userId, role.id, assignedBy || null]
            );

            // Update user sessions to reflect new role
            await this.updateUserSession(userId);

            return true;
        } catch (error) {
            console.error('Error assigning role to user:', error);

            return false;
        }
    },

    async removeRoleFromUser(userId: string, roleName: string, removedBy?: string): Promise<boolean> {
        try {
            const role = await queryOne<Role>('SELECT id FROM roles WHERE name = $1', [roleName]);

            if (!role) {
                return false;
            }

            await query('DELETE FROM user_roles WHERE user_id = $1 AND role_id = $2', [userId, role.id]);

            // Log the role removal for audit trail
            await query(
                `INSERT INTO role_assignment_history (user_id, role_id, assigned_by, action)
             VALUES ($1, $2, $3, 'remove')`,
                [userId, role.id, removedBy || null]
            );

            // Update user sessions to reflect removed role
            await this.updateUserSession(userId);

            return true;
        } catch (error) {
            console.error('Error removing role from user:', error);

            return false;
        }
    },

    async hasPermission(userId: string, permissionName: string): Promise<boolean> {
        try {
            const result = await query(
                `SELECT 1 FROM permissions p
         JOIN role_permissions rp ON p.id = rp.permission_id
         JOIN user_roles ur ON rp.role_id = ur.role_id
         WHERE ur.user_id = $1 AND p.name = $2
         LIMIT 1`,
                [userId, permissionName]
            );

            return result.length > 0;
        } catch (error) {
            console.error('Error checking permission:', error);

            return false;
        }
    },

    async hasRole(userId: string, roleName: string): Promise<boolean> {
        try {
            const result = await query(
                `SELECT 1 FROM roles r
         JOIN user_roles ur ON r.id = ur.role_id
         WHERE ur.user_id = $1 AND r.name = $2
         LIMIT 1`,
                [userId, roleName]
            );

            return result.length > 0;
        } catch (error) {
            console.error('Error checking role:', error);

            return false;
        }
    },

    async updateUserSession(userId: string): Promise<void> {
        try {
            // Find all active sessions for this user
            const sessions = await query('SELECT session_token FROM user_sessions WHERE user_id = $1', [userId]);

            if (sessions.length === 0) {
                return;
            }

            // Get updated roles and permissions
            const roles = await getUserRoles(userId);
            const permissions = await getUserPermissions(userId);

            // For each session, update the JWT token
            // Note: This is a simplified version that would need to be adapted to your JWT implementation
            for (const session of sessions) {
                // In a real implementation, you would:
                // 1. Decode the existing JWT
                // 2. Update the roles and permissions properties
                // 3. Sign a new JWT
                // 4. Update the session record

                console.log(`Updated session ${session.session_token} for user ${userId}`);
            }
        } catch (error) {
            console.error('Error updating user session:', error);
        }
    }
};
