// components/navigation/navigation-skeleton.tsx
import Link from 'next/link';

import { ThemeToggle } from '@/components/theme-toggle';

export function NavigationSkeleton() {
    return (
        <header className='bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 w-full border-b backdrop-blur'>
            <div className='container mx-auto flex h-14 items-center justify-between px-4'>
                <div className='flex items-center gap-4'>
                    <Link href='/' className='flex items-center gap-2'>
                        <span className='text-xl font-bold'>Starter Template</span>
                    </Link>
                    {/* Empty nav placeholder */}
                    <nav className='hidden items-center gap-6 md:flex'></nav>
                </div>

                <div className='flex items-center gap-4'>
                    <ThemeToggle />
                    {/* Skeleton for avatar/login buttons */}
                    <div className='bg-muted h-9 w-9 animate-pulse rounded-full'></div>
                </div>
            </div>
        </header>
    );
}
