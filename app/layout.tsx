// app/layout.tsx
import type { ReactNode } from 'react';

import type { Metadata } from 'next';
import localFont from 'next/font/local';

import { ThemeProvider } from 'next-themes';

import '@/app/globals.css';
import { NavigationHeader } from '@/components/navigation';

const geistSans = localFont({
    src: './fonts/GeistVF.woff',
    variable: '--font-geist-sans',
    weight: '100 900'
});
const geistMono = localFont({
    src: './fonts/GeistMonoVF.woff',
    variable: '--font-geist-mono',
    weight: '100 900'
});

export const metadata: Metadata = {
    title: {
        template: '%s | Starter Template',
        default: 'Starter Template'
    },
    description: 'A modern Next.js 15 starter with authentication, PostgreSQL, and Zod validation',
    keywords: ['Next.js', 'React', 'TypeScript', 'Authentication', 'PostgreSQL', 'Zod'],
    authors: [
        {
            name: 'Your Name',
            url: 'https://yourwebsite.com'
        }
    ],
    creator: 'Your Name',
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://your-website.com',
        title: 'Next.js 15 Starter',
        description: 'A modern Next.js 15 starter with authentication, PostgreSQL, and Zod validation',
        siteName: 'Next.js 15 Starter'
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Next.js 15 Starter',
        description: 'A modern Next.js 15 starter with authentication, PostgreSQL, and Zod validation',
        creator: '@yourusername'
    },
    icons: {
        icon: '/favicon.ico'
    }
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <html suppressHydrationWarning lang='en'>
            <body
                className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground flex min-h-screen flex-col antialiased`}>
                <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
                    <NavigationHeader />
                    <main className='flex flex-1 flex-col items-center justify-center sm:px-6 lg:px-8'>{children}</main>
                    <footer className='border-t py-6'>
                        <div className='text-muted-foreground container mx-auto px-4 text-center text-sm'>
                            &copy; {new Date().getFullYear()} Starter Template
                        </div>
                    </footer>
                </ThemeProvider>
            </body>
        </html>
    );
}
