// Styles
import styles from "./SuccessModal.module.css";

// Components
import Modal from "@/components/ui/Modal/Modal";
import Image from "next/image";

interface SuccessModalProps {
    onClose: () => void;
}

export default function SuccessModal({
    onClose,
}: SuccessModalProps) {
    const successGif = "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExZWc1b2ZoZDRpNG4xM2l2MG5weTcxcTFhZnpjdmgzcGN3cjliMm9xciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/9EvnXdZaUZbCqScn67/giphy.gif";

    return (
        <Modal onClose={onClose} className={styles.successModal}>
            <div className={styles.modalContent}>
                <Image
                    src={successGif}
                    alt="Success"
                    height={360}
                    width={460}
                    unoptimized
                />
                <div className={styles.modalText}>
                    <h2 className={styles.successTitle}>Blockbuster Performance!</h2>
                    <p className={styles.modalMessage}>
                        You nailed that scene! You're a true cinephile. <br /> Come back tomorrow for the sequel.
                    </p>
                </div>
                <div className={styles.buttons}>
                    <button className={styles.button} onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </Modal>
    );
}
