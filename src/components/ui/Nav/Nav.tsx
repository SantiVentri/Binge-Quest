// Styles
import styles from "./Nav.module.css";

// Components
import SignOutButton from "../../auth/SignOutButton";

export default function Nav() {
  return (
    <header className={styles.nav}>
      <a href="/">
        <h1>MyApp</h1>
      </a>
      <nav>
        <ul>
          <li>
            <SignOutButton />
          </li>
        </ul>
      </nav>
    </header>
  );
}
