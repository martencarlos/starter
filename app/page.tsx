// app/page.tsx
'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

// app/page.tsx

export default function HomePage() {
    const router = useRouter();

    useEffect(() => {
        router.push('/home');
    }, [router]);

    return null;
}
