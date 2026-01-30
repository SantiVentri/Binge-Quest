"use client";

// Styles
import styles from "./Levels.module.css";

// Supabase
import { createClient } from "@/utils/supabase/client";

// Toast Context
import { useToast } from "@/context/ToastContext";

// Hooks
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Helpers
import { hasPlayedGame } from "@/helpers/games";

// Components
import EmptyListComponent from "../../EmptyListComponent/EmptyListComponent";
import { GameSessionProps } from "@/types";

export default function GameLevels({ game }: { game: string }) {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [levels, setLevels] = useState<[]>([]);
    const [playedLevels, setPlayedLevels] = useState<Set<string>>(new Set());

    const supabase = createClient();
    const Toast = useToast();
    const router = useRouter();

    // Fetch Levels
    const fetchLevels = async (game: string) => {
        setIsLoading(true);
        const today = new Date().toISOString().split('T')[0];
        const { data, error } = await supabase
            .from(`${game}`)
            .select("release_at")
            .lte("release_at", today)
            .order("release_at", { ascending: true });

        if (error) {
            Toast.showToast("Error fetching levels." + error.message, "error");
            return;
        }

        setLevels(data as []);

        // Check which levels have been played
        const played = new Set<string>();
        for (const level of data as any[]) {
            const hasPlayed = await hasPlayedGame({ game: game as GameSessionProps["game"], game_date: level.release_at });
            if (hasPlayed) {
                played.add(level.release_at);
            }
        }
        setPlayedLevels(played);
        setIsLoading(false);
    }

    useEffect(() => {
        fetchLevels(game);
    }, [game]);

    return (
        <div className={styles.levelsGrid}>
            {!isLoading ? (
                levels.length > 0 ? levels.map((level: any, index: number) => (
                    <button
                        key={index}
                        className={styles.levelCard}
                        onClick={() => router.push(`/games/${game.replace(/_/g, '-')}/levels/${level.release_at}`)}
                        disabled={isLoading || playedLevels.has(level.release_at)}
                    >
                        {index + 1}
                    </button>
                )) : (
                    <div className={styles.emptyContainer}>
                        <EmptyListComponent />
                    </div>
                )
            ) : (
                Array.from({ length: 15 }).map((_, i) => (
                    <div key={i} className={styles.emptyItem} />
                ))
            )}
        </div>
    )
}