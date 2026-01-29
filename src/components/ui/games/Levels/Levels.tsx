"use client";

import { createClient } from "@/utils/supabase/client";
// Styles
import styles from "./Levels.module.css";


// Hooks
import { useState, useEffect } from "react";
import { useToast } from "@/context/ToastContext";
import EmptyListComponent from "../../EmptyListComponent/EmptyListComponent";
import Link from "next/link";

export default function GameLevels({ game }: { game: string }) {
    const [levels, setLevels] = useState<[]>([]);

    const supabase = createClient();
    const Toast = useToast();

    // Fetch Levels
    const fetchLevels = async (game: string) => {
        const { data, error } = await supabase
            .from(`${game}`)
            .select("release_at")
            .order("release_at", { ascending: true });

        if (error) {
            Toast.showToast("Error fetching levels." + error.message, "error");
            return;
        }

        setLevels(data as []);
    }

    useEffect(() => {
        fetchLevels(game);
    }, [game]);

    return (
        <div className={styles.levelsGrid}>
            {levels.length > 0 ? levels.map((level: any, index: number) => (
                <Link
                    key={index}
                    href={`/games/levels/${game.replace(/_/g, '-')}/${level.release_at}`}
                >
                    <div className={styles.levelCard}>
                        {index + 1}
                    </div>
                </Link>
            )) : (
                <div className={styles.emptyContainer}>
                    <EmptyListComponent />
                </div>
            )}
        </div>
    )
}