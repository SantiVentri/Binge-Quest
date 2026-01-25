"use client";

// Styles
import styles from "./EditBanner.module.css"

// Components
import Image from "next/image"

// Hooks
import { ChangeEvent, useRef, useState } from "react";

// Context
import { useAuth } from "@/context/AuthContext";

// Supabase
import { createClient } from "@/utils/supabase/client";

// Icons
import { Trash2, Upload } from "lucide-react"
import { useToast } from "@/context/ToastContext";

export default function EditBanner({
    banner,
    onBannerUpdate
}: {
    banner: string;
    onBannerUpdate?: (newBanner: string) => void
}) {
    const { user } = useAuth();
    const supabase = createClient();
    const Toast = useToast();

    // States
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [currentBanner, setCurrentBanner] = useState<string>(banner);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleUploadClick = () => fileInputRef.current?.click();

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        if (!user || isUploading) return;

        const file = event.target.files?.[0];
        if (!file) return;

        const allowedTypes = ["image/png", "image/jpeg"];
        const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

        if (!allowedTypes.includes(file.type)) {
            Toast.showToast("El archivo debe ser una imagen PNG o JPEG.", "error");
            event.target.value = "";
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            Toast.showToast("El archivo es demasiado grande. El tamaño máximo es 5MB.", "error");
            event.target.value = "";
            return;
        }

        setIsUploading(true);

        const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
        const filePath = `${user.id}/banner/${fileName}`;

        const { error: uploadError } = await supabase
            .storage
            .from("profiles")
            .upload(filePath, file, { upsert: true });

        if (uploadError) {
            Toast.showToast("Error uploading banner: " + uploadError.message, "error");
            setIsUploading(false);
            event.target.value = "";
            return;
        }

        const { data: publicUrlData } = supabase
            .storage
            .from("profiles")
            .getPublicUrl(filePath);

        const newBannerUrl = `${publicUrlData.publicUrl}?t=${Date.now()}`;

        const { error: updateError } = await supabase
            .from("profiles")
            .update({ banner: newBannerUrl })
            .eq("id", user.id);

        if (updateError) {
            Toast.showToast("Error updating banner: " + updateError.message, "error");
            setIsUploading(false);
            event.target.value = "";
            return;
        }

        Toast.showToast("Banner uploaded successfully", "success");

        // Clean up previous banner if it was custom
        if (currentBanner && !currentBanner.includes("default/banner.png")) {
            try {
                const url = new URL(currentBanner);
                const oldPath = url.pathname.split("/storage/v1/object/public/profiles/")[1];
                if (oldPath && oldPath !== filePath) {
                    await supabase.storage.from("profiles").remove([oldPath]);
                }
            } catch (err) {
                console.warn("Could not parse previous banner path", err);
            }
        }

        // Update local state and call callback
        setCurrentBanner(newBannerUrl);
        if (onBannerUpdate) {
            onBannerUpdate(newBannerUrl);
        }

        setIsUploading(false);
        event.target.value = "";
    };

    const handleDeleteBanner = async () => {
        if (!user) return;

        setIsDeleting(true);

        const defaultBanner = "https://xscyhjniouateyibsogs.supabase.co/storage/v1/object/public/profiles/default/banner.png";

        // Set banner to default image
        const { error } = await supabase
            .from('profiles')
            .update({ banner: defaultBanner })
            .eq('id', user.id);

        if (error) {
            Toast.showToast("Error deleting banner: " + error.message, "error");
            setIsDeleting(false);
            return;
        }

        // Delete banner from storage
        if (currentBanner && !currentBanner.includes("default/banner.png")) {
            const url = new URL(currentBanner);
            const avatarPath = url.pathname.split("/storage/v1/object/public/profiles/")[1];

            const { error: storageError } = await supabase
                .storage
                .from("profiles")
                .remove([avatarPath]);

            if (storageError) {
                Toast.showToast("Error removing banner from storage: " + storageError.message, "error");
                setIsDeleting(false);
                return;
            }
        }

        Toast.showToast("Banner deleted successfully", "success");

        // Update local state and call callback
        setCurrentBanner(defaultBanner);
        if (onBannerUpdate) {
            onBannerUpdate(defaultBanner);
        }

        setIsDeleting(false);
    }

    return (
        <div className={styles.container}>
            {currentBanner && (
                <Image
                    className={styles.banner}
                    src={currentBanner}
                    height={100}
                    width={350}
                    alt="User Banner"
                    draggable={false}
                />
            )}
            <div className={styles.buttons}>
                <button className={styles.upload} onClick={handleUploadClick} disabled={isUploading}>
                    <Upload />
                    {isUploading ? "Uploading..." : "Upload image"}
                </button>
                <button className={styles.delete} onClick={handleDeleteBanner} disabled={isDeleting}>
                    <Trash2 />
                    {isDeleting ? "Deleting..." : "Delete image"}
                </button>
            </div>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg"
                style={{ display: "none" }}
                onChange={handleFileChange}
            />
        </div>
    )
}