"use client"

// Styles
import styles from "./guess-the-film.module.css";
import gameStyles from "../games.module.css";

// Hooks
import { useEffect, useState, useRef } from "react"

// Helpers
import { fetchTodaysGame } from "@/helpers/games";
import { submitGame } from "@/helpers/games";
import { hasPlayedToday } from "@/helpers/user";

// Utils
import { createClient } from "@/utils/supabase/client";

// Types
import { GuessGame } from "@/types"

// Components
import EmptyListComponent from "@/components/ui/EmptyListComponent/EmptyListComponent"
import Banner from "@/components/ui/games/Banner/Banner";
import QuestionImage from "@/components/ui/games/QuestionImage/QuestionImage";
import SuccessModal from "@/components/ui/games/SuccessModal/SuccessModal";
import FailureModal from "@/components/ui/games/FailureModal/FailureModal";
import HasPlayedModal from "@/components/ui/games/HasPlayedModal/HasPlayedModal";
import Link from "next/link";

// Icons
import { Grid2x2, Delete } from "lucide-react";

export default function GuessTheFilmPage() {
    // Loading and error states
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    // Game states
    const [todaysGuessGame, setTodaysGuessGame] = useState<GuessGame | null>(null);
    const [selectedOption, setSelectedOption] = useState<string>("");
    const [showAnswer, setShowAnswer] = useState(false);

    // Modals
    const [openFeedbackModal, setOpenFeedbackModal] = useState(false);
    const [openHasPlayedModal, setOpenHasPlayedModal] = useState(false);

    // Input focus state
    const [isFocused, setIsFocused] = useState(false);

    // Supabase client and user
    const supabase = createClient();

    // Input Ref
    const inputRef = useRef<HTMLInputElement>(null);


    // Banner image
    const banner = "https://xscyhjniouateyibsogs.supabase.co/storage/v1/object/public/images/Banner.png";

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isLoading || showAnswer) return;
        setSelectedOption(e.target.value);
    }

    const handleContainerClick = () => {
        inputRef.current?.focus();
    }

    const handleInputFocus = () => {
        setIsFocused(true);
    }

    const handleInputBlur = () => {
        setIsFocused(false);
    }

    const handleKeyClick = (key: string) => {
        if (isLoading || showAnswer) return;

        if (key === "Backspace") {
            setSelectedOption(prev => prev.slice(0, -1));
        } else {
            const maxLength = todaysGuessGame?.answer.replace(/\s/g, "").length || 0;
            if (selectedOption.length < maxLength) {
                setSelectedOption(prev => prev + key);
            }
        }
        inputRef.current?.focus();
    };

    const keyboardRows = [
        ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
        ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
        ["Z", "X", "C", "V", "B", "N", "M", "Backspace"]
    ];

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!selectedOption) return;
        setIsLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("User not authenticated");

            const isCorrect = selectedOption.toLowerCase().trim() === todaysGuessGame?.answer.toLowerCase().replace(/\s/g, "");

            await submitGame({
                user_id: user.id,
                game: "guess_the_film",
                game_date: new Date().toISOString(),
                is_correct: isCorrect
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

    const loadGuessGame = async () => {
        try {
            const trivia = await fetchTodaysGame({ game: "guess_the_film" });
            setTodaysGuessGame(trivia || null)
        } catch {
            setError(true)
        } finally {
            setIsLoading(false)
        }
    }

    const checkPlayed = async () => {
        const played = await hasPlayedToday({ game: "guess_the_film" });
        if (played) {
            setOpenHasPlayedModal(true);
            setShowAnswer(true);
        }
    };

    useEffect(() => {
        loadGuessGame();
        checkPlayed();
    }, []);

    if (error) return <p>There was an error loading today's game.</p>

    return (
        <main>
            <Link href={"/games/levels/guess-the-film"} className={gameStyles.levelsIcon}>
                <Grid2x2 size={25} color="white" />
            </Link>
            {todaysGuessGame ? (
                <div className={gameStyles.container}>
                    {banner && <Banner image={banner} alt="Guess The Film Banner" />}
                    <form className={gameStyles.form} onSubmit={handleSubmit}>
                        <QuestionImage image={todaysGuessGame.image} alt="Today's trivia question image" />
                        <h1>Guess The Film</h1>

                        <div className={styles.inputContainer} onClick={handleContainerClick}>
                            {(() => {
                                let charIndex = 0;
                                return todaysGuessGame.answer.split(" ").map((word, wIdx) => {
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
                                onChange={handleInputChange}
                                onFocus={handleInputFocus}
                                onBlur={handleInputBlur}
                                maxLength={todaysGuessGame.answer.replace(/\s/g, "").length}
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
                    {openHasPlayedModal && (
                        <HasPlayedModal gameSlug="guess-the-film" />
                    )}
                    {openFeedbackModal && selectedOption.toLowerCase().trim() === todaysGuessGame.answer.toLowerCase().replace(/\s/g, "") && (
                        <SuccessModal
                            onClose={() => {
                                setOpenFeedbackModal(false);
                                setSelectedOption("");
                            }}
                        />
                    )}
                    {openFeedbackModal && selectedOption.toLowerCase().trim() !== todaysGuessGame.answer.toLowerCase().replace(/\s/g, "") && (
                        <FailureModal
                            onClose={() => {
                                setOpenFeedbackModal(false);
                                setSelectedOption("");
                            }}
                            correctAnswer={todaysGuessGame.answer}
                        />
                    )}
                </div >
            ) : (
                !isLoading && (
                    <EmptyListComponent />
                )
            )}
        </main>
    )
}
