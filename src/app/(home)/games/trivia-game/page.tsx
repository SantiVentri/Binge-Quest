"use client"

// Styles
import styles from "./trivia-game.module.css";

// Hooks
import { useEffect, useState } from "react"

// Helpers
import { fetchTodaysGame } from "@/helpers/games";
import { submitGame } from "@/helpers/games";
import { hasPlayedToday } from "@/helpers/user";

// Utils
import { createClient } from "@/utils/supabase/client";

// Types
import { TriviaQuestion } from "@/types"

// Components
import EmptyListComponent from "@/components/ui/EmptyListComponent/EmptyListComponent"
import Banner from "@/components/ui/games/Banner/Banner";
import QuestionImage from "@/components/ui/games/QuestionImage/QuestionImage";
import Modal from "@/components/ui/Modal/Modal";
import Image from "next/image";
import Link from "next/link";

// Icons
import { Grid2x2 } from "lucide-react";

export default function TriviaGamePage() {
    // Loading and error states
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    // Game states
    const [todaysTrivia, setTodaysTrivia] = useState<TriviaQuestion | null>(null);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [showAnswer, setShowAnswer] = useState(false);

    // Modals
    const [openFeedbackModal, setOpenFeedbackModal] = useState(false);
    const [openHasPlayedModal, setOpenHasPlayedModal] = useState(false);

    // Supabase client and user
    const supabase = createClient();
    const user = supabase.auth.getUser();

    // Gifs
    const successGif = "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExcnE0azc0Y3V2bzBndjBhcDhqZ3ZhdGhrODQ3bzMwaWNha2JhNmxvNSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/JUXGVpncYAU8NJ6BWz/giphy.gif";
    const failureGif = "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExbzZ6MHU0YjNjeWg4c2l4aHNmcHJtaHBlY3h1aGQzcDNmY2k3MW15OCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/1BQdjXovIqSLS/giphy.gif";
    const hasPlayedGif = "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExc3NkdWVrM2d5aXNyczBveXUwMjVrcDk1OWk4NG55N3JzMTRoNmRkaSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/p7ESzgUi7li93Hxjte/giphy.gif";

    const handleSelection = (option: string) => {
        if (isLoading) return;
        if (showAnswer) return;
        setSelectedOption(option);
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!selectedOption) return;
        setIsLoading(true);
        try {
            const userData = (await user).data.user;
            if (!userData) throw new Error("User not authenticated");

            await submitGame({
                user_id: userData.id,
                game: "trivia_game",
                game_date: new Date().toISOString(),
                is_correct: selectedOption === todaysTrivia?.answer
            });
            setShowAnswer(true);
        } catch {
            alert("There was an error submitting your answer. Please try again.");
        } finally {
            setOpenFeedbackModal(true);
            checkPlayed();
            setIsLoading(false);
        }
    }

    const loadTrivia = async () => {
        try {
            const trivia = await fetchTodaysGame({ game: "trivia_game" });
            setTodaysTrivia(trivia || null)
        } catch {
            setError(true)
        } finally {
            setIsLoading(false)
        }
    }

    const checkPlayed = async () => {
        const played = await hasPlayedToday({ game: "trivia_game" });
        if (played) {
            setOpenHasPlayedModal(true);
            setShowAnswer(true);
        }
    };

    useEffect(() => {
        loadTrivia();
        checkPlayed();
    }, []);

    if (error) return <p>There was an error loading today's trivia.</p>

    return (
        <main>
            <Link href={"/games/trivia-game/levels"} className={styles.levelsIcon}>
                <Grid2x2 size={25} color="white" />
            </Link>
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
                    {openHasPlayedModal && (
                        <Modal
                            onClose={() => { }}
                            className={styles.hasPlayedModal}
                        >
                            <div className={styles.modalContent}>
                                <Image
                                    src={hasPlayedGif}
                                    width={460}
                                    height={250}
                                    alt={"Has Played Today Modal GIF"}
                                    draggable={false}
                                    unoptimized
                                />
                                <div className={styles.modalText}>
                                    <h2 className={styles.successTitle}>You've already played today's trivia!</h2>
                                    <p className={styles.modalMessage}>Come back tomorrow for a new question or checkout some of our other games in the home page!</p>
                                </div>
                                <div className={styles.buttons}>
                                    <Link href={"/games/trivia-game/levels"} className={styles.button}>
                                        See all levels
                                    </Link>
                                    <Link href={"/"} className={styles.button} style={{ backgroundColor: "#0E0E0E" }}>
                                        See other games
                                    </Link>
                                </div>
                            </div>
                        </Modal>
                    )}
                    {openFeedbackModal && (
                        <Modal
                            onClose={() => {
                                setOpenFeedbackModal(false);
                                setSelectedOption(null);
                            }}
                            className={selectedOption === todaysTrivia.answer ? styles.modalSuccess : styles.modalFailure}
                        >
                            <div className={styles.modalContent}>
                                <Image
                                    src={selectedOption === todaysTrivia.answer ? successGif : failureGif}
                                    alt={selectedOption === todaysTrivia.answer ? "Success" : "Failure"}
                                    height={selectedOption === todaysTrivia.answer ? 360 : 220}
                                    width={460}
                                    unoptimized
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
                                <div className={styles.buttons}>
                                    <button
                                        className={styles.button}
                                        onClick={() => {
                                            setOpenFeedbackModal(false);
                                            setSelectedOption(null);
                                        }}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </Modal>
                    )}
                </div>
            ) : (
                !isLoading && (
                    <EmptyListComponent />
                )
            )}
        </main>
    )
}
