"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export function usePortal() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    const renderPortal = (children: React.ReactNode) => {
        if (!mounted) return null;
        return createPortal(children, document.body);
    };

    return renderPortal;
}
