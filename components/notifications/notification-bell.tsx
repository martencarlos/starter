// components/notifications/notification-bell.tsx
import React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
// Shadcn Button
import { Skeleton } from '@/components/ui/skeleton';
import { useNotifications } from '@/hooks/use-notifications';

import { BellIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';

// Define props for NotificationBell. These will be passed by DropdownMenuTrigger
// when `asChild` is used. It primarily needs to accept HTML button attributes.
interface NotificationBellProps extends React.ComponentPropsWithoutRef<'button'> {}

export const NotificationBell = React.forwardRef<HTMLButtonElement, NotificationBellProps>((props, ref) => {
    const { unreadCount } = useNotifications();
    const { status: sessionStatus } = useSession();

    // During session loading, show a skeleton.
    // The Skeleton component should also accept ...props and ref to act as a trigger.
    if (sessionStatus === 'loading') {
        // Pass props and ref to Skeleton.
        // Note: Skeleton is a div, so the ref type might mismatch if DropdownMenuTrigger
        // strictly expects an HTMLButtonElement. However, for onClick and basic attributes,
        // this usually works. If stricter ref typing is needed, DropdownMenuTrigger's
        // child might need to be conditionally a Button or another focusable element.

        return <Skeleton className='h-9 w-9 rounded-full' {...props} ref={ref as any} />;
    }

    // If not authenticated, don't render the bell.
    if (sessionStatus !== 'authenticated') {
        return null;
    }

    // Render the actual Button, passing through props from DropdownMenuTrigger
    // and forwarding the ref.
    return (
        <Button
            variant='ghost'
            size='icon'
            className='relative h-9 w-9 rounded-full' // Specific styles for the bell
            aria-label='Notifications' // Default ARIA label
            {...props} // Spread props from DropdownMenuTrigger (onClick, aria-*, etc.)
            ref={ref} // Forward the ref to the underlying Button component
        >
            <BellIcon className='h-[1.2rem] w-[1.2rem]' />
            {unreadCount > 0 && (
                <Badge
                    variant='destructive'
                    className='absolute -top-1 -right-1 h-5 min-w-[1.25rem] justify-center rounded-full p-0.5 text-xs'>
                    {unreadCount > 9 ? '9+' : unreadCount}
                </Badge>
            )}
            <span className='sr-only'>Toggle notifications</span>
        </Button>
    );
});
NotificationBell.displayName = 'NotificationBell'; // Good practice for dev tools
