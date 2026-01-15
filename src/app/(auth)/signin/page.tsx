"use client";

// Styles
import styles from "../auth.module.css";

// Icons
import { Eye, EyeOff, Trash2 } from "lucide-react";

// Hooks
import { useState } from "react";

// Utils
import { createClient } from "@/utils/supabase/client";

// Components
import Link from "next/link";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const supabase = createClient();

  const handleShowPassword = (e: any) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsLoading(false);

    if (error) {
      setErrorMessage(error.message);
    } else {
      handleReset(e);
      window.location.href = "/";
    }
  };

  const handleReset = (e?: any) => {
    e.preventDefault();
    setEmail("");
    setPassword("");
    setErrorMessage("");
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
                setEmail(e.target.value), setErrorMessage("");
              }}
              placeholder="johndoe@example.com"
              required
            />
            <Link href="/forgot-password" style={{ marginTop: "8px" }}>
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
                  setPassword(e.target.value), setErrorMessage("");
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
          {errorMessage && (
            <div className={styles.errorMessage}>{errorMessage}</div>
          )}
          <div className={styles.buttons}>
            <button type="submit" className={styles.submitButton}>
              {isLoading ? "Accessing account..." : "Log in"}
            </button>
            <button type="reset" className={styles.resetButton}>
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
