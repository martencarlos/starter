// app/verify-email/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { userService } from '@/lib/services/user-service';

import { CheckCircle2, XCircle } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Verify Email',
    description: 'Verify your email address'
};

export default async function VerifyEmailPage({ searchParams }: { searchParams: { token?: string } }) {
    const token = searchParams.token;

    // If no token is provided, show an error
    if (!token) {
        return (
            <div className='container mx-auto flex max-w-md flex-col items-center justify-center px-4 py-16 text-center'>
                <XCircle className='text-destructive mb-4 h-16 w-16' />
                <h1 className='text-2xl font-bold'>Invalid Verification Link</h1>
                <p className='text-muted-foreground mt-2 mb-6'>The verification link is invalid or has expired.</p>
                <Button asChild>
                    <Link href='/login'>Return to Login</Link>
                </Button>
            </div>
        );
    }

    // Verify the email
    const verificationResult = await userService.verifyEmail(token);

    // If verification was successful, redirect to login page with success message
    if (verificationResult) {
        redirect('/login?verified=true');
    }

    // If verification failed, show an error
    return (
        <div className='container mx-auto flex max-w-md flex-col items-center justify-center px-4 py-16'>
            <Card className='w-full'>
                <CardHeader className='text-center'>
                    <XCircle className='text-destructive mx-auto mb-4 h-12 w-12' />
                    <CardTitle>Verification Failed</CardTitle>
                    <CardDescription>The verification link is invalid or has expired.</CardDescription>
                </CardHeader>
                <CardContent className='text-center'>
                    <p className='text-muted-foreground'>
                        Please try again or request a new verification email from your profile page after logging in.
                    </p>
                </CardContent>
                <CardFooter className='flex justify-center'>
                    <Button asChild>
                        <Link href='/login'>Return to Login</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
