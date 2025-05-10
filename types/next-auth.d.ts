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
            // Added fields
            createdAt?: string | null; // ISO date string
            emailVerified?: boolean | null;
            oauthProvider?: string | null;
        };
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string;
        provider?: string; // NextAuth's own provider (e.g., 'google', 'credentials')
        roles?: string[];
        permissions?: string[];
        // Added fields
        name?: string | null;
        email?: string | null;
        createdAt?: string | null; // ISO date string
        emailVerified?: boolean | null;
        oauthProvider?: string | null; // From our DB schema
    }
}
