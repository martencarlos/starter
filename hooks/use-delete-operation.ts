// hooks/use-delete-operation.ts
import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { toast } from 'sonner';

interface UseDeleteOperationOptions {
    resourceType: string;
    resourceId: string;
    resourceName?: string;
    redirectPath: string;
    endpoint: string;
    onSuccess?: () => void;
    onError?: (error: Error) => void;
}

export function useDeleteOperation({
    resourceType,
    resourceId,
    resourceName,
    redirectPath,
    endpoint,
    onSuccess,
    onError
}: UseDeleteOperationOptions) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    // Use a formatted name if provided, otherwise fall back to type and ID
    const displayName = resourceName || `${resourceType} #${resourceId}`;

    const handleDelete = async () => {
        setIsDeleting(true);
        setError(null);

        try {
            const response = await fetch(endpoint, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `Failed to delete ${resourceType}`);
            }

            toast.success(`${resourceType} deleted successfully`);
            setShowDeleteDialog(false);

            if (onSuccess) {
                onSuccess();
            }

            // Navigate away if redirect path provided
            if (redirectPath) {
                router.push(redirectPath);
                router.refresh();
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : `An error occurred when deleting ${resourceType}`;
            setError(errorMessage);
            toast.error(errorMessage);

            if (onError && err instanceof Error) {
                onError(err);
            }
        } finally {
            setIsDeleting(false);
        }
    };

    return {
        isDeleting,
        error,
        showDeleteDialog,
        setShowDeleteDialog,
        handleDelete,
        displayName
    };
}
