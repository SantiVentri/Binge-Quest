"use client";

// Styles
import styles from "../auth.module.css";

// Icons
import { Eye, EyeOff, Trash2 } from "lucide-react";

// Hooks
import { useState } from "react";

// Context
import { useToast } from "@/context/ToastContext";

// Utils
import { createClient } from "@/utils/supabase/client";

// Components
import Link from "next/link";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const supabase = createClient();
  const Toast = useToast();

  const handleShowPassword = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsLoading(false);

    if (error) {
      Toast.showToast(`Error signing in: ${error.message}`, "error");
    } else {
      handleReset(e);
      Toast.showToast("Signed in successfully!", "success");
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    }
  };

  const handleReset = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmail("");
    setPassword("");
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.titles}>
          <h1>Welcome Back!</h1>
          <p>Log into your account to start your adventure!</p>
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
              }}
              placeholder="johndoe@example.com"
              required
            />
            <Link href="/forgot-password" style={{ marginTop: "8px", }}>
              Forgot password?
            </Link>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Password:</label>
            <div className={styles.passwordContainer}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                placeholder={showPassword ? "john123" : "*******"}
                required
              />
              <button
                type="button"
                className={styles.eyeButton}
                onClick={handleShowPassword}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>
          <div className={styles.buttons}>
            <button type="submit" className={styles.submitButton} disabled={isLoading}>
              {isLoading ? "Accessing account..." : "Log in"}
            </button>
            <button type="reset" className={styles.resetButton} disabled={isLoading}>
              <Trash2 />
            </button>
          </div>
        </form>
        <p className={styles.link}>
          Don't have an account? <Link href="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
