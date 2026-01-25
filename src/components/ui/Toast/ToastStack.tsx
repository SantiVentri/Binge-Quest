"use client";

import styles from "./ToastStack.module.css";
import { ToastType } from "@/context/ToastContext";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";

interface ToastStackProps {
    toasts: { id: string; message: string; type: ToastType }[];
    onDismiss: (id: string) => void;
}

export default function ToastStack({ toasts, onDismiss }: ToastStackProps) {
    const icons = {
        error: AlertCircle,
        success: CheckCircle2,
        info: Info,
    } as const;

    return (
        <div className={styles.container} aria-live="polite" aria-atomic="true">
            {toasts.map(({ id, message, type }) => (
                <div key={id} className={`${styles.toast} ${styles[type] ?? styles.info}`} role="status">
                    <div className={styles.content}>
                        {(() => {
                            const Icon = icons[type] ?? Info;
                            return <Icon className={styles.icon} aria-hidden="true" />;
                        })()}
                        <span>{message}</span>
                    </div>
                    <button className={styles.close} onClick={() => onDismiss(id)} aria-label="Cerrar alerta">
                        ×
                    </button>
                </div>
            ))}
        </div>
    );
}
