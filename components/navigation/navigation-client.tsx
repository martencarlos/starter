// components/navigation/navigation-client.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { WithRole } from '@/components/rbac/with-role';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { UserAvatar } from '@/components/ui/user-avatar';

import { LogOut, Settings, Shield, User } from 'lucide-react';
import { Session } from 'next-auth';
import { signOut, useSession } from 'next-auth/react';

// components/navigation/navigation-client.tsx

interface NavigationClientProps {
    initialSession: Session | null;
}

export function NavigationClient({ initialSession }: NavigationClientProps) {
    const pathname = usePathname();
    const { data: sessionData, status } = useSession();

    const session = sessionData || initialSession;
    const isAuthenticated = !!session;
    const userName = session?.user?.name;

    const isActive = (path: string) => {
        return pathname === path;
    };

    const handleSignOut = async () => {
        await signOut({ callbackUrl: '/' });
    };

    return (
        <header className='bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 w-full border-b backdrop-blur'>
            <div className='container mx-auto flex h-14 items-center justify-between px-4'>
                <div className='flex items-center gap-4'>
                    <Link href='/' className='flex items-center gap-2'>
                        <span className='text-xl font-bold'>Starter Template</span>
                    </Link>
                    <nav className='hidden items-center gap-6 md:flex'>
                        {isAuthenticated && (
                            <>
                                <Link
                                    href='/dashboard'
                                    className={`hover:text-primary text-sm transition-colors ${
                                        isActive('/dashboard') ? 'text-primary font-medium' : 'text-foreground/60'
                                    }`}>
                                    Dashboard
                                </Link>
                                <Link
                                    href='/profile'
                                    className={`hover:text-primary text-sm transition-colors ${
                                        isActive('/profile') ? 'text-primary font-medium' : 'text-foreground/60'
                                    }`}>
                                    Profile
                                </Link>

                                {/* Admin links - only visible for users with admin role */}
                                <WithRole role='admin'>
                                    <Link
                                        href='/admin/users'
                                        className={`hover:text-primary text-sm transition-colors ${
                                            pathname.startsWith('/admin')
                                                ? 'text-primary font-medium'
                                                : 'text-foreground/60'
                                        }`}>
                                        Admin
                                    </Link>
                                </WithRole>
                            </>
                        )}
                    </nav>
                </div>

                <div className='flex items-center gap-4'>
                    <ThemeToggle />

                    {isAuthenticated ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger className='focus:outline-none'>
                                <UserAvatar name={userName} size='sm' />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end' className='w-56'>
                                <DropdownMenuLabel>
                                    <div className='flex flex-col space-y-1'>
                                        <p className='text-sm font-medium'>{userName || 'User'}</p>
                                        <p className='text-muted-foreground text-xs'>Account</p>

                                        {/* Show roles as badges */}
                                        {session?.user?.roles && session.user.roles.length > 0 && (
                                            <div className='mt-1 flex flex-wrap gap-1'>
                                                {session.user.roles.map((role) => (
                                                    <span
                                                        key={role}
                                                        className='bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs'>
                                                        {role}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href='/dashboard' className='flex cursor-pointer items-center'>
                                        <User className='mr-2 h-4 w-4' />
                                        <span>Dashboard</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href='/profile' className='flex cursor-pointer items-center'>
                                        <Settings className='mr-2 h-4 w-4' />
                                        <span>Profile Settings</span>
                                    </Link>
                                </DropdownMenuItem>

                                {/* Admin menu item - only visible for users with admin role */}
                                <WithRole role='admin'>
                                    <DropdownMenuItem asChild>
                                        <Link href='/admin/users' className='flex cursor-pointer items-center'>
                                            <Shield className='mr-2 h-4 w-4' />
                                            <span>Admin Dashboard</span>
                                        </Link>
                                    </DropdownMenuItem>
                                </WithRole>

                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className='text-destructive focus:text-destructive flex cursor-pointer items-center'
                                    onClick={handleSignOut}>
                                    <LogOut className='mr-2 h-4 w-4' />
                                    <span>Sign out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className='flex items-center gap-2'>
                            <Button variant='ghost' size='sm' asChild>
                                <Link href='/login'>Sign in</Link>
                            </Button>
                            <Button size='sm' asChild>
                                <Link href='/register'>Sign up</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
