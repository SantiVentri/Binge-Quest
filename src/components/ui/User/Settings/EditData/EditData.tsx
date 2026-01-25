"use client"

// Styles
import styles from "./EditData.module.css";

// Hooks
import { useState } from "react";

// Supabase
import { createClient } from "@/utils/supabase/client";

// Context
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/context/ToastContext";

export default function EditData() {
    const user = useAuth();
    const supabase = createClient();
    const Toast = useToast();

    // States
    const [currentUsername, setCurrentUsername] = useState<string>(user?.user?.user_metadata.display_name || "");
    const [newPassword, setNewPassword] = useState<string>("");
    const [isUpdating, setIsUpdating] = useState<boolean>(false);

    const handleUpdateUsername = async () => {
        if (!user) return;

        setIsUpdating(true);

        // Validation
        if (currentUsername === user.user?.user_metadata.display_name) {
            setIsUpdating(false);
            return;
        }

        if (currentUsername.length < 4 || currentUsername.length > 20) {
            Toast.showToast("The username must be between 3 and 20 characters long.", "error");
            setIsUpdating(false);
            return;
        }

        if (!/^[a-zA-Z0-9_]+$/.test(currentUsername)) {
            Toast.showToast("The username can only contain letters, numbers, and underscores.", "error");
            setIsUpdating(false);
            return;
        }

        // Update username
        const { error } = await supabase
            .auth
            .updateUser({
                data: {
                    display_name: currentUsername,
                },
            });

        // Error handling
        if (error) {
            Toast.showToast("Error updating username: " + error.message, "error");
            setIsUpdating(false);
            return;
        }

        // Success
        Toast.showToast("Username updated successfully!", "success");
        setIsUpdating(false);
    }

    const handleUpdatePassword = async () => {
        if (!user) return;

        setIsUpdating(true);

        // Validation
        if (newPassword.trim() === "") {
            setIsUpdating(false);
            return;
        }

        if (newPassword.length < 6) {
            Toast.showToast("The password must be at least 6 characters long.", "error");
            setIsUpdating(false);
            return;
        }

        if (newPassword.length > 40) {
            Toast.showToast("The password cannot be longer than 40 characters.", "error");
            setIsUpdating(false);
            return;
        }

        if (!/[A-Za-z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
            Toast.showToast("The password must contain at least one letter and one number.", "error");
            setIsUpdating(false);
            return;
        }

        // Update password
        const { error } = await supabase
            .auth
            .updateUser({
                password: newPassword,
            });

        // Error handling
        if (error) {
            Toast.showToast("Error updating password: " + error.message, "error");
            setIsUpdating(false);
            return;
        }

        // Success
        Toast.showToast("Password updated successfully!", "success");
        setIsUpdating(false);
    }

    return (
        <div className={styles.container}>
            <input
                type="text"
                name="username"
                id="username"
                placeholder={"Your username"}
                value={currentUsername}
                onChange={(e) => setCurrentUsername(e.target.value)}
                onBlur={handleUpdateUsername}
                minLength={4}
                disabled={isUpdating}
                autoComplete="username"
                aria-label="Username"
            />
            <input
                type="password"
                name="password"
                id="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                onBlur={handleUpdatePassword}
                disabled={isUpdating}
                minLength={6}
                aria-label="New password"
            />
        </ div>
    )
}