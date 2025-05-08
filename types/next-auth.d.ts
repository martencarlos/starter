import 'next-auth';

// Add custom properties to the Session and JWT interfaces
declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
        };
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string;
        provider?: string;
    }
}
