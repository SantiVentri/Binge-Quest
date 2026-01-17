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
import QuestionImage from "@/components/ui/games/QuestionImage/QuestionImage";
import Modal from "@/components/ui/Modal/Modal";
import Image from "next/image";

export default function TriviaGamePage() {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const [todaysTrivia, setTodaysTrivia] = useState<TriviaQuestion | null>(null);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [showAnswer, setShowAnswer] = useState(false);
    const [openModal, setOpenModal] = useState(false);

    // Gifs
    const successGif = "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExcnE0azc0Y3V2bzBndjBhcDhqZ3ZhdGhrODQ3bzMwaWNha2JhNmxvNSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/JUXGVpncYAU8NJ6BWz/giphy.gif";
    const failureGif = "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExbzZ6MHU0YjNjeWg4c2l4aHNmcHJtaHBlY3h1aGQzcDNmY2k3MW15OCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/1BQdjXovIqSLS/giphy.gif";

    const handleSelection = (option: string) => {
        if (isLoading) return;
        if (showAnswer) return;
        setShowAnswer(false);
        setSelectedOption(option);
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!selectedOption) return;
        setIsLoading(true);
        setShowAnswer(true);
        setOpenModal(true);
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
                                    className={`${styles.optionButton} ${selectedOption === option ? styles.selected : ""} ${showAnswer ? option === todaysTrivia.answer ? styles.correct : styles.incorrect : ""}`}
                                >
                                    <input
                                        type="radio"
                                        name="triviaOption"
                                        value={option}
                                        checked={selectedOption === option}
                                        onChange={() => handleSelection(option)}
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
                        <div className={styles.buttons}>
                            <button type="submit" className={styles.submitButton} disabled={isLoading || !selectedOption}>
                                {isLoading ? "Submitting..." : "Submit Answer"}
                            </button>
                        </div>
                    </form>
                    {openModal && (
                        <Modal
                            onClose={() => {
                                setOpenModal(false);
                                setSelectedOption(null);
                            }}
                            className={selectedOption === todaysTrivia.answer ? styles.modalSuccess : styles.modalFailure}
                        >
                            <div className={styles.modalContent}>
                                <Image
                                    src={selectedOption === todaysTrivia.answer ? successGif : failureGif}
                                    alt={selectedOption === todaysTrivia.answer ? "Success" : "Failure"}
                                    width={460}
                                    height={320}
                                />
                                <div className={styles.modalText}>
                                    <h2 className={selectedOption === todaysTrivia.answer ? styles.successTitle : styles.failureTitle}>
                                        {selectedOption === todaysTrivia.answer ? "Blockbuster Performance!" : "Plot Twist! Almost had it!"}
                                    </h2>
                                    <p className={styles.modalMessage}>
                                        {selectedOption === todaysTrivia.answer
                                            ? <>You nailed that scene! You're a true cinephile. <br /> Come back tomorrow for the sequel.</>
                                            : <>The correct answer was <strong>&quot;{todaysTrivia.answer}&quot;</strong>. Don&apos;t worry, even the greats have off days. Catch you at the next screening!</>}
                                    </p>
                                </div>
                                <button
                                    onClick={() => {
                                        setOpenModal(false);
                                        setSelectedOption(null);
                                    }}
                                >
                                    Close
                                </button>
                            </div>
                        </Modal>
                    )}
                </div>
            ) : (
                <EmptyListComponent />
            )}
        </main>
    )
}
