"use client"

// Styles
import styles from "./find-the-impostor.module.css";
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
import { ImpostorGame } from "@/types"

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
    const [todaysImpostor, setTodaysImpostor] = useState<ImpostorGame | null>(null);
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
                game: "find_the_impostor",
                game_date: new Date().toISOString(),
                is_correct: selectedOption === todaysImpostor?.answer
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

    const loadImpostorGame = async () => {
        try {
            const impostorGame = await fetchTodaysGame({ game: "find_the_impostor" });
            setTodaysImpostor(impostorGame || null)
        } catch {
            setError(true)
        } finally {
            setIsLoading(false)
        }
    }

    const checkPlayed = async () => {
        const played = await hasPlayedToday({ game: "find_the_impostor" });
        if (played) {
            setOpenHasPlayedModal(true);
            setShowAnswer(true);
        }
    };

    useEffect(() => {
        loadImpostorGame();
        checkPlayed();
    }, []);

    if (error) return <p>There was an error loading today's find the impostor game.</p>

    return (
        <main>
            <Link href={"/games/find-the-impostor/levels"} className={gameStyles.levelsIcon}>
                <Grid2x2 size={25} color="white" />
            </Link>
            {todaysImpostor ? (
                <div className={gameStyles.container}>
                    {todaysImpostor.banner && (
                        <Banner image={todaysImpostor.banner} alt="Today's find the impostor banner" />
                    )}
                    <form className={gameStyles.form} onSubmit={handleSubmit}>
                        <QuestionImage image={todaysImpostor.image} alt="Today's find the impostor image" />
                        <h1>Find the impostor: {todaysImpostor.title}</h1>
                        <div className={styles.optionsContainer}>
                            {todaysImpostor.options.map((option, index) => (
                                <label
                                    key={index}
                                    className={`${styles.optionButton} ${selectedOption === option ? gameStyles.selected : ""} ${showAnswer ? option === todaysImpostor.answer ? gameStyles.correct : gameStyles.incorrect : ""}`}
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
                        <HasPlayedModal gameSlug="find-the-impostor" />
                    )}
                    {openFeedbackModal && selectedOption === todaysImpostor.answer && (
                        <SuccessModal
                            onClose={() => {
                                setOpenFeedbackModal(false);
                                setSelectedOption(null);
                            }}
                        />
                    )}
                    {openFeedbackModal && selectedOption !== todaysImpostor.answer && (
                        <FailureModal
                            onClose={() => {
                                setOpenFeedbackModal(false);
                                setSelectedOption(null);
                            }}
                            correctAnswer={todaysImpostor.answer}
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
