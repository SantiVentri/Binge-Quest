import Image from "next/image";
import styles from "./Banner.module.css";

interface BannerProps {
    image: string;
    alt?: string;
}

export default function Banner({ image, alt }: BannerProps) {
    return (
        <div className={styles.container}>
            <Image
                src={image}
                className={styles.banner}
                width={1920}
                height={250}
                alt={alt as string | "Game Banner"}
                draggable={false}
                priority
            />
            <div className={styles.gradient} />
        </div>
    )
}
