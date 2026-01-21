// Styles
import styles from "./Footer.module.css";

// Components
import Image from "next/image";

// Icons
import GithubIcon from "../../../../public/icons/GitHub.png";
import LinkedInIcon from "../../../../public/icons/LinkedIn.png";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.titles}>
          <h1>Binge Quest</h1>
          <h4>by Santino Ventrice 2026</h4>
        </div>
        <nav>
          <ul>
            <h4>Pages</h4>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/about">About</a>
            </li>
            <li>
              <a href="/profile">My Profile</a>
            </li>
          </ul>
          <ul>
            <h4>Games</h4>
            <li>
              <a href="/games/trivia-game">Trivia Game</a>
            </li>
            <li>
              <a href="/games/find-the-impostor">Find the Impostor</a>
            </li>
            <li>
              <a href="/games/guess-the-film">Guess The Film</a>
            </li>
          </ul>
          <ul>
            <h4>Socials</h4>
            <li>
              <a href="https://github.com/SantiVentri" target="_blank">
                <Image src={GithubIcon} height={24} width={24} alt="Github Icon" />
                GitHub
              </a>
            </li>
            <li>
              <a href="https://linkedin.com/in/santinoventrice" target="_blank">
                <Image src={LinkedInIcon} height={24} width={24} alt="Github Icon" />
                LinkedIn
              </a>
            </li>
          </ul>
        </nav>
        <h1 className={styles.bgTitle}>BINGE QUEST</h1>
      </div>
    </footer>
  );
}
