"use client"

// Styles
import styles from "./profile.module.css";

// Hooks and Helpers
import { useEffect, useState } from "react";
import { fetchUserImages, fetchUserTopGames } from "@/helpers/user";
import { useAuth } from "@/context/AuthContext";

// Components
import UserBanner from "@/components/ui/User/UserBanner/UserBanner";
import Image from "next/image";

export default function ProfilePage() {
    const { user, loading: authLoading } = useAuth();

    // Images states
    const [isLoadingImages, setIsLoadingImages] = useState<boolean>(true);
    const [avatar, setAvatar] = useState<string>("");
    const [banner, setBanner] = useState<string>("");

    // Stats states
    const [isLoadingStats, setIsLoadingStats] = useState<boolean>(true);
    const [topGames, setTopGames] = useState<any[]>([]);

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

            setIsLoadingStats(true);
            const top = await fetchUserTopGames(user.id);
            setTopGames(top);
            setIsLoadingStats(false);
        }

        if (!authLoading) {
            fetchStats();
        }
    }, [user, authLoading]);

    if (authLoading || (isLoadingImages && user)) return <main></main>;

    if (!user) return <main></main>;

    return (
        <main className={styles.profilePage}>
            <UserBanner bannerUrl={banner} />
            <div className={styles.container}>
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
                    {isLoadingStats ? (
                        <p>Loading...</p>
                    ) : (
                        <ul className={styles.gamesList}>
                            {Array.from({ length: 3 }).map((_, index) => {
                                const game = topGames[index];
                                return (
                                    <li key={index} className={styles.gameItem}>
                                        {game ? (
                                            <>
                                                <Image
                                                    src={`/images/games/${game.game}.png`}
                                                    height={134}
                                                    width={220}
                                                    alt="Game image"
                                                    draggable={false}
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
                    )}
                </section>
            </div>
        </main>
    )
}