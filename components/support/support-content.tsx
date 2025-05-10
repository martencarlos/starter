// components/support/support-content.tsx
'use client';

import { useEffect, useState } from 'react';

// Import useEffect
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { SupportProvider } from '@/components/support/support-context';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { SupportFAQ } from './support-faq';
import { SupportTicketForm } from './support-ticket-form';
import { TicketHistory } from './ticket-history';
import { CheckCircle2, HelpCircle, LifeBuoy, Mail, MessageSquare, Phone, TicketIcon } from 'lucide-react';
import { toast } from 'sonner';

// components/support/support-content.tsx

interface SupportContentProps {
    user: {
        id: string;
        name?: string | null;
        email?: string | null;
        roles?: string[];
    } | null;
    initialActiveTab?: 'contact' | 'faq' | 'tickets';
}

export default function SupportContent({ user, initialActiveTab = 'contact' }: SupportContentProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Initialize activeTab state from URL search param or the initial prop
    const [activeTab, setActiveTab] = useState<string>(() => {
        return searchParams.get('tab') || initialActiveTab;
    });

    // Effect to synchronize activeTab with URL changes (e.g., browser back/forward)
    useEffect(() => {
        const tabFromUrl = searchParams.get('tab') || initialActiveTab;
        if (tabFromUrl !== activeTab) {
            setActiveTab(tabFromUrl);
        }
    }, [searchParams, initialActiveTab]); // Removed activeTab from deps to avoid potential loops, state is set if different

    const handleSuccess = (message: string) => {
        toast.success(message);
    };

    const handleError = (message: string) => {
        toast.error(message);
    };

    // Update URL and state when tab changes
    const handleTabChange = (value: string) => {
        setActiveTab(value); // Update state immediately for responsive UI

        // Create new URL with updated tab parameter
        // Use .toString() on searchParams to ensure a new mutable instance is created correctly
        const params = new URLSearchParams(searchParams.toString());
        params.set('tab', value);

        const currentUrlTab = searchParams.get('tab');
        // Only push to router if the new tab state results in a different URL query param
        // This also handles the case where `value` is the `initialActiveTab` and the URL doesn't yet have a `tab` param
        if (currentUrlTab !== value || (!currentUrlTab && value === initialActiveTab)) {
            router.push(`/support?${params.toString()}`, { scroll: false });
        }
    };

    return (
        <SupportProvider userId={user?.id}>
            <div className='container mx-auto max-w-4xl px-4 py-8'>
                <div className='mb-8 flex flex-col items-start gap-2'>
                    <h1 className='text-3xl font-bold'>Support Center</h1>
                    <p className='text-muted-foreground'>Get help and support for your account and services</p>

                    {user && (
                        <div className='mt-2 flex items-center gap-2'>
                            <Badge variant='outline' className='px-3 py-1'>
                                <CheckCircle2 className='mr-1 h-3 w-3 text-green-500' />
                                Logged in as {user.name || user.email}
                            </Badge>

                            {user.roles && user.roles.includes('admin') && <Badge variant='secondary'>Admin</Badge>}
                        </div>
                    )}
                </div>

                <Tabs value={activeTab} onValueChange={handleTabChange} className='w-full'>
                    <TabsList className='mb-6 w-full justify-start'>
                        <TabsTrigger value='contact'>
                            <MessageSquare className='mr-2 h-4 w-4' />
                            Contact Us
                        </TabsTrigger>
                        <TabsTrigger value='faq'>
                            <HelpCircle className='mr-2 h-4 w-4' />
                            FAQ
                        </TabsTrigger>
                        {user && (
                            <TabsTrigger value='tickets'>
                                <TicketIcon className='mr-2 h-4 w-4' />
                                My Tickets
                            </TabsTrigger>
                        )}
                    </TabsList>

                    <div className='space-y-6'>
                        <TabsContent value='contact' className='mt-0'>
                            <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
                                <div className='md:col-span-2'>
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Submit a Support Request</CardTitle>
                                            <CardDescription>
                                                Fill out the form below and our support team will get back to you as
                                                soon as possible.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <SupportTicketForm
                                                user={user}
                                                onSuccess={(message) => {
                                                    handleSuccess(message);
                                                    if (user) {
                                                        setTimeout(() => {
                                                            handleTabChange('tickets');
                                                        }, 1500);
                                                    }
                                                }}
                                                onError={handleError}
                                                onTicketCreated={() => {
                                                    // This is now handled by the context, but we keep the callback for flexibility
                                                }}
                                            />
                                        </CardContent>
                                    </Card>
                                </div>

                                <div>
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Contact Information</CardTitle>
                                            <CardDescription>
                                                Alternative ways to reach our support team
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className='space-y-4'>
                                            <div className='flex items-start gap-3'>
                                                <Mail className='text-primary h-5 w-5' />
                                                <div>
                                                    <p className='font-medium'>Email Support</p>
                                                    <p className='text-muted-foreground text-sm'>
                                                        <a
                                                            href='mailto:admin@carlosmarten.com'
                                                            className='text-primary hover:underline'>
                                                            admin@carlosmarten.com
                                                        </a>
                                                    </p>
                                                    <p className='text-muted-foreground mt-1 text-xs'>
                                                        Response time: 24-48 hours
                                                    </p>
                                                </div>
                                            </div>

                                            <div className='flex items-start gap-3'>
                                                <Phone className='text-primary h-5 w-5' />
                                                <div>
                                                    <p className='font-medium'>Phone Support</p>
                                                    <p className='text-muted-foreground text-sm'>
                                                        <a
                                                            href='tel:+34747478404'
                                                            className='text-primary hover:underline'>
                                                            +34 747 47 84 04
                                                        </a>
                                                    </p>
                                                    <p className='text-muted-foreground mt-1 text-xs'>
                                                        Monday-Friday: 9AM-5PM EST
                                                    </p>
                                                </div>
                                            </div>

                                            <div className='flex items-start gap-3'>
                                                <LifeBuoy className='text-primary h-5 w-5' />
                                                <div>
                                                    <p className='font-medium'>Help Center</p>
                                                    <p className='text-muted-foreground text-sm'>
                                                        <a // Changed from Link to <a> for custom onClick, or keep <Link> and add onClick
                                                            href='/support?tab=faq' // href is still good for SEO and right-click open in new tab
                                                            onClick={(e) => {
                                                                e.preventDefault(); // Prevent full navigation for SPA-like tab switch
                                                                handleTabChange('faq');
                                                            }}
                                                            className='text-primary hover:underline'>
                                                            Browse our documentation
                                                        </a>
                                                    </p>
                                                    <p className='text-muted-foreground mt-1 text-xs'>
                                                        Frequently asked questions
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className='mt-4'>
                                        <CardHeader className='py-4'>
                                            <CardTitle className='text-base'>Support Status</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className='flex items-center gap-2'>
                                                <span className='inline-block h-3 w-3 rounded-full bg-green-500'></span>
                                                <span className='text-sm'>All systems operational</span>
                                            </div>
                                            <p className='text-muted-foreground mt-2 text-xs'>
                                                Current response time: ~4 hours
                                            </p>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value='faq' className='mt-0'>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Frequently Asked Questions</CardTitle>
                                    <CardDescription>Find quick answers to common questions</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <SupportFAQ />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {user && (
                            <TabsContent value='tickets' className='mt-0'>
                                <TicketHistory onSwitchToContactTab={() => handleTabChange('contact')} />
                            </TabsContent>
                        )}
                    </div>
                </Tabs>

                {!user && (
                    <div className='mt-10 rounded-lg border p-6 text-center'>
                        <h3 className='mb-2 text-xl font-semibold'>Have an account?</h3>
                        <p className='text-muted-foreground mb-4'>
                            Sign in to track your support requests and get faster help
                        </p>
                        <div className='flex justify-center gap-4'>
                            <Button asChild variant='outline'>
                                <Link href={`/login?callbackUrl=/support?tab=${activeTab}`}>Sign In</Link>
                            </Button>
                            <Button asChild>
                                <Link href='/register'>Create Account</Link>
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </SupportProvider>
    );
}
