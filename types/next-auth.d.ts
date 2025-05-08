// types/next-auth.d.ts
import 'next-auth';

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
            roles?: string[];
            permissions?: string[];
        };
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string;
        provider?: string;
        roles?: string[];
        permissions?: string[];
    }
}
