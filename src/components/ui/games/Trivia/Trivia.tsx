// Styles
import styles from "./Trivia.module.css";
import gameStyles from "@/app/(home)/games/[game]/game.module.css";

// Types
import { TriviaQuestion } from "@/types"

// Components
import Banner from "../Banner/Banner";
import QuestionImage from "../QuestionImage/QuestionImage";

interface TriviaGameProps {
    gameData: TriviaQuestion;
    selectedOption: string | null;
    showAnswer: boolean;
    isLoading: boolean;
    onSelectOption: (option: string) => void;
    onSubmit: (e: React.FormEvent) => void;
}

export default function TriviaGame({
    gameData,
    selectedOption,
    showAnswer,
    isLoading,
    onSelectOption,
    onSubmit
}: TriviaGameProps) {
    return (
        <div className={gameStyles.container}>
            {gameData.banner && (
                <Banner image={gameData.banner} alt="Today's trivia's banner" />
            )}
            <form className={gameStyles.form} onSubmit={onSubmit}>
                <QuestionImage image={gameData.image} alt="Today's trivia question image" />
                <h1>{gameData.title}</h1>
                <div className={styles.optionsContainer}>
                    {gameData.options.map((option, index) => (
                        <label
                            key={index}
                            className={`${styles.optionButton} ${selectedOption === option ? gameStyles.selected : ""} ${showAnswer ? option === gameData.answer ? gameStyles.correct : gameStyles.incorrect : ""}`}
                        >
                            <input
                                type="radio"
                                name="triviaOption"
                                value={option}
                                checked={selectedOption === option}
                                onChange={() => onSelectOption(option)}
                                disabled={isLoading || showAnswer}
                                hidden
                            />
                            {option}
                            {selectedOption === option && (
                                <span>selected</span>
                            )}
                        </label>
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