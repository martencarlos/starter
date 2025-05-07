import { Metadata } from 'next';
import Link from 'next/link';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Button } from '@/components/ui/button';

import { getServerSession } from 'next-auth/next';

export const metadata: Metadata = {
    title: 'Next.js 15 Starter Template',
    description: 'A modern Next.js 15 starter with authentication, PostgreSQL, and Zod validation'
};

export default async function HomePage() {
    // Get user session to determine authentication status
    const session = await getServerSession(authOptions);
    const isAuthenticated = !!session?.user;

    return (
        <div className='flex min-h-screen flex-col'>
            {/* Header with navigation */}
            <header className='bg-background/95 sticky top-0 z-10 border-b backdrop-blur'>
                <div className='container mx-auto flex h-14 items-center justify-between px-4'>
                    <div className='flex items-center space-x-4'>
                        <span className='text-xl font-bold'>Next.js 15 Starter</span>
                    </div>

                    <nav className='flex items-center space-x-4'>
                        {isAuthenticated ? (
                            <>
                                <Link
                                    href='/dashboard'
                                    className='hover:text-primary text-sm font-medium transition-colors'>
                                    Dashboard
                                </Link>

                                <form action='/api/auth/signout' method='POST'>
                                    <button
                                        type='submit'
                                        className='text-muted-foreground hover:text-primary text-sm font-medium transition-colors'>
                                        Sign out
                                    </button>
                                </form>
                            </>
                        ) : (
                            <>
                                <Link
                                    href='/login'
                                    className='hover:text-primary text-sm font-medium transition-colors'>
                                    Sign in
                                </Link>
                                <Link href='/register'>
                                    <Button size='sm'>Sign up</Button>
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </header>

            {/* Hero section */}
            <section className='bg-muted py-16 md:py-24'>
                <div className='container mx-auto px-4 text-center'>
                    <h1 className='mb-4 text-4xl font-bold tracking-tight md:text-5xl'>Next.js 15 Starter Template</h1>
                    <p className='text-muted-foreground mx-auto mb-8 max-w-xl text-lg md:text-xl'>
                        A modern starter template with authentication, PostgreSQL integration, and form validation.
                    </p>

                    <div className='flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4'>
                        {isAuthenticated ? (
                            <Link href='/dashboard'>
                                <Button size='lg'>Go to Dashboard</Button>
                            </Link>
                        ) : (
                            <>
                                <Link href='/register'>
                                    <Button size='lg'>Get Started</Button>
                                </Link>
                                <Link href='/login'>
                                    <Button variant='outline' size='lg'>
                                        Sign In
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Features section */}
            <section className='py-16'>
                <div className='container mx-auto px-4'>
                    <h2 className='mb-12 text-center text-3xl font-bold tracking-tight md:text-4xl'>Key Features</h2>

                    <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3'>
                        {/* Feature 1 */}
                        <div className='bg-card rounded-lg border p-6 shadow-sm'>
                            <h3 className='mb-2 text-xl font-semibold'>PostgreSQL with Neon</h3>
                            <p className='text-muted-foreground mb-4'>
                                Direct database integration without ORM. Efficient SQL queries with connection pooling.
                            </p>
                            <Link href='https://neon.tech' target='_blank' className='text-primary text-sm font-medium'>
                                Learn about Neon →
                            </Link>
                        </div>

                        {/* Feature 2 */}
                        <div className='bg-card rounded-lg border p-6 shadow-sm'>
                            <h3 className='mb-2 text-xl font-semibold'>NextAuth Authentication</h3>
                            <p className='text-muted-foreground mb-4'>
                                Complete auth system with login, registration, password reset, and protected routes.
                            </p>
                            <Link
                                href='https://next-auth.js.org'
                                target='_blank'
                                className='text-primary text-sm font-medium'>
                                Learn about NextAuth →
                            </Link>
                        </div>

                        {/* Feature 3 */}
                        <div className='bg-card rounded-lg border p-6 shadow-sm'>
                            <h3 className='mb-2 text-xl font-semibold'>Form Validation with Zod</h3>
                            <p className='text-muted-foreground mb-4'>
                                Type-safe schema validation for forms and API requests. Seamless integration with React
                                Hook Form.
                            </p>
                            <Link href='https://zod.dev' target='_blank' className='text-primary text-sm font-medium'>
                                Learn about Zod →
                            </Link>
                        </div>

                        {/* Feature 4 */}
                        <div className='bg-card rounded-lg border p-6 shadow-sm'>
                            <h3 className='mb-2 text-xl font-semibold'>Email with Nodemailer</h3>
                            <p className='text-muted-foreground mb-4'>
                                Send transactional emails for verification, password reset, and notifications.
                            </p>
                            <Link
                                href='https://nodemailer.com'
                                target='_blank'
                                className='text-primary text-sm font-medium'>
                                Learn about Nodemailer →
                            </Link>
                        </div>

                        {/* Feature 5 */}
                        <div className='bg-card rounded-lg border p-6 shadow-sm'>
                            <h3 className='mb-2 text-xl font-semibold'>UI Components</h3>
                            <p className='text-muted-foreground mb-4'>
                                Beautiful, accessible UI components powered by shadcn/ui and Tailwind CSS.
                            </p>
                            <Link
                                href='https://ui.shadcn.com'
                                target='_blank'
                                className='text-primary text-sm font-medium'>
                                Learn about shadcn/ui →
                            </Link>
                        </div>

                        {/* Feature 6 */}
                        <div className='bg-card rounded-lg border p-6 shadow-sm'>
                            <h3 className='mb-2 text-xl font-semibold'>TypeScript</h3>
                            <p className='text-muted-foreground mb-4'>
                                Fully typed codebase for better developer experience and fewer runtime errors.
                            </p>
                            <Link
                                href='https://www.typescriptlang.org'
                                target='_blank'
                                className='text-primary text-sm font-medium'>
                                Learn about TypeScript →
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Authentication demo section */}
            <section className='bg-muted py-16'>
                <div className='container mx-auto px-4'>
                    <h2 className='mb-8 text-center text-3xl font-bold tracking-tight md:text-4xl'>
                        Authentication Demo
                    </h2>

                    <div className='bg-card mx-auto max-w-2xl rounded-lg border p-6 shadow-sm'>
                        <div className='mb-6 text-center'>
                            <h3 className='mb-2 text-xl font-semibold'>
                                {isAuthenticated ? 'You are signed in' : 'Try the authentication system'}
                            </h3>

                            {isAuthenticated ? (
                                <div className='bg-primary/10 rounded-md p-4 text-left'>
                                    <p className='font-medium'>Signed in as:</p>
                                    <p className='text-muted-foreground'>{session.user.name || 'User'}</p>
                                    <p className='text-muted-foreground'>{session.user.email}</p>
                                </div>
                            ) : (
                                <p className='text-muted-foreground'>
                                    Test the complete authentication flow with registration, email verification, and
                                    password reset.
                                </p>
                            )}
                        </div>

                        <div className='flex flex-col gap-4 sm:flex-row sm:justify-center'>
                            {isAuthenticated ? (
                                <>
                                    <Link href='/dashboard'>
                                        <Button className='w-full sm:w-auto'>Dashboard</Button>
                                    </Link>
                                    <form action='/api/auth/signout' method='POST' className='w-full sm:w-auto'>
                                        <Button variant='outline' className='w-full' type='submit'>
                                            Sign out
                                        </Button>
                                    </form>
                                </>
                            ) : (
                                <>
                                    <Link href='/register' className='w-full sm:w-auto'>
                                        <Button className='w-full'>Register</Button>
                                    </Link>
                                    <Link href='/login' className='w-full sm:w-auto'>
                                        <Button variant='outline' className='w-full'>
                                            Sign in
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Getting started section */}
            <section className='py-16'>
                <div className='container mx-auto px-4'>
                    <h2 className='mb-8 text-center text-3xl font-bold tracking-tight md:text-4xl'>Getting Started</h2>

                    <div className='bg-card mx-auto max-w-3xl rounded-lg border p-6 shadow-sm'>
                        <p className='text-muted-foreground mb-6'>Follow these steps to set up the project locally:</p>

                        <div className='space-y-4'>
                            <div className='bg-muted rounded-md p-4'>
                                <p className='font-medium'>1. Clone the repository</p>
                                <pre className='bg-secondary text-secondary-foreground mt-2 overflow-x-auto rounded p-2 text-sm'>
                                    <code>git clone https://github.com/yourusername/nextjs-15-starter.git</code>
                                </pre>
                            </div>

                            <div className='bg-muted rounded-md p-4'>
                                <p className='font-medium'>2. Install dependencies</p>
                                <pre className='bg-secondary text-secondary-foreground mt-2 overflow-x-auto rounded p-2 text-sm'>
                                    <code>npm install</code>
                                </pre>
                            </div>

                            <div className='bg-muted rounded-md p-4'>
                                <p className='font-medium'>3. Set up environment variables</p>
                                <pre className='bg-secondary text-secondary-foreground mt-2 overflow-x-auto rounded p-2 text-sm'>
                                    <code>cp .env.example .env.local</code>
                                </pre>
                            </div>

                            <div className='bg-muted rounded-md p-4'>
                                <p className='font-medium'>4. Set up your Neon PostgreSQL database</p>
                                <p className='text-muted-foreground mt-2 text-sm'>
                                    Create a Neon account, create a new project, and run the SQL script in sql/init.sql
                                    via the SQL Editor.
                                </p>
                            </div>

                            <div className='bg-muted rounded-md p-4'>
                                <p className='font-medium'>5. Run the development server</p>
                                <pre className='bg-secondary text-secondary-foreground mt-2 overflow-x-auto rounded p-2 text-sm'>
                                    <code>npm run dev</code>
                                </pre>
                            </div>
                        </div>

                        <p className='text-muted-foreground mt-6'>
                            For more detailed instructions, check out the README.md file.
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className='bg-muted border-t py-6'>
                <div className='container mx-auto px-4 text-center'>
                    <p className='text-muted-foreground text-sm'>
                        &copy; {new Date().getFullYear()} Next.js 15 Starter Template. Released under the MIT License.
                    </p>
                </div>
            </footer>
        </div>
    );
}
