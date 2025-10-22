import { useState, useCallback } from "react";
import LoadingRing from "@/components/LoadingRing";

export function useLoadingRing() {
    const [isLoading, setIsLoading] = useState(false);

    // Optional: async wrapper, damit du automatisch Loading setzt
    const withLoading = useCallback(async (fn: () => Promise<any>) => {
        setIsLoading(true);
        try {
            return await fn();
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Das gerenderte UI direkt als React Node
    const loadingUi = isLoading ? <LoadingRing /> : null;

    return {
        isLoading,
        setIsLoading,
        withLoading,
        loadingUi,
    };
}
