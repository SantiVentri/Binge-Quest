"use client";

// Styles
import styles from "./SignOutButton.module.css";

// Hooks
import { useRouter } from "next/navigation";
import { useState } from "react";

// Utils
import { createClient } from "@/utils/supabase/client";

export default function SignOutButton() {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      router.push("/signin");
    } catch (error) {
      alert("Error signing out: " + error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      className={styles.button}
      onClick={handleSignOut}
      disabled={isLoading}
    >
      {isLoading ? "Signing Out..." : "Sign Out"}
    </button>
  );
}
