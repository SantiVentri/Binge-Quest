import Image from "next/image";
import styles from "./Banner.module.css";

interface BannerProps {
    image: string;
    alt?: string;
    noGradient?: boolean;
}

export default function Banner({ image, alt, noGradient }: BannerProps) {
    return (
        <div className={styles.container}>
            <Image
                src={image}
                className={styles.banner}
                width={1920}
                height={250}
                alt={alt as string ?? "Game Banner"}
                draggable={false}
                priority
            />
            {!noGradient && <div className={styles.gradient} />}
        </div>
    )
}
