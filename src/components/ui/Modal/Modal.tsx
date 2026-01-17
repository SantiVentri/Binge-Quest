// Styles
import styles from "./Modal.module.css";

export default function Modal({
    children,
    onClose,
    className
}: {
    children: React.ReactNode;
    onClose: () => void;
    className?: string;
}) {
    return (
        <div className={styles.modalBackdrop} onClick={onClose}>
            <div className={`${styles.modalContent} ${className || ""}`} onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
}