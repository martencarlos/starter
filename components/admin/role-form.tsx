// components/admin/role-form.tsx
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

// components/admin/role-form.tsx

interface Permission {
    id: number;
    name: string;
    description?: string;
}

interface Role {
    id: number;
    name: string;
    description: string;
    permissions?: string[];
}

interface RoleFormProps {
    role?: Role;
    allPermissions: Permission[];
    isNew?: boolean;
}

export default function RoleForm({ role, allPermissions, isNew = false }: RoleFormProps) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: role?.name || '',
        description: role?.description || ''
    });
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>(role?.permissions?.filter(Boolean) || []);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    // Check if this is a built-in role (admin or user)
    const isBuiltInRole = role?.name === 'admin' || role?.name === 'user';

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const addPermission = (permission: string) => {
        if (!selectedPermissions.includes(permission)) {
            setSelectedPermissions([...selectedPermissions, permission]);
        }
    };

    const removePermission = (permission: string) => {
        setSelectedPermissions(selectedPermissions.filter((p) => p !== permission));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const url = isNew ? '/api/admin/roles' : `/api/admin/roles/${role?.id}`;

            const method = isNew ? 'POST' : 'PATCH';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: formData.name,
                    description: formData.description,
                    permissions: selectedPermissions
                })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to save role');
            }

            toast.success(isNew ? 'Role created successfully' : 'Role updated successfully');
            router.push('/admin/roles');
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unexpected error occurred');
            toast.error('Failed to save role');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        setIsDeleting(true);

        try {
            const response = await fetch(`/api/admin/roles/${role?.id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to delete role');
            }

            toast.success('Role deleted successfully');
            setShowDeleteDialog(false);
            router.push('/admin/roles');
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unexpected error occurred');
            toast.error('Failed to delete role');
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

                {isBuiltInRole && !isNew && (
                    <Alert>
                        <AlertDescription>
                            This is a built-in role. Some properties cannot be modified.
                        </AlertDescription>
                    </Alert>
                )}

                <div className='space-y-4'>
                    <div className='space-y-2'>
                        <Label htmlFor='name'>Role Name</Label>
                        <Input
                            id='name'
                            name='name'
                            value={formData.name}
                            onChange={handleInputChange}
                            disabled={isLoading || (isBuiltInRole && !isNew)}
                            placeholder='e.g., editor, moderator'
                            required
                        />
                    </div>

                    <div className='space-y-2'>
                        <Label htmlFor='description'>Description</Label>
                        <Textarea
                            id='description'
                            name='description'
                            value={formData.description}
                            onChange={handleInputChange}
                            disabled={isLoading}
                            placeholder="Describe this role's responsibilities"
                            rows={3}
                        />
                    </div>

                    <div className='space-y-2'>
                        <Label>Permissions</Label>
                        <div className='mb-3 flex flex-wrap gap-2'>
                            {selectedPermissions.map((permission) => (
                                <Badge key={permission} variant='secondary' className='px-2 py-1'>
                                    {permission}
                                    <button
                                        type='button'
                                        onClick={() => removePermission(permission)}
                                        className='hover:text-destructive ml-2'>
                                        ×
                                    </button>
                                </Badge>
                            ))}
                            {selectedPermissions.length === 0 && (
                                <span className='text-muted-foreground text-sm'>No permissions assigned</span>
                            )}
                        </div>
                        <Select onValueChange={addPermission} disabled={isLoading}>
                            <SelectTrigger className='w-full'>
                                <SelectValue placeholder='Add a permission' />
                            </SelectTrigger>
                            <SelectContent>
                                {allPermissions.map((permission) => (
                                    <SelectItem
                                        key={permission.id}
                                        value={permission.name}
                                        disabled={selectedPermissions.includes(permission.name)}>
                                        {permission.name}
                                        {permission.description && (
                                            <span className='text-muted-foreground text-xs'>
                                                {' '}
                                                - {permission.description}
                                            </span>
                                        )}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className='flex justify-between gap-4'>
                    {!isNew && !isBuiltInRole && (
                        <Button
                            type='button'
                            variant='destructive'
                            onClick={() => setShowDeleteDialog(true)}
                            disabled={isLoading}>
                            <Trash2 className='mr-2 h-4 w-4' />
                            Delete Role
                        </Button>
                    )}
                    {(isNew || isBuiltInRole) && <div></div>}

                    <div className='flex justify-end gap-4'>
                        <Button
                            type='button'
                            variant='outline'
                            onClick={() => router.push('/admin/roles')}
                            disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button type='submit' disabled={isLoading || (isBuiltInRole && !isNew)}>
                            {isLoading ? 'Saving...' : isNew ? 'Create Role' : 'Save Changes'}
                        </Button>
                    </div>
                </div>
            </form>

            <DeleteConfirmationDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                onConfirm={handleDelete}
                title='Delete Role'
                description={
                    <>
                        <p>
                            Are you sure you want to delete the role <strong>{role?.name}</strong>?
                        </p>
                        <p className='mt-2'>
                            This action cannot be undone. Users with this role will lose access to associated
                            permissions.
                        </p>
                    </>
                }
                isLoading={isDeleting}
            />
        </>
    );
}
