// components/admin/permission-form.tsx
'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DeleteConfirmationDialog } from '@/components/ui/delete-confirmation-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

// components/admin/permission-form.tsx

// components/admin/permission-form.tsx

interface Role {
    id: number;
    name: string;
}

interface Permission {
    id: number;
    name: string;
    description: string;
    roles?: Role[];
}

interface PermissionFormProps {
    permission?: Permission;
    allRoles: Role[];
    isNew?: boolean;
}

export default function PermissionForm({ permission, allRoles, isNew = false }: PermissionFormProps) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: permission?.name || '',
        description: permission?.description || ''
    });
    const [selectedRoles, setSelectedRoles] = useState<string[]>(permission?.roles?.map((r) => r.name) || []);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    // Check if this is a core system permission
    const corePermissions = [
        'manage:users',
        'manage:roles',
        'manage:permissions',
        'view:admin_dashboard',
        'read:users',
        'read:reports',
        'read:audit_log',
        'read:analytics'
    ];
    const isCorePermission = !isNew && permission?.name && corePermissions.includes(permission.name);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const addRole = (role: string) => {
        if (!selectedRoles.includes(role)) {
            setSelectedRoles([...selectedRoles, role]);
        }
    };

    const removeRole = (role: string) => {
        setSelectedRoles(selectedRoles.filter((r) => r !== role));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const url = isNew ? '/api/admin/permissions' : `/api/admin/permissions/${permission?.id}`;

            const method = isNew ? 'POST' : 'PATCH';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: formData.name,
                    description: formData.description,
                    roles: selectedRoles
                })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to save permission');
            }

            toast.success(isNew ? 'Permission created successfully' : 'Permission updated successfully');
            router.push('/admin/permissions');
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unexpected error occurred');
            toast.error('Failed to save permission');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        setIsDeleting(true);

        try {
            const response = await fetch(`/api/admin/permissions/${permission?.id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to delete permission');
            }

            toast.success('Permission deleted successfully');
            setShowDeleteDialog(false);
            router.push('/admin/permissions');
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unexpected error occurred');
            toast.error('Failed to delete permission');
            setShowDeleteDialog(false);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className='space-y-6'>
                {error && (
                    <Alert variant='destructive'>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {isCorePermission && (
                    <Alert>
                        <AlertDescription>
                            This is a core system permission. Some properties cannot be modified.
                        </AlertDescription>
                    </Alert>
                )}

                <div className='space-y-4'>
                    <div className='space-y-2'>
                        <Label htmlFor='name'>Permission Name</Label>
                        <Input
                            id='name'
                            name='name'
                            value={formData.name}
                            onChange={handleInputChange}
                            disabled={isLoading || isCorePermission}
                            placeholder='e.g., read:users, create:posts'
                            required
                        />
                        <p className='text-muted-foreground text-xs'>
                            Use a format like 'action:resource' (e.g., read:users, create:posts)
                        </p>
                    </div>

                    <div className='space-y-2'>
                        <Label htmlFor='description'>Description</Label>
                        <Textarea
                            id='description'
                            name='description'
                            value={formData.description}
                            onChange={handleInputChange}
                            disabled={isLoading}
                            placeholder='Describe what this permission allows'
                            rows={3}
                        />
                    </div>

                    <div className='space-y-2'>
                        <Label>Assigned Roles</Label>
                        <div className='mb-3 flex flex-wrap gap-2'>
                            {selectedRoles.map((role) => (
                                <Badge key={role} variant='secondary' className='px-2 py-1'>
                                    {role}
                                    <button
                                        type='button'
                                        onClick={() => removeRole(role)}
                                        className='hover:text-destructive ml-2'>
                                        ×
                                    </button>
                                </Badge>
                            ))}
                            {selectedRoles.length === 0 && (
                                <span className='text-muted-foreground text-sm'>No roles assigned</span>
                            )}
                        </div>
                        <Select onValueChange={addRole} disabled={isLoading}>
                            <SelectTrigger className='w-full'>
                                <SelectValue placeholder='Assign to a role' />
                            </SelectTrigger>
                            <SelectContent>
                                {allRoles.map((role) => (
                                    <SelectItem
                                        key={role.id}
                                        value={role.name}
                                        disabled={selectedRoles.includes(role.name)}>
                                        {role.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className='flex justify-between gap-4'>
                    {!isNew && !isCorePermission && (
                        <Button
                            type='button'
                            variant='destructive'
                            onClick={() => setShowDeleteDialog(true)}
                            disabled={isLoading}>
                            <Trash2 className='mr-2 h-4 w-4' />
                            Delete Permission
                        </Button>
                    )}
                    {(isNew || isCorePermission) && <div></div>}

                    <div className='flex justify-end gap-4'>
                        <Button
                            type='button'
                            variant='outline'
                            onClick={() => router.push('/admin/permissions')}
                            disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button type='submit' disabled={isLoading || isCorePermission}>
                            {isLoading ? 'Saving...' : isNew ? 'Create Permission' : 'Save Changes'}
                        </Button>
                    </div>
                </div>
            </form>

            <DeleteConfirmationDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                onConfirm={handleDelete}
                title='Delete Permission'
                description={
                    <>
                        <p>
                            Are you sure you want to delete the permission <strong>{permission?.name}</strong>?
                        </p>
                        <p className='mt-2'>
                            This action cannot be undone and will remove this permission from all roles that have it
                            assigned.
                        </p>
                    </>
                }
                isLoading={isDeleting}
            />
        </>
    );
}
