// Styles
import styles from "./game.module.css";

// Hooks
import { notFound } from "next/navigation";

// Components
import Banner from "@/components/ui/games/Banner/Banner";
import GameLevels from "@/components/ui/games/Levels/Levels";

export default async function GameLevelsPage({ params }: { params: Promise<{ game: string }> }) {

    // Extract Params
    const { game } = await params;
    const properGameName = game.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
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
                    <h1>{properGameName} Levels</h1>
                    <h4>(Everyday a new level)</h4>
                </div>
                <GameLevels game={game.replace(/-/g, '_')} />
            </div>
        </main>
    );
}