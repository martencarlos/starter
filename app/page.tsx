// app/(main)/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
    title: 'Next.js Auth & Dashboard Starter',
    description:
        'A production-ready Next.js 15 starter with authentication, RBAC, PostgreSQL, and comprehensive features'
};

export default function HomePage() {
    return (
        <>
            {/* Hero Section */}
            <section className='w-full py-12 md:py-12 lg:py-26 xl:py-32'>
                <div className='container px-4 md:px-6'>
                    <div className='grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]'>
                        <div className='flex flex-col justify-center space-y-4'>
                            <div className='space-y-2'>
                                <h1 className='text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none'>
                                    Modern Next.js 15 Starter Kit
                                </h1>
                                <p className='text-muted-foreground max-w-[600px] md:text-xl'>
                                    A complete, production-ready template with authentication, role-based access
                                    control, support ticketing, notifications, and enterprise-grade architecture.
                                </p>
                            </div>
                            <div className='flex flex-col gap-2 min-[400px]:flex-row'>
                                <Link href='/register'>
                                    <Button size='lg' className='w-full min-[400px]:w-auto'>
                                        Get Started
                                    </Button>
                                </Link>
                                <Link href='https://github.com/martencarlos/starter' target='_blank'>
                                    <Button size='lg' variant='outline' className='w-full min-[400px]:w-auto'>
                                        GitHub
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        <div className='flex items-center justify-center'>
                            <div className='bg-card rounded-lg border p-8 shadow-lg'>
                                <div className='space-y-4'>
                                    <h3 className='text-xl font-bold'>Enterprise-Grade Features</h3>
                                    <ul className='space-y-2'>
                                        <li className='flex items-center'>
                                            <svg
                                                className='text-primary mr-2 h-5 w-5'
                                                fill='none'
                                                viewBox='0 0 24 24'
                                                stroke='currentColor'>
                                                <path
                                                    strokeLinecap='round'
                                                    strokeLinejoin='round'
                                                    strokeWidth={2}
                                                    d='M5 13l4 4L19 7'
                                                />
                                            </svg>
                                            Next.js 15 with App Router
                                        </li>
                                        <li className='flex items-center'>
                                            <svg
                                                className='text-primary mr-2 h-5 w-5'
                                                fill='none'
                                                viewBox='0 0 24 24'
                                                stroke='currentColor'>
                                                <path
                                                    strokeLinecap='round'
                                                    strokeLinejoin='round'
                                                    strokeWidth={2}
                                                    d='M5 13l4 4L19 7'
                                                />
                                            </svg>
                                            PostgreSQL Database
                                        </li>
                                        <li className='flex items-center'>
                                            <svg
                                                className='text-primary mr-2 h-5 w-5'
                                                fill='none'
                                                viewBox='0 0 24 24'
                                                stroke='currentColor'>
                                                <path
                                                    strokeLinecap='round'
                                                    strokeLinejoin='round'
                                                    strokeWidth={2}
                                                    d='M5 13l4 4L19 7'
                                                />
                                            </svg>
                                            Role-Based Access Control
                                        </li>
                                        <li className='flex items-center'>
                                            <svg
                                                className='text-primary mr-2 h-5 w-5'
                                                fill='none'
                                                viewBox='0 0 24 24'
                                                stroke='currentColor'>
                                                <path
                                                    strokeLinecap='round'
                                                    strokeLinejoin='round'
                                                    strokeWidth={2}
                                                    d='M5 13l4 4L19 7'
                                                />
                                            </svg>
                                            Support Ticket System
                                        </li>
                                        <li className='flex items-center'>
                                            <svg
                                                className='text-primary mr-2 h-5 w-5'
                                                fill='none'
                                                viewBox='0 0 24 24'
                                                stroke='currentColor'>
                                                <path
                                                    strokeLinecap='round'
                                                    strokeLinejoin='round'
                                                    strokeWidth={2}
                                                    d='M5 13l4 4L19 7'
                                                />
                                            </svg>
                                            Real-time Notifications
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className='bg-muted w-full py-12 md:py-24 lg:py-32'>
                <div className='container px-4 md:px-6'>
                    <div className='flex flex-col items-center justify-center space-y-4 text-center'>
                        <div className='space-y-2'>
                            <div className='bg-primary text-primary-foreground inline-block rounded-lg px-3 py-1 text-sm'>
                                Features
                            </div>
                            <h2 className='text-3xl font-bold tracking-tighter md:text-4xl'>
                                Everything You Need to Build
                            </h2>
                            <p className='text-muted-foreground max-w-[700px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
                                This starter template includes all the essential components for modern web applications.
                            </p>
                        </div>
                    </div>
                    <div className='mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3'>
                        {/* Authentication & RBAC */}
                        <div className='bg-card flex flex-col items-start space-y-4 rounded-lg border p-6 shadow-sm'>
                            <div className='bg-primary text-primary-foreground inline-flex h-12 w-12 items-center justify-center rounded-lg'>
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    width='24'
                                    height='24'
                                    viewBox='0 0 24 24'
                                    fill='none'
                                    stroke='currentColor'
                                    strokeWidth='2'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    className='h-6 w-6'>
                                    <path d='M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4a6.5 6.5 0 1 0-4-4Z' />
                                    <circle cx='17' cy='7' r='1' />
                                </svg>
                            </div>
                            <div className='space-y-2'>
                                <h3 className='text-xl font-bold'>Authentication & RBAC</h3>
                                <p className='text-muted-foreground'>
                                    Complete authentication system with NextAuth.js, social logins, email verification,
                                    and role-based access control.
                                </p>
                            </div>
                        </div>

                        {/* Support Ticketing */}
                        <div className='bg-card flex flex-col items-start space-y-4 rounded-lg border p-6 shadow-sm'>
                            <div className='bg-primary text-primary-foreground inline-flex h-12 w-12 items-center justify-center rounded-lg'>
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    width='24'
                                    height='24'
                                    viewBox='0 0 24 24'
                                    fill='none'
                                    stroke='currentColor'
                                    strokeWidth='2'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    className='h-6 w-6'>
                                    <path d='M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z' />
                                </svg>
                            </div>
                            <div className='space-y-2'>
                                <h3 className='text-xl font-bold'>Support Ticketing</h3>
                                <p className='text-muted-foreground'>
                                    Built-in support ticket system with categories, statuses, and real-time
                                    communication between users and support staff.
                                </p>
                            </div>
                        </div>

                        {/* Real-time Notifications */}
                        <div className='bg-card flex flex-col items-start space-y-4 rounded-lg border p-6 shadow-sm'>
                            <div className='bg-primary text-primary-foreground inline-flex h-12 w-12 items-center justify-center rounded-lg'>
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    width='24'
                                    height='24'
                                    viewBox='0 0 24 24'
                                    fill='none'
                                    stroke='currentColor'
                                    strokeWidth='2'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    className='h-6 w-6'>
                                    <path d='M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9' />
                                    <path d='M10.3 21a1.94 1.94 0 0 0 3.4 0' />
                                </svg>
                            </div>
                            <div className='space-y-2'>
                                <h3 className='text-xl font-bold'>Notifications</h3>
                                <p className='text-muted-foreground'>
                                    Real-time notification system for support tickets, system updates, and user-specific
                                    events.
                                </p>
                            </div>
                        </div>

                        {/* Admin Dashboard */}
                        <div className='bg-card flex flex-col items-start space-y-4 rounded-lg border p-6 shadow-sm'>
                            <div className='bg-primary text-primary-foreground inline-flex h-12 w-12 items-center justify-center rounded-lg'>
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    width='24'
                                    height='24'
                                    viewBox='0 0 24 24'
                                    fill='none'
                                    stroke='currentColor'
                                    strokeWidth='2'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    className='h-6 w-6'>
                                    <rect width='20' height='14' x='2' y='5' rx='2' />
                                    <line x1='2' x2='22' y1='10' y2='10' />
                                </svg>
                            </div>
                            <div className='space-y-2'>
                                <h3 className='text-xl font-bold'>Admin Dashboard</h3>
                                <p className='text-muted-foreground'>
                                    Comprehensive admin interface for user management, role assignment, analytics, and
                                    auditing.
                                </p>
                            </div>
                        </div>

                        {/* User Profiles & Activity */}
                        <div className='bg-card flex flex-col items-start space-y-4 rounded-lg border p-6 shadow-sm'>
                            <div className='bg-primary text-primary-foreground inline-flex h-12 w-12 items-center justify-center rounded-lg'>
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    width='24'
                                    height='24'
                                    viewBox='0 0 24 24'
                                    fill='none'
                                    stroke='currentColor'
                                    strokeWidth='2'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    className='h-6 w-6'>
                                    <path d='M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2' />
                                    <circle cx='12' cy='7' r='4' />
                                </svg>
                            </div>
                            <div className='space-y-2'>
                                <h3 className='text-xl font-bold'>User Profiles</h3>
                                <p className='text-muted-foreground'>
                                    Detailed user profiles with activity tracking, preferences, and account management
                                    features.
                                </p>
                            </div>
                        </div>

                        {/* API & Integration */}
                        <div className='bg-card flex flex-col items-start space-y-4 rounded-lg border p-6 shadow-sm'>
                            <div className='bg-primary text-primary-foreground inline-flex h-12 w-12 items-center justify-center rounded-lg'>
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    width='24'
                                    height='24'
                                    viewBox='0 0 24 24'
                                    fill='none'
                                    stroke='currentColor'
                                    strokeWidth='2'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    className='h-6 w-6'>
                                    <path d='M18 20a6 6 0 0 0-12 0' />
                                    <circle cx='12' cy='10' r='8' />
                                    <circle cx='12' cy='10' r='3' />
                                </svg>
                            </div>
                            <div className='space-y-2'>
                                <h3 className='text-xl font-bold'>REST API & Integration</h3>
                                <p className='text-muted-foreground'>
                                    Well-structured API endpoints for all features with Zod validation and middleware
                                    protection.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Technical Features Section */}
            <section className='w-full py-12 md:py-24 lg:py-32'>
                <div className='container px-4 md:px-6'>
                    <div className='mx-auto max-w-3xl space-y-4 text-center'>
                        <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl'>Technical Features</h2>
                        <p className='text-muted-foreground text-lg'>
                            Built with the latest technologies and best practices for scalable, maintainable
                            applications.
                        </p>
                    </div>

                    <div className='mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3'>
                        <div className='space-y-3'>
                            <h3 className='text-xl font-semibold'>Next.js 15 App Router</h3>
                            <p className='text-muted-foreground'>
                                Latest Next.js with Turbopack for fast development and server components.
                            </p>
                        </div>

                        <div className='space-y-3'>
                            <h3 className='text-xl font-semibold'>TypeScript</h3>
                            <p className='text-muted-foreground'>
                                End-to-end type safety with comprehensive interface definitions.
                            </p>
                        </div>

                        <div className='space-y-3'>
                            <h3 className='text-xl font-semibold'>PostgreSQL Integration</h3>
                            <p className='text-muted-foreground'>
                                Directly connect to PostgreSQL with connection pooling and transaction support.
                            </p>
                        </div>

                        <div className='space-y-3'>
                            <h3 className='text-xl font-semibold'>NextAuth.js</h3>
                            <p className='text-muted-foreground'>
                                Authentication with JWT sessions, Google OAuth, and email/password support.
                            </p>
                        </div>

                        <div className='space-y-3'>
                            <h3 className='text-xl font-semibold'>Zod Validation</h3>
                            <p className='text-muted-foreground'>
                                Runtime validation with Zod for forms, API requests, and database schemas.
                            </p>
                        </div>

                        <div className='space-y-3'>
                            <h3 className='text-xl font-semibold'>shadcn/ui Components</h3>
                            <p className='text-muted-foreground'>
                                Beautiful, accessible UI components with Tailwind CSS and Radix UI primitives.
                            </p>
                        </div>

                        <div className='space-y-3'>
                            <h3 className='text-xl font-semibold'>Dark Mode Support</h3>
                            <p className='text-muted-foreground'>
                                System preference detection and user-configurable theme settings.
                            </p>
                        </div>

                        <div className='space-y-3'>
                            <h3 className='text-xl font-semibold'>ESLint & Prettier</h3>
                            <p className='text-muted-foreground'>
                                Code quality tools for consistent style and best practices.
                            </p>
                        </div>

                        <div className='space-y-3'>
                            <h3 className='text-xl font-semibold'>VSCode Configuration</h3>
                            <p className='text-muted-foreground'>
                                Pre-configured development environment with debug profiles and extensions.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className='w-full py-12 md:py-24 lg:py-32'>
                <div className='container px-4 md:px-6'>
                    <div className='flex flex-col items-center justify-center space-y-4 text-center'>
                        <div className='space-y-2'>
                            <h2 className='text-3xl font-bold tracking-tighter md:text-4xl'>Ready to Get Started?</h2>
                            <p className='text-muted-foreground max-w-[700px] md:text-xl'>
                                Start building your next project with this template and save weeks of development time.
                            </p>
                        </div>
                        <div className='flex flex-col gap-2 min-[400px]:flex-row'>
                            <Link href='/register'>
                                <Button size='lg' className='w-full min-[400px]:w-auto'>
                                    Create an Account
                                </Button>
                            </Link>
                            <Link href='/login'>
                                <Button size='lg' variant='outline' className='w-full min-[400px]:w-auto'>
                                    Sign In
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
