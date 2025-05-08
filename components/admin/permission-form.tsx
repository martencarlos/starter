// components/admin/permission-form.tsx
'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

import { toast } from 'sonner';

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

    return (
        <form onSubmit={handleSubmit} className='space-y-6'>
            {error && (
                <Alert variant='destructive'>
                    <AlertDescription>{error}</AlertDescription>
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
                        disabled={isLoading}
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

            <div className='flex justify-end gap-4'>
                <Button
                    type='button'
                    variant='outline'
                    onClick={() => router.push('/admin/permissions')}
                    disabled={isLoading}>
                    Cancel
                </Button>
                <Button type='submit' disabled={isLoading}>
                    {isLoading ? 'Saving...' : isNew ? 'Create Permission' : 'Save Changes'}
                </Button>
            </div>
        </form>
    );
}
