"use client";

// Styles
import styles from "../auth.module.css";

// Icons
import { Eye, EyeOff, Trash2 } from "lucide-react";

// Hooks
import { useState } from "react";
import { useRouter } from "next/navigation";

// Utils
import { createClient } from "@/utils/supabase/client";

// Components
import Link from "next/link";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const supabase = createClient();
  const router = useRouter();

  const isEmailValid = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isPasswordValid = (password: string) => {
    // At least 8 characters, one uppercase letter, one lowercase letter, one number and one special character
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[+=-@$!%*?&#])[A-Za-z\d+=-@$!%*?&#]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleShowPassword = (e: any) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    if (!isEmailValid(email)) {
      setErrorMessage("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }

    if (!isPasswordValid(password)) {
      setErrorMessage(
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
      );
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: username,
          },
        },
      });

      router.push("/signin");
    } catch (error) {
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = (e?: any) => {
    e.preventDefault();
    setUsername("");
    setEmail("");
    setPassword("");
    setErrorMessage("");
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.titles}>
          <h1>Welcome to my App</h1>
          <p>Create an account to start your adventure!</p>
        </div>
        <form
          className={styles.form}
          onSubmit={handleSubmit}
          onReset={handleReset}
        >
          <div className={styles.inputGroup}>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value), setErrorMessage("");
              }}
              placeholder="JohnDoe"
              required
            />
          </div>
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
              {isLoading ? "Creating account..." : "Register"}
            </button>
            <button type="reset" className={styles.resetButton}>
              <Trash2 />
            </button>
          </div>
        </form>
        <p className={styles.link}>
          Already have an account? <Link href="/signin">Log in</Link>
        </p>
      </div>
    </div>
  );
}
