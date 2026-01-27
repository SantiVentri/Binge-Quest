// Styles
import styles from "./FailureModal.module.css";

// Components
import Modal from "@/components/ui/Modal/Modal";
import Image from "next/image";

interface FailureModalProps {
    onClose: () => void;
    correctAnswer: string;
}

export default function FailureModal({
    onClose,
    correctAnswer,
}: FailureModalProps) {
    const failureGif = "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExbzZ6MHU0YjNjeWg4c2l4aHNmcHJtaHBlY3h1aGQzcDNmY2k3MW15OCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/1BQdjXovIqSLS/giphy.gif";

    return (
        <Modal onClose={onClose} className={styles.modalFailure}>
            <div className={styles.modalContent}>
                <Image
                    src={failureGif}
                    alt="Failure"
                    width={460}
                    height={220}
                    unoptimized
                />
                <div className={styles.modalText}>
                    <h2 className={styles.failureTitle}>Plot Twist! Almost had it!</h2>
                    <p className={styles.modalMessage}>
                        The correct answer was <strong>&quot;{correctAnswer}&quot;</strong>. Don&apos;t worry, even the greats have off days. Catch you at the next screening!
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
