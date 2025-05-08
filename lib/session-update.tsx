'use client';

import { useSession } from 'next-auth/react';

/**
 * Hook to update the session data after user profile changes
 */
export function useSessionUpdate() {
    const { data: session, update } = useSession();

    /**
     * Updates the session with new user data
     * @param userData Partial user data to update in the session
     */
    const updateSession = async (userData: Partial<typeof session.user>) => {
        if (!session) return;

        try {
            // Update the session with the new user data
            await update({
                ...session,
                user: {
                    ...session.user,
                    ...userData
                }
            });

            console.log('Session updated successfully with new data:', userData);

            return true;
        } catch (error) {
            console.error('Failed to update session:', error);

            return false;
        }
    };

    return { updateSession };
}
