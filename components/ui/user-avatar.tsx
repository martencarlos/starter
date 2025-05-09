'use client';

import React from 'react';

import Image from 'next/image';

import { User } from 'lucide-react';

interface UserAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
    name?: string | null;
    imageUrl?: string | null;
    size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
};

export function UserAvatar({ name, imageUrl, size = 'md', className, ...props }: UserAvatarProps) {
    // Get initials from name
    const initials = name
        ? name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .substring(0, 2)
        : '';

    return (
        <div
            className={`bg-primary text-primary-foreground flex items-center justify-center rounded-full ${
                sizeClasses[size]
            } ${className}`}
            {...props}>
            {imageUrl ? (
                <Image
                    src={imageUrl}
                    alt={name || 'User'}
                    className='h-full w-full rounded-full object-cover'
                    width={40}
                    height={40}
                />
            ) : initials ? (
                <span className='text-sm font-medium'>{initials}</span>
            ) : (
                <User className='h-5 w-5' />
            )}
        </div>
    );
}
