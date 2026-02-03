"use client";

// Styles
import styles from "../auth.module.css";

// Icons
import { Trash2 } from "lucide-react";

// Hooks
import { useState } from "react";

// Context
import { useToast } from "@/context/ToastContext";

// Utils
import { createClient } from "@/utils/supabase/client";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const supabase = createClient();
    const Toast = useToast();

    const isEmailValid = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!isEmailValid(email)) {
            setErrorMessage("Please enter a valid email address.");
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setErrorMessage("");
        const { error } = await supabase.auth.resetPasswordForEmail(email);

        setIsLoading(false);

        if (error) {
            Toast.showToast(`Error sending email: ${error.message}`, "error");
        } else {
            Toast.showToast("Reset email sent successfully! Check your inbox.", "success");
            handleReset(e);
            setTimeout(() => {
                window.location.href = "/signin";
            }, 2500);
        }
    }

    const handleReset = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setEmail("");
        setErrorMessage("");
    }

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.titles}>
                    <h1>Forgot password</h1>
                    <p>Fil the form and, check your email and follow the instructions to reset your account.</p>
                </div>
                <form
                    className={styles.form}
                    onSubmit={handleSubmit}
                    onReset={handleReset}
                >
                    <div className={styles.inputGroup}>
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setErrorMessage("");
                            }}
                            placeholder="johndoe@example.com"
                            required
                        />
                    </div>
                    {errorMessage && (
                        <div className={styles.errorMessage}>
                            {errorMessage}
                        </div>
                    )}
                    <div className={styles.buttons}>
                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={isLoading}
                        >
                            {isLoading ? "Sending mail..." : "Send mail"}
                        </button>
                        <button
                            type="reset"
                            className={styles.resetButton}
                        >
                            <Trash2 />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}