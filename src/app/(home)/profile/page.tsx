"use client"

// Styles
import styles from "./profile.module.css";

// Hooks and Helpers
import { useEffect, useState } from "react";
import { fetchAllGamesWinRates, fetchUserImages, fetchUserTopGames } from "@/helpers/user";
import { useAuth } from "@/context/AuthContext";

// Components
import Image from "next/image";
import Banner from "@/components/ui/games/Banner/Banner";

// Icons
import SettingsIcon from "../../../../public/icons/Settings.png";
import SettingsModal from "@/components/ui/User/Settings/Modal/SettingsModal";

// Game Titles
const gameTitles: Record<string, string> = {
    "guess_the_film": "🎬 Guess The Film",
    "trivia_game": "🧠 Trivia Game",
    "find_the_impostor": "🔍 Find The Impostor"
};

export default function ProfilePage() {
    const { user, loading: authLoading } = useAuth();

    // Images states
    const [isLoadingImages, setIsLoadingImages] = useState<boolean>(true);
    const [avatar, setAvatar] = useState<string>("");
    const [banner, setBanner] = useState<string>("");

    // Stats states
    const [topGames, setTopGames] = useState<any[]>([]);
    const [winRates, setWinRates] = useState<{ game: string; correct: number; total: number; winRate: number | null }[]>([]);

    // Settings Modal state
    const [showSettingsModal, setShowSettings] = useState<boolean>(false);

    // Fetch user data
    useEffect(() => {
        const fetchUserData = async () => {
            if (!user) return;

            setIsLoadingImages(true);
            const { avatar, banner } = await fetchUserImages(user.id);

            setAvatar(avatar || "");
            setBanner(banner || "");
            setIsLoadingImages(false);
        }

        if (!authLoading) {
            fetchUserData();
        }
    }, [user, authLoading]);

    // Fetch user stats
    useEffect(() => {
        const fetchStats = async () => {
            if (!user) return;

            const top = await fetchUserTopGames(user.id);
            const rates = await fetchAllGamesWinRates(user.id);

            setTopGames(top);
            setWinRates(rates);
        }

        if (!authLoading) {
            fetchStats();
        }
    }, [user, authLoading]);

    if (authLoading || (isLoadingImages && user)) return <main></main>;

    if (!user) return <main></main>;

    return (
        <main className={styles.profilePage}>
            {showSettingsModal && (
                <SettingsModal
                    avatar={avatar}
                    banner={banner}
                    onClose={() => setShowSettings(false)}
                    onAvatarUpdate={(newAvatar) => setAvatar(newAvatar)}
                />
            )}
            <Banner image={banner} alt={`${user.email}'s banner`} />
            <div className={styles.container}>
                <button className={styles.settingsIcon} onClick={() => setShowSettings(true)}>
                    <Image
                        src={SettingsIcon}
                        height={25}
                        width={25}
                        alt="Settings icon"
                        draggable={false}
                    />
                </button>
                <section className={styles.userData}>
                    {avatar && (
                        <Image
                            src={avatar}
                            height={150}
                            width={150}
                            alt="User avatar"
                            draggable={false}
                            className={styles.avatar}
                        />
                    )}
                    <div className={styles.userInfo}>
                        <h1>{user.user_metadata.display_name}</h1>
                        <h4>{user.email}</h4>
                    </div>
                </section>
                <section className={styles.topGames}>
                    <h2>Top Played Games</h2>
                    <ul className={styles.gamesList}>
                        {Array.from({ length: 3 }).map((_, index) => {
                            const game = topGames[index];
                            return (
                                <li key={index} className={styles.gameItem}>
                                    {game ? (
                                        <>
                                            <Image
                                                className={styles.gameImage}
                                                src={`/images/games/${game.game}.png`}
                                                height={134}
                                                width={220}
                                                alt="Game image"
                                                draggable={false}
                                                unoptimized
                                                quality={100}
                                            />
                                            <span className={`${styles.medal} ${styles[`medal${index + 1}`]}`}>
                                                {index + 1}
                                            </span>
                                        </>
                                    ) : (
                                        <div className={styles.emptySlot}></div>
                                    )}
                                </li>
                            )
                        })}
                    </ul>
                </section>
                <section className={styles.winRates}>
                    <div className={styles.ratesHeader}>
                        <span>Game</span>
                        <div className={styles.headerData}>
                            <span>Score</span>
                            <span>Win Rate</span>
                        </div>
                    </div>
                    <ul className={styles.ratesList}>
                        {winRates.map((rate) => (
                            <li key={rate.game} className={styles.rateItem}>
                                <h3>{gameTitles[rate.game]}</h3>
                                <div className={styles.data}>
                                    <p>{rate.total > 0 ? `${rate.correct}/${rate.total}` : "-/-"}</p>
                                    <p className={styles.rate}>{rate.winRate !== null ? `${rate.winRate}%` : "-"}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>
            </div>
        </main>
    )
}