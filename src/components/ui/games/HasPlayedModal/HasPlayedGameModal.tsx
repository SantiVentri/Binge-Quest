// Styles
import styles from "./HasPlayedModal.module.css";

// Components
import Modal from "@/components/ui/Modal/Modal";
import { getTomorrowDate } from "@/helpers/games";
import Image from "next/image";
import Link from "next/link";

interface HasPlayedModalProps {
    gameSlug: string;
    gameLevel: string;
}

export default function HasPlayedGameModal({
    gameSlug,
    gameLevel
}: HasPlayedModalProps) {
    const hasPlayedGif = "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExc3NkdWVrM2d5aXNyczBveXUwMjVrcDk1OWk4NG55N3JzMTRoNmRkaSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/p7ESzgUi7li93Hxjte/giphy.gif";

    // Get tomorrow's date
    const nextLevel = getTomorrowDate(gameLevel);

    return (
        <Modal onClose={() => { }} className={styles.hasPlayedModal}>
            <div className={styles.modalContent}>
                <Image
                    src={hasPlayedGif}
                    width={460}
                    height={250}
                    alt="Has Played Today Modal GIF"
                    draggable={false}
                    unoptimized
                />
                <div className={styles.modalText}>
                    <h2 className={styles.title}>You've already played today's game!</h2>
                    <p className={styles.modalMessage}>Come back tomorrow for a new question or checkout some of our other games in the home page!</p>
                </div>
                <div className={styles.buttons}>
                    <Link href={`/games/${gameSlug}/levels/${nextLevel}`} className={styles.button}>
                        Next Level
                    </Link>
                    <Link href={`/games/${gameSlug}/levels`} className={styles.button} style={{ backgroundColor: "#0E0E0E" }}>
                        See all levels
                    </Link>
                </div>
            </div>
        </Modal>
    );
}
