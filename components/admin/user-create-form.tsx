// components/admin/user-create-form.tsx
'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { toast } from 'sonner';

// components/admin/user-create-form.tsx

interface Role {
    id: number;
    name: string;
    description?: string;
}

interface UserCreateFormProps {
    allRoles: Role[];
}

export default function UserCreateForm({ allRoles }: UserCreateFormProps) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [selectedRoles, setSelectedRoles] = useState<string[]>(['user']); // Default to 'user' role
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

        // Validate password match
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords don't match");
            setIsLoading(false);

            return;
        }

        try {
            // Create the user
            const response = await fetch('/api/admin/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    roles: selectedRoles
                })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to create user');
            }

            const result = await response.json();

            toast.success('User created successfully');
            router.push('/admin/users');
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unexpected error occurred');
            toast.error('Failed to create user');
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
                        required
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
                        required
                    />
                </div>

                <div className='space-y-2'>
                    <Label htmlFor='password'>Password</Label>
                    <Input
                        id='password'
                        name='password'
                        type='password'
                        value={formData.password}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        required
                    />
                </div>

                <div className='space-y-2'>
                    <Label htmlFor='confirmPassword'>Confirm Password</Label>
                    <Input
                        id='confirmPassword'
                        name='confirmPassword'
                        type='password'
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        required
                    />
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
                    {isLoading ? 'Creating...' : 'Create User'}
                </Button>
            </div>
        </form>
    );
}
