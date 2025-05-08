// components/rbac/permission-error-boundary.tsx
'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';

import { AlertCircle } from 'lucide-react';

// components/rbac/permission-error-boundary.tsx

// components/rbac/permission-error-boundary.tsx

interface PermissionErrorBoundaryProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export function PermissionErrorBoundary({ children, fallback }: PermissionErrorBoundaryProps) {
    const [hasError, setHasError] = useState(false);

    // Custom fallback UI if none provided
    const defaultFallback = (
        <div className='border-destructive/20 flex flex-col items-center justify-center rounded-lg border p-8'>
            <AlertCircle className='text-destructive mb-4 h-12 w-12' />
            <h3 className='mb-2 text-lg font-medium'>Permission Error</h3>
            <p className='text-muted-foreground mb-4 text-center'>
                You don't have the required permissions to view this content.
            </p>
            <Button onClick={() => window.location.reload()} variant='outline'>
                Refresh
            </Button>
        </div>
    );

    const handleError = (error: Error) => {
        console.error('Permission error caught:', error);
        setHasError(true);

        // You could also log this error to your monitoring system
        return true; // Tells React this error was handled
    };

    if (hasError) {
        return fallback || defaultFallback;
    }

    return (
        <React.ErrorBoundary fallback={fallback || defaultFallback} onError={handleError}>
            {children}
        </React.ErrorBoundary>
    );
}
