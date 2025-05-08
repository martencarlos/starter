// app/(protected)/reports/page.tsx
import { Metadata } from 'next';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { withPermissionGuard } from '@/lib/rbac/with-permission-guard';

export const metadata: Metadata = {
    title: 'Reports',
    description: 'View system reports'
};

function ReportsPage() {
    return (
        <div className='container mx-auto px-4 py-8'>
            <h1 className='mb-6 text-3xl font-bold'>System Reports</h1>

            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <Card>
                    <CardHeader>
                        <CardTitle>User Activity Report</CardTitle>
                        <CardDescription>View user activity statistics</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className='text-muted-foreground'>
                            This page is only accessible to users with the 'read:reports' permission.
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>System Performance</CardTitle>
                        <CardDescription>Monitor system performance metrics</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className='text-muted-foreground'>
                            Protected content that requires special permissions to access.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

// Export the component with permission guard
export default withPermissionGuard(ReportsPage, 'read:reports');
