// Styles
import Link from "next/link";
import styles from "./levels.module.css";

// Components
import Image from "next/image"

export default function TriviaLevelsPage() {
    const image = "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExaWVubm5tdW5mNTFsbnB3OTRoYjhnMnA5cWJwc2MyYW1tcW54eTV6byZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/6uGhT1O4sxpi8/giphy.gif"
    return (
        <main>
            <div className={styles.container}>
                <Image
                    src={image}
                    height={200}
                    width={350}
                    alt="Placeholder image"
                    draggable={false}
                />
                <div className={styles.titles}>
                    <h1 className={styles.message}>Oops! There's nothing here.</h1>
                    <p>Levels for all games are coming soon in later versions!</p>
                </div>
                <Link href={"/"}>
                    See other games
                </Link>
            </div>
        </main>
    )
}