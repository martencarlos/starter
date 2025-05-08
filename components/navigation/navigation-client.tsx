// components/navigation/navigation-client.tsx
'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

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

import { NavigationSkeleton } from './navigation-skeleton';
import { LogOut, Settings, User } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';

// components/navigation/navigation-client.tsx

export function NavigationClient() {
    const pathname = usePathname();
    const { data: session, status } = useSession();
    const [isMounted, setIsMounted] = useState(false);

    // Set isMounted to true on client side
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Don't render anything until mounted on client
    if (!isMounted) {
        return <NavigationSkeleton />;
    }

    // Show skeleton while loading session
    if (status === 'loading') {
        return <NavigationSkeleton />;
    }

    const isAuthenticated = status === 'authenticated';
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
                            <Link href='/login'>
                                <Button variant='ghost' size='sm'>
                                    Sign in
                                </Button>
                            </Link>
                            <Link href='/register'>
                                <Button size='sm'>Sign up</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
