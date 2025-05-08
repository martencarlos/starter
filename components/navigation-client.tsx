// components/navigation-client.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';

// components/navigation-client.tsx

interface NavigationProps {
    isAuthenticated?: boolean;
    userName?: string | null;
}

export function Navigation({ isAuthenticated, userName }: NavigationProps) {
    const pathname = usePathname();

    const isActive = (path: string) => {
        return pathname === path;
    };

    return (
        <header className='bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 w-full border-b backdrop-blur'>
            <div className='container mx-auto flex h-14 items-center justify-between px-4'>
                <div className='flex items-center gap-4'>
                    <Link href='/' className='flex items-center gap-2'>
                        <span className='text-xl font-bold'>Next.js 15 Starter</span>
                    </Link>
                    <nav className='hidden items-center gap-6 md:flex'>
                        <Link
                            href='/'
                            className={`hover:text-primary text-sm transition-colors ${
                                isActive('/') ? 'text-primary font-medium' : 'text-foreground/60'
                            }`}>
                            Home
                        </Link>
                        {isAuthenticated && (
                            <Link
                                href='/dashboard'
                                className={`hover:text-primary text-sm transition-colors ${
                                    isActive('/dashboard') ? 'text-primary font-medium' : 'text-foreground/60'
                                }`}>
                                Dashboard
                            </Link>
                        )}
                    </nav>
                </div>

                <div className='flex items-center gap-4'>
                    <ThemeToggle />

                    {isAuthenticated ? (
                        <div className='flex items-center gap-4'>
                            <span className='hidden text-sm md:inline-block'>Hello, {userName || 'User'}</span>
                            <form action='/api/auth/signout' method='POST'>
                                <Button variant='outline' size='sm' type='submit'>
                                    Sign out
                                </Button>
                            </form>
                        </div>
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
