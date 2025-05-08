// components/admin/user-edit-form.tsx
'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

import { toast } from 'sonner';

// components/admin/user-edit-form.tsx

interface Role {
    id: number;
    name: string;
    description: string;
}

interface User {
    id: string;
    name: string;
    email: string;
    email_verified: boolean;
    created_at: string;
    roles: string[];
}

interface UserEditFormProps {
    user: User;
    allRoles: Role[];
}

export default function UserEditForm({ user, allRoles }: UserEditFormProps) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
        email_verified: user.email_verified
    });
    const [selectedRoles, setSelectedRoles] = useState<string[]>(user.roles || []);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
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
            const response = await fetch(`/api/admin/users/${user.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    email_verified: formData.email_verified,
                    roles: selectedRoles
                })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to update user');
            }

            toast.success('User updated successfully');
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unexpected error occurred');
            toast.error('Failed to update user');
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
                    <Label htmlFor='name'>Name</Label>
                    <Input
                        id='name'
                        name='name'
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={isLoading}
                    />
                </div>

                <div className='space-y-2'>
                    <Label htmlFor='email'>Email</Label>
                    <Input
                        id='email'
                        name='email'
                        type='email'
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={isLoading}
                    />
                </div>

                <div className='flex items-center space-x-2'>
                    <Switch
                        id='email_verified'
                        name='email_verified'
                        checked={formData.email_verified}
                        onCheckedChange={(checked) => setFormData({ ...formData, email_verified: checked })}
                        disabled={isLoading}
                    />
                    <Label htmlFor='email_verified'>Email verified</Label>
                </div>

                <div className='space-y-2'>
                    <Label>Roles</Label>
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
                            <SelectValue placeholder='Add a role' />
                        </SelectTrigger>
                        <SelectContent>
                            {allRoles.map((role) => (
                                <SelectItem
                                    key={role.id}
                                    value={role.name}
                                    disabled={selectedRoles.includes(role.name)}>
                                    {role.name} {role.description ? `- ${role.description}` : ''}
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
                    onClick={() => router.push('/admin/users')}
                    disabled={isLoading}>
                    Cancel
                </Button>
                <Button type='submit' disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>
        </form>
    );
}
