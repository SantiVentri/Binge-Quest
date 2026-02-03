// Styles
import Image from "next/image";
import styles from "./EmptyListComponent.module.css";

export default function EmptyListComponent() {
    const image = "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExaWVubm5tdW5mNTFsbnB3OTRoYjhnMnA5cWJwc2MyYW1tcW54eTV6byZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/6uGhT1O4sxpi8/giphy.gif"
    return (
        <div className={styles.container}>
            <Image
                src={image}
                height={200}
                width={350}
                alt="Placeholder image"
                draggable={false}
            />
            <div className={styles.titles}>
                <h1 className={styles.message}>Plot Twist: There's nothing here.</h1>
                <p>We searched the entire set, but we couldn't find any games right now.</p>
            </div>
        </div>
    )
}