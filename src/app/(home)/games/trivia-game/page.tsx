"use client"

// Styles
import styles from "./trivia-game.module.css";

// Hooks
import { useEffect, useState } from "react"

// Helpers
import { fetchTodaysTrivia } from "@/helpers/trivia-game"

// Types
import { TriviaQuestion } from "@/types"

// Components
import EmptyListComponent from "@/components/ui/EmptyListComponent/EmptyListComponent"
import Banner from "@/components/ui/games/Banner/Banner";
import { QuestionImage } from "@/components/ui/games/QuestionImage/QuestionImage";

export default function TriviaGamePage() {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const [todaysTrivia, setTodaysTrivia] = useState<TriviaQuestion | null>(null);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [showAnswer, setShowAnswer] = useState(false);

    const handleSelection = (option: string) => {
        if (isLoading) return;
        setShowAnswer(false);
        setSelectedOption(option);
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!selectedOption) return;
        setIsLoading(true);
        setShowAnswer(true);
        if (selectedOption === todaysTrivia?.answer) {
            alert("Correct answer!");
        } else {
            alert(`Wrong answer! The correct answer was: ${todaysTrivia?.answer}`);
        }
        setSelectedOption(null);
        setIsLoading(false);
    }

    useEffect(() => {
        const loadTrivia = async () => {
            try {
                const trivia = await fetchTodaysTrivia()
                setTodaysTrivia(trivia || null)
            } catch {
                setError(true)
            } finally {
                setIsLoading(false)
            }
        }
        loadTrivia()
    }, []);

    if (error) return <p>There was an error loading today's trivia.</p>

    return (
        <main>
            {todaysTrivia ? (
                <div className={styles.container}>
                    {todaysTrivia.banner && (
                        <Banner image={todaysTrivia.banner} alt="Today's trivia's banner" />
                    )}
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <QuestionImage image={todaysTrivia.image} alt="Today's trivia question image" />
                        <h1 className={styles.question}>{todaysTrivia.title}</h1>
                        <div className={styles.optionsContainer}>
                            {todaysTrivia.options.map((option, index) => (
                                <label
                                    key={index}
                                    className={`${styles.optionButton} ${selectedOption === option ? styles.selected : ""} ${showAnswer ? option === todaysTrivia.answer ? styles.correct : styles.incorrect : ""} ${isLoading ? styles.disabled : ""}`}
                                >
                                    <input
                                        type="radio"
                                        name="triviaOption"
                                        value={option}
                                        checked={selectedOption === option}
                                        onChange={() => handleSelection(option)}
                                        disabled={isLoading}
                                        hidden
                                    />
                                    {option}
                                    {selectedOption === option && (
                                        <span>selected</span>
                                    )}
                                </label>
                            ))}
                        </div>
                        <div className={styles.buttons}>
                            <button type="submit" className={styles.submitButton} disabled={isLoading || !selectedOption}>
                                {isLoading ? "Submitting..." : "Submit Answer"}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <EmptyListComponent />
            )}
        </main>
    )
}
