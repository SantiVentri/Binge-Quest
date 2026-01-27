// Styles
import Link from "next/link";
import styles from "./page.module.css";

const games = [
  {
    title: "Trivia Game",
    image: "/images/games/trivia_game.png",
    slug: "trivia-game"
  },
  {
    title: "Guess The Film",
    image: "/images/games/guess_the_film.png",
    slug: "guess-the-film"
  },
  {
    title: "Find The Impostor",
    image: "/images/games/find_the_impostor.png",
    slug: "find-the-impostor"
  },
]

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <section className={styles.games}>
          <div className={styles.gameList}>
            {games.map((game) => (
              <Link
                key={game.title}
                className={styles.gameCard}
                href={`/games/${game.slug}`}
              >
                <img
                  className={styles.gameImage}
                  src={game.image}
                  alt={game.title}
                />
                <h2 className={styles.gameTitle}>{game.title}</h2>
              </Link>
            ))}
          </div>
          <div className={styles.comingSoon}>
            <h2>More games coming soon!</h2>
          </div>
        </section>
      </main>
    </div>
  );
}
