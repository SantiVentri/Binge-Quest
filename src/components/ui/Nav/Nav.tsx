"use client";

// Styles
import styles from "./Nav.module.css";

// Context
import { useUser } from "@/context/AuthContext";

export default function Nav() {
  const User = useUser();
  return (
    <header className={styles.nav}>
      <a href="/">
        <h1>Binge Quest</h1>
      </a>
      <nav>
        <ul>
          <li>
            <a href="https://github.com/SantiVentri/binge-quest" target="_blank">See repository</a>
          </li>
          <li>
            <a href="/profile">{User?.user_metadata.display_name || User?.email || "Profile"}</a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
