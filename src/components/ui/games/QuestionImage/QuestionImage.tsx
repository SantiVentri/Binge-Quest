// Styles
import styles from "./QuestionImage.module.css";

// Components
import Image from "next/image";

// Interface
interface QuestionImageProps {
    image: string;
    alt?: string;
}

export default function QuestionImage({ image, alt }: QuestionImageProps) {
    return (
        <Image
            className={styles.image}
            src={image}
            height={280}
            width={550}
            alt={alt as string | "Question Image"}
            draggable={false}
        />
    )
}