// app/(main)/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
    title: 'Starter Template',
    description: 'A modern Next.js 15 starter with authentication, PostgreSQL, and Zod validation'
};

export default function HomePage() {
    return (<>
        {/* Hero Section */}
        <section className='w-full py-12 md:py-12 lg:py-26 xl:py-32'>
            <div className='container px-4 md:px-6'>
                <div className='grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]'>
                    <div className='flex flex-col justify-center space-y-4'>
                        <div className='space-y-2'>
                            <h1 className='text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none'>
                                Next.js 15 Authentication Starter
                            </h1>
                            <p className='text-muted-foreground max-w-[600px] md:text-xl'>
                                A modern, production-ready template with authentication, PostgreSQL database
                                integration, and comprehensive form validation using Zod.
                            </p>
                        </div>
                        <div className='flex flex-col gap-2 min-[400px]:flex-row'>
                            <Link href='/register' legacyBehavior>
                                <Button size='lg' className='w-full min-[400px]:w-auto'>
                                    Get Started
                                </Button>
                            </Link>
                            <Link
                                href='https://github.com/martencarlos/starter'
                                target='_blank'
                                legacyBehavior>
                                <Button size='lg' variant='outline' className='w-full min-[400px]:w-auto'>
                                    GitHub
                                </Button>
                            </Link>
                        </div>
                    </div>
                    <div className='flex items-center justify-center'>
                        <div className='bg-card rounded-lg border p-8 shadow-lg'>
                            <div className='flex h-[340px] w-full flex-col items-center justify-center rounded-md border border-dashed p-4'>
                                <div className='space-y-2 text-center'>
                                    <h3 className='text-xl font-bold'>Ready for Development</h3>
                                    <p className='text-muted-foreground text-sm'>
                                        This area can showcase your app's UI, screenshots, or feature highlights
                                    </p>
                                </div>
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
                            This starter template includes all the essential components to get your application up
                            and running quickly.
                        </p>
                    </div>
                </div>
                <div className='mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3'>
                    {/* Feature 1 */}
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
                                <path d='M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z'></path>
                                <polyline points='13 2 13 9 20 9'></polyline>
                            </svg>
                        </div>
                        <div className='space-y-2'>
                            <h3 className='text-xl font-bold'>Authentication Ready</h3>
                            <p className='text-muted-foreground'>
                                Complete authentication system with login, registration, password reset, and email
                                verification.
                            </p>
                        </div>
                    </div>

                    {/* Feature 2 */}
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
                                <path d='M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z'></path>
                                <path d='M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z'></path>
                            </svg>
                        </div>
                        <div className='space-y-2'>
                            <h3 className='text-xl font-bold'>PostgreSQL Integration</h3>
                            <p className='text-muted-foreground'>
                                Direct database integration with Neon PostgreSQL for scalable, serverless SQL.
                            </p>
                        </div>
                    </div>

                    {/* Feature 3 */}
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
                                <path d='M5.52 19c.64-2.2 1.84-3 3.22-3h6.52c1.38 0 2.58.8 3.22 3'></path>
                                <circle cx='12' cy='10' r='3'></circle>
                                <circle cx='12' cy='12' r='10'></circle>
                            </svg>
                        </div>
                        <div className='space-y-2'>
                            <h3 className='text-xl font-bold'>Form Validation</h3>
                            <p className='text-muted-foreground'>
                                Type-safe schema validation with Zod for forms and API requests.
                            </p>
                        </div>
                    </div>

                    {/* Feature 4 */}
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
                                <rect width='20' height='14' x='2' y='5' rx='2'></rect>
                                <line x1='2' x2='22' y1='10' y2='10'></line>
                            </svg>
                        </div>
                        <div className='space-y-2'>
                            <h3 className='text-xl font-bold'>Modern UI Components</h3>
                            <p className='text-muted-foreground'>
                                Beautiful, accessible UI components powered by shadcn/ui and Tailwind CSS.
                            </p>
                        </div>
                    </div>

                    {/* Feature 5 */}
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
                                <path d='m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z'></path>
                            </svg>
                        </div>
                        <div className='space-y-2'>
                            <h3 className='text-xl font-bold'>Dark Mode</h3>
                            <p className='text-muted-foreground'>
                                Built-in dark mode support with theme switching and system preference detection.
                            </p>
                        </div>
                    </div>

                    {/* Feature 6 */}
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
                                <path d='M5 7 3 5'></path>
                                <path d='M9 5 5 9'></path>
                                <path d='m13 13-4 4'></path>
                                <path d='M17 17 7 7'></path>
                                <path d='M21 21l-4-4'></path>
                                <path d='M8 12H4'></path>
                                <path d='M12 16V4'></path>
                                <path d='M20 12h-4'></path>
                            </svg>
                        </div>
                        <div className='space-y-2'>
                            <h3 className='text-xl font-bold'>TypeScript</h3>
                            <p className='text-muted-foreground'>
                                Fully typed codebase for better developer experience and fewer runtime errors.
                            </p>
                        </div>
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
                            Start building your next project with this template and save hours of development time.
                        </p>
                    </div>
                    <div className='flex flex-col gap-2 min-[400px]:flex-row'>
                        <Link href='/register' legacyBehavior>
                            <Button size='lg' className='w-full min-[400px]:w-auto'>
                                Create an Account
                            </Button>
                        </Link>
                        <Link href='/login' legacyBehavior>
                            <Button size='lg' variant='outline' className='w-full min-[400px]:w-auto'>
                                Sign In
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    </>);
}
