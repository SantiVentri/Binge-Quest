// Styles
import styles from "./GuessTheFilm.module.css";
import gameStyles from "@/app/(home)/games/[game]/game.module.css";

// Hooks
import { useRef, useState } from "react";

// Types
import { GuessGame } from "@/types";

// Components
import Banner from "../Banner/Banner";
import QuestionImage from "../QuestionImage/QuestionImage";

// Icons
import { Delete } from "lucide-react";

interface GuessTheFilmGameProps {
    gameData: GuessGame;
    selectedOption: string;
    showAnswer: boolean;
    isLoading: boolean;
    onInputChange: (value: string) => void;
    onSubmit: (e: React.FormEvent) => void;
}

export default function GuessTheFilmGame({
    gameData,
    selectedOption,
    showAnswer,
    isLoading,
    onInputChange,
    onSubmit
}: GuessTheFilmGameProps) {
    // Input focus state
    const [isFocused, setIsFocused] = useState(false);

    // Input Ref
    const inputRef = useRef<HTMLInputElement>(null);

    // Banner image
    const banner = "https://xscyhjniouateyibsogs.supabase.co/storage/v1/object/public/images/Banner.png";

    const handleContainerClick = () => {
        inputRef.current?.focus();
    };

    const handleInputFocus = () => {
        setIsFocused(true);
    };

    const handleInputBlur = () => {
        setIsFocused(false);
    };

    const handleKeyClick = (key: string) => {
        if (isLoading || showAnswer) return;

        if (key === "Backspace") {
            onInputChange(selectedOption.slice(0, -1));
        } else {
            const maxLength = gameData.answer.replace(/\s/g, "").length || 0;
            if (selectedOption.length < maxLength) {
                onInputChange(selectedOption + key);
            }
        }
        inputRef.current?.focus();
    };

    const keyboardRows = [
        ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
        ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
        ["Z", "X", "C", "V", "B", "N", "M", "Backspace"]
    ];

    return (
        <div className={gameStyles.container}>
            {banner && <Banner image={banner} alt="Guess The Film Banner" />}
            <form className={gameStyles.form} onSubmit={onSubmit}>
                <QuestionImage image={gameData.image} alt="Today's guess the film image" />
                <h1>Guess The Film</h1>

                <div className={styles.inputContainer} onClick={handleContainerClick}>
                    {(() => {
                        let charIndex = 0;
                        return gameData.answer.split(" ").map((word, wIdx) => {
                            const wordComponent = (
                                <div key={wIdx} className={styles.word}>
                                    {word.split("").map((char, cIdx) => {
                                        const currentLetter = selectedOption[charIndex] || "";
                                        const isActive = charIndex === selectedOption.length && isFocused;
                                        charIndex++;
                                        return (
                                            <div key={cIdx} className={`${styles.letterSlot} ${isActive ? styles.activeSlot : ""}`}>
                                                {currentLetter}
                                            </div>
                                        )
                                    })}
                                </div>
                            );
                            return wordComponent;
                        })
                    })()}
                    <input
                        ref={inputRef}
                        type="text"
                        className={styles.hiddenInput}
                        value={selectedOption}
                        onChange={(e) => onInputChange(e.target.value)}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        maxLength={gameData.answer.replace(/\s/g, "").length}
                        autoComplete="off"
                    />
                </div>

                <div className={styles.keyboardContainer}>
                    {keyboardRows.map((row, rIdx) => (
                        <div key={rIdx} className={styles.keyboardRow}>
                            {row.map((key) => (
                                <button
                                    key={key}
                                    type="button"
                                    className={`${styles.keyboardKey} ${key === "Backspace" ? styles.specialKey : ""}`}
                                    onClick={() => handleKeyClick(key)}
                                >
                                    {key === "Backspace" ? <Delete size={20} color="black" /> : key}
                                </button>
                            ))}
                        </div>
                    ))}
                </div>

                <div className={gameStyles.buttons}>
                    <button type="submit" className={gameStyles.submitButton} disabled={isLoading || !selectedOption}>
                        {isLoading ? "Submitting..." : "Submit Answer"}
                    </button>
                </div>
            </form>
        </div>
    );
}
