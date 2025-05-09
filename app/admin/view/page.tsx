// app/admin/view/page.tsx
import { Metadata } from 'next';

import AdminTabsClientWrapper from '../_components/admin-tabs-client-wrapper';
import AnalyticsTab from '../_components/analytics-tab';
import AuditTab from '../_components/audit-tab';
import PermissionsTab from '../_components/permissions-tab';
import RolesTab from '../_components/roles-tab';
import UsersTab from '../_components/users-tab';

export const metadata: Metadata = {
    title: 'Admin Dashboard View',
    description: 'Manage system users, roles, permissions, and view analytics.'
};

export default async function AdminViewPage() {
    // Each of these is a Server Component that fetches its own data.
    // They are passed as ReactNode to the client component wrapper.
    return (
        <AdminTabsClientWrapper
            usersContent={<UsersTab />}
            rolesContent={<RolesTab />}
            permissionsContent={<PermissionsTab />}
            analyticsContent={<AnalyticsTab />}
            auditContent={<AuditTab />}
        />
    );
}

// This ensures dynamic pages also use this, for example, if navigating from a non-tab page back to tabs.
export const dynamic = 'force-dynamic';
