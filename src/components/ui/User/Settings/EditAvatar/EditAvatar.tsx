"use client";

// Styles
import styles from "./EditAvatar.module.css"

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

export default function EditAvatar({
    avatar,
    onAvatarUpdate
}: {
    avatar: string;
    onAvatarUpdate?: (newAvatar: string) => void
}) {
    const { user } = useAuth();
    const supabase = createClient();
    const Toast = useToast();

    // States
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [currentAvatar, setCurrentAvatar] = useState<string>(avatar);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleUploadClick = () => fileInputRef.current?.click();

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        if (!user || isUploading) return;

        const file = event.target.files?.[0];
        if (!file) return;

        const allowedTypes = ["image/png", "image/jpeg"];
        const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

        if (!allowedTypes.includes(file.type)) {
            Toast.showToast("El archivo debe ser PNG o JPEG.", "error");
            event.target.value = "";
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            Toast.showToast("El avatar debe pesar menos de 2MB.", "error");
            event.target.value = "";
            return;
        }

        setIsUploading(true);

        const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const filePath = `${user.id}/avatar.${fileExt}`;

        const { error: uploadError } = await supabase
            .storage
            .from("profiles")
            .upload(filePath, file, { upsert: true });

        if (uploadError) {
            Toast.showToast("Error uploading avatar: " + uploadError.message, "error");
            setIsUploading(false);
            event.target.value = "";
            return;
        }

        const { data: publicUrlData } = supabase
            .storage
            .from("profiles")
            .getPublicUrl(filePath);

        const newAvatarUrl = `${publicUrlData.publicUrl}?t=${Date.now()}`;

        const { error: updateError } = await supabase
            .from("profiles")
            .update({ avatar: newAvatarUrl })
            .eq("id", user.id);

        if (updateError) {
            Toast.showToast("Error updating avatar: " + updateError.message, "error");
            setIsUploading(false);
            event.target.value = "";
            return;
        }

        Toast.showToast("Avatar uploaded successfully", "success");

        // Clean up previous avatar if it was custom
        if (currentAvatar && !currentAvatar.includes("default/avatar.png")) {
            try {
                const url = new URL(currentAvatar);
                const oldPath = url.pathname.split("/storage/v1/object/public/profiles/")[1];
                if (oldPath && oldPath !== filePath) {
                    await supabase.storage.from("profiles").remove([oldPath]);
                }
            } catch (err) {
                console.warn("Could not parse previous avatar path", err);
            }
        }

        // Update local state and call callback
        setCurrentAvatar(newAvatarUrl);
        if (onAvatarUpdate) {
            onAvatarUpdate(newAvatarUrl);
        }

        setIsUploading(false);
        event.target.value = "";
    };

    const handleDeleteAvatar = async () => {
        if (!user) return;

        setIsDeleting(true);

        const defaultAvatar = "https://xscyhjniouateyibsogs.supabase.co/storage/v1/object/public/profiles/default/avatar.png";

        // Set avatar to default image
        const { error } = await supabase
            .from('profiles')
            .update({ avatar: defaultAvatar })
            .eq('id', user.id);

        if (error) {
            Toast.showToast("Error deleting avatar: " + error.message, "error");
            setIsDeleting(false);
            return;
        }

        // Delete avatar from storage
        if (currentAvatar && !currentAvatar.includes("default/avatar.png")) {
            const url = new URL(currentAvatar);
            const avatarPath = url.pathname.split("/storage/v1/object/public/profiles/")[1];

            const { error: storageError } = await supabase
                .storage
                .from("profiles")
                .remove([avatarPath]);

            if (storageError) {
                Toast.showToast("Error removing avatar from storage: " + storageError.message, "error");
                setIsDeleting(false);
                return;
            }
        }

        Toast.showToast("Avatar deleted successfully", "success");

        // Update local state and call callback
        setCurrentAvatar(defaultAvatar);
        if (onAvatarUpdate) {
            onAvatarUpdate(defaultAvatar);
        }

        setIsDeleting(false);
    }

    return (
        <div className={styles.container}>
            {currentAvatar && (
                <Image
                    className={styles.avatar}
                    src={currentAvatar}
                    height={120}
                    width={120}
                    alt="User avatar"
                    draggable={false}
                />
            )}
            <div className={styles.buttons}>
                <button className={styles.upload} onClick={handleUploadClick} disabled={isUploading}>
                    <Upload />
                    {isUploading ? "Uploading..." : "Upload image"}
                </button>
                <button className={styles.delete} onClick={handleDeleteAvatar} disabled={isDeleting}>
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