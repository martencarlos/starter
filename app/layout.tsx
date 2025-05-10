// app/layout.tsx
import type { ReactNode } from 'react';

import type { Metadata } from 'next';
import localFont from 'next/font/local';

import { ThemeProvider } from 'next-themes';

import '@/app/globals.css';
import { NavigationHeader } from '@/components/navigation';
import { NextAuthProvider } from '@/components/providers/session-provider';
import { ToastProvider } from '@/components/providers/toast-provider';
import { NotificationsProvider } from '@/hooks/use-notifications';
import { authOptions } from '@/lib/auth-options';
import { notificationService } from '@/lib/services/notification-service';

import { getServerSession } from 'next-auth/next';

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
    description: 'A modern Next.js 15 starter with authentication, PostgreSQL, and Zod validation'
};

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
    const session = await getServerSession(authOptions);
    let initialUnreadCount = 0;
    if (session?.user?.id) {
        initialUnreadCount = await notificationService.getUnreadNotificationCount(session.user.id);
    }

    return (
        <html suppressHydrationWarning lang='en'>
            <body
                className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground flex min-h-screen flex-col antialiased`}>
                <NextAuthProvider>
                    <NotificationsProvider initialUnreadCount={initialUnreadCount}>
                        <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
                            <ToastProvider />
                            <NavigationHeader />
                            <main className='flex flex-1 flex-col items-center justify-center sm:px-6 lg:px-8'>
                                {children}
                            </main>
                            <footer className='border-t py-6'>
                                <div className='text-muted-foreground container mx-auto px-4 text-center text-sm'>
                                    © {new Date().getFullYear()} Starter Template
                                </div>
                            </footer>
                        </ThemeProvider>
                    </NotificationsProvider>
                </NextAuthProvider>
            </body>
        </html>
    );
}
