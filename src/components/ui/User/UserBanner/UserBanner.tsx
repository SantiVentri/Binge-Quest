"use client";

import { useEffect, useState } from "react";
import Banner from "../../games/Banner/Banner";
import { createClient } from "@/utils/supabase/client";
import { useUser } from "@/context/AuthContext";

export default function UserBanner() {
    const [bannerUrl, setBannerUrl] = useState<string | null>(null);
    const supabase = createClient();
    const user = useUser();

    useEffect(() => {
        const fetchUserImages = async () => {
            if (!user) return;

            const { data, error } = await supabase
                .from("profiles")
                .select("banner")
                .eq("id", user.id)
                .single();

            if (error) {
                console.error("Error fetching user images:", error);
                return;
            }
            setBannerUrl(data.banner);
        }
        fetchUserImages();
    }, [user]);

    return (
        <>
            {bannerUrl && <Banner image={bannerUrl} alt="User banner" />}
        </>
    )
}