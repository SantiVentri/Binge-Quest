"use client"

// Styles
import styles from "./trivia-game.module.css";
import gameStyles from "../games.module.css";

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
import SuccessModal from "@/components/ui/games/SuccessModal/SuccessModal";
import FailureModal from "@/components/ui/games/FailureModal/FailureModal";
import HasPlayedModal from "@/components/ui/games/HasPlayedModal/HasPlayedModal";
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
            <Link href={"/games/levels/trivia-game"} className={gameStyles.levelsIcon}>
                <Grid2x2 size={25} color="white" />
            </Link>
            {todaysTrivia ? (
                <div className={gameStyles.container}>
                    {todaysTrivia.banner && (
                        <Banner image={todaysTrivia.banner} alt="Today's trivia's banner" />
                    )}
                    <form className={gameStyles.form} onSubmit={handleSubmit}>
                        <QuestionImage image={todaysTrivia.image} alt="Today's trivia question image" />
                        <h1>{todaysTrivia.title}</h1>
                        <div className={styles.optionsContainer}>
                            {todaysTrivia.options.map((option, index) => (
                                <label
                                    key={index}
                                    className={`${styles.optionButton} ${selectedOption === option ? gameStyles.selected : ""} ${showAnswer ? option === todaysTrivia.answer ? gameStyles.correct : gameStyles.incorrect : ""}`}
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
                        <div className={gameStyles.buttons}>
                            <button type="submit" className={gameStyles.submitButton} disabled={isLoading || !selectedOption}>
                                {isLoading ? "Submitting..." : "Submit Answer"}
                            </button>
                        </div>
                    </form>
                    {openHasPlayedModal && (
                        <HasPlayedModal gameSlug="trivia-game" />
                    )}
                    {openFeedbackModal && selectedOption === todaysTrivia.answer && (
                        <SuccessModal
                            onClose={() => {
                                setOpenFeedbackModal(false);
                                setSelectedOption(null);
                            }}
                        />
                    )}
                    {openFeedbackModal && selectedOption !== todaysTrivia.answer && (
                        <FailureModal
                            onClose={() => {
                                setOpenFeedbackModal(false);
                                setSelectedOption(null);
                            }}
                            correctAnswer={todaysTrivia.answer}
                        />
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
