"use client";

import { createClient } from "@/utils/supabase/client";
// Styles
import styles from "../auth.module.css";

// Icons
import { Eye, EyeOff, Trash2 } from "lucide-react";

// Hooks
import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const supabase = createClient();

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage("");
        const { error } = await supabase.auth.resetPasswordForEmail(email);

        setIsLoading(false);

        if (error) {
            setErrorMessage(error.message);
        } else {
            handleReset(e);
            window.location.href = "/signin";
        }
    }

    const handleReset = (e?: any) => {
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
                                setEmail(e.target.value),
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