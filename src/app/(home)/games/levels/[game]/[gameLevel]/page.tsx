// Styles
import styles from "./gameLevel.module.css";

// Hooks
import { notFound } from "next/navigation";

// Components
import Banner from "@/components/ui/games/Banner/Banner";

export default async function GameLevelsPage({ params }: { params: Promise<{ game: string; gameLevel: string }> }) {
    // Extract Params
    const { game, gameLevel } = await params;
    const properGameName = game.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    const formattedDate = gameLevel.replace(/-/g, ' ');
    const games = ["trivia-game", "find-the-impostor", "guess-the-film"]

    // Validate Game
    if (!game || game.trim() === "" || games.indexOf(game) === -1) {
        return notFound();
    }

    return (
        <main className={styles.page}>
            <Banner />
            <div className={styles.container}>
                <div className={styles.titles}>
                    <h1>{properGameName} Level {formattedDate}</h1>
                </div>
            </div>
        </main>
    );
}