"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import ToastStack from "@/components/ui/Toast/ToastStack";

export type ToastType = "error" | "success" | "info";

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextValue {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const DISMISS_DELAY = 2500;

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
        if (timers.current[id]) {
            clearTimeout(timers.current[id]);
            delete timers.current[id];
        }
    }, []);

    const showToast = useCallback(
        (message: string, type: ToastType = "info") => {
            const id = typeof crypto !== "undefined" && "randomUUID" in crypto
                ? crypto.randomUUID()
                : Math.random().toString(36).slice(2);

            const nextToast: Toast = { id, message, type };
            setToasts((prev) => [nextToast, ...prev]);

            timers.current[id] = setTimeout(() => removeToast(id), DISMISS_DELAY);
        },
        [removeToast]
    );

    useEffect(() => {
        return () => {
            Object.values(timers.current).forEach(clearTimeout);
            timers.current = {};
        };
    }, []);

    const value = useMemo(() => ({ showToast }), [showToast]);

    return (
        <ToastContext.Provider value={value}>
            {children}
            <ToastStack toasts={toasts} onDismiss={removeToast} />
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return ctx;
}
