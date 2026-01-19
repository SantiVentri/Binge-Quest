"use client";

// Hooks
import { useEffect, useState } from "react";

// Context
import { useUser } from "@/context/AuthContext";

// Helpers
import { fetchUserImages } from "@/helpers/user";

// Components
import Banner from "../../games/Banner/Banner";

interface UserBannerProps {
    bannerUrl?: string | null;
}

export default function UserBanner({ bannerUrl: propBannerUrl }: UserBannerProps) {
    const [fetchedBanner, setFetchedBanner] = useState<string | null>(null);
    const user = useUser();

    const displayBanner = propBannerUrl !== undefined ? propBannerUrl : fetchedBanner;

    useEffect(() => {
        if (propBannerUrl !== undefined) return;

        async function getUserImages() {
            const { banner } = await fetchUserImages(user?.id || "");
            setFetchedBanner(banner);
        }
        getUserImages();
    }, [user, propBannerUrl]);

    return (
        <>
            {displayBanner && <Banner image={displayBanner} alt="User banner" />}
        </>
    )
}