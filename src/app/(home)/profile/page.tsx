"use client"

// Styles
import styles from "./profile.module.css";

// Hooks and Helpers
import { useEffect, useState } from "react";
import { fetchUserImages } from "@/helpers/user";
import { useAuth } from "@/context/AuthContext";

// Components
import UserBanner from "@/components/ui/User/UserBanner/UserBanner";
import Image from "next/image";

export default function ProfilePage() {
    const { user, loading: authLoading } = useAuth();
    const [isLoadingImages, setIsLoadingImages] = useState<boolean>(true);
    const [avatar, setAvatar] = useState<string>("");
    const [banner, setBanner] = useState<string>("");

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

    if (authLoading || (isLoadingImages && user)) return <main></main>;

    if (!user) return <main></main>;

    return (
        <main className={styles.profilePage}>
            <UserBanner bannerUrl={banner} />
            <div className={styles.container}>
                <div className={styles.userData}>
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
                </div>
            </div>
        </main>
    )
}