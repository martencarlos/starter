'use client';

import { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';

import { AlertCircle, CheckCircle2, InfoIcon, XCircle } from 'lucide-react';

interface StatusModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: ReactNode;
    status: 'success' | 'error' | 'warning' | 'info';
    primaryAction?: {
        label: string;
        onClick: () => void;
    };
    secondaryAction?: {
        label: string;
        onClick: () => void;
    };
}

export function StatusModal({
    open,
    onOpenChange,
    title,
    description,
    status,
    primaryAction,
    secondaryAction
}: StatusModalProps) {
    const StatusIcon = () => {
        switch (status) {
            case 'success':
                return <CheckCircle2 className='h-10 w-10 text-green-600' />;
            case 'error':
                return <XCircle className='text-destructive h-10 w-10' />;
            case 'warning':
                return <AlertCircle className='h-10 w-10 text-amber-500' />;
            case 'info':
            default:
                return <InfoIcon className='h-10 w-10 text-blue-500' />;
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='sm:max-w-md'>
                <DialogHeader className='flex flex-col items-center gap-4 sm:items-start'>
                    <div className='flex items-center gap-4'>
                        <StatusIcon />
                        <DialogTitle>{title}</DialogTitle>
                    </div>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>

                <DialogFooter className='sm:justify-end'>
                    {secondaryAction && (
                        <Button variant='outline' onClick={secondaryAction.onClick}>
                            {secondaryAction.label}
                        </Button>
                    )}
                    {primaryAction && (
                        <Button
                            onClick={primaryAction.onClick}
                            variant={status === 'error' ? 'destructive' : 'default'}>
                            {primaryAction.label}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
