// components/support/support-context.tsx
'use client';

import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';

import { TicketCategory, TicketCreateData, TicketStatus, Ticket as TicketType } from '@/lib/services/ticket-service';

import { toast } from 'sonner';

// components/support/support-context.tsx

// components/support/support-context.tsx

// Create context with initial state
interface SupportContextType {
    tickets: TicketType[];
    isLoading: boolean;
    error: string | null;
    refreshTickets: () => Promise<void>;
    createTicket: (data: TicketCreateData) => Promise<{ success: boolean; ticketId?: string; error?: string }>;
}

const SupportContext = createContext<SupportContextType | undefined>(undefined);

// Provider component
export function SupportProvider({ children, userId }: { children: ReactNode; userId?: string }) {
    const [tickets, setTickets] = useState<TicketType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch tickets on mount and when userId changes
    useEffect(() => {
        if (userId) {
            refreshTickets();
        } else {
            // If no userId, clear tickets and stop loading
            setTickets([]);
            setIsLoading(false);
        }
    }, [userId]);

    // Function to fetch tickets from the API
    // In components/support/support-context.tsx - update the refreshTickets function
    const refreshTickets = async () => {
        if (!userId) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/support/tickets/user');

            if (!response.ok) {
                throw new Error('Failed to fetch tickets');
            }

            const data = await response.json();
            setTickets(data.tickets);
        } catch (err) {
            console.error('Error fetching tickets:', err);
            setError('Failed to load tickets');
        } finally {
            setIsLoading(false);
        }
    };

    // Function to create a new ticket
    const createTicket = async (
        data: TicketCreateData
    ): Promise<{ success: boolean; ticketId?: string; error?: string }> => {
        try {
            const response = await fetch('/api/support/tickets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...data,
                    userId: userId || null
                })
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message || 'Failed to create ticket');
            }

            // After successful creation, refresh the tickets list
            await refreshTickets();

            return {
                success: true,
                ticketId: responseData.ticketId
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';

            return {
                success: false,
                error: errorMessage
            };
        }
    };

    return (
        <SupportContext.Provider
            value={{
                tickets,
                isLoading,
                error,
                refreshTickets,
                createTicket
            }}>
            {children}
        </SupportContext.Provider>
    );
}

// Custom hook to use the support context
export function useSupport() {
    const context = useContext(SupportContext);

    if (context === undefined) {
        throw new Error('useSupport must be used within a SupportProvider');
    }

    return context;
}

// Re-export types from ticket-service
export type { TicketStatus, TicketCategory, Ticket } from '@/lib/services/ticket-service';
