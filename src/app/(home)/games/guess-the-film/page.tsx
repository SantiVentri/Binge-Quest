"use client"

// Styles
import styles from "./guess-the-film.module.css";

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
import Modal from "@/components/ui/Modal/Modal";
import Image from "next/image";
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

    // Supabase client and user
    const supabase = createClient();

    // Input Ref
    const inputRef = useRef<HTMLInputElement>(null);

    // Gifs
    const successGif = "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExcnE0azc0Y3V2bzBndjBhcDhqZ3ZhdGhrODQ3bzMwaWNha2JhNmxvNSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/JUXGVpncYAU8NJ6BWz/giphy.gif";
    const failureGif = "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExbzZ6MHU0YjNjeWg4c2l4aHNmcHJtaHBlY3h1aGQzcDNmY2k3MW15OCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/1BQdjXovIqSLS/giphy.gif";
    const hasPlayedGif = "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExc3NkdWVrM2d5aXNyczBveXUwMjVrcDk1OWk4NG55N3JzMTRoNmRkaSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/p7ESzgUi7li93Hxjte/giphy.gif";

    // Banner image
    const banner = "https://xscyhjniouateyibsogs.supabase.co/storage/v1/object/public/images/Banner.png";

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isLoading || showAnswer) return;
        setSelectedOption(e.target.value);
    }

    const handleContainerClick = () => {
        inputRef.current?.focus();
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
            <Link href={"/games/guess-the-film/levels"} className={styles.levelsIcon}>
                <Grid2x2 size={25} color="white" />
            </Link>
            {todaysGuessGame ? (
                <div className={styles.container}>
                    {banner && <Banner image={banner} alt="Guess The Film Banner" />}
                    <form className={styles.form} onSubmit={handleSubmit}>
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
                                                const isActive = charIndex === selectedOption.length && !showAnswer;
                                                charIndex++;
                                                return (
                                                    <div key={cIdx} className={`${styles.letterSlot} ${isActive ? styles.activeSlot : ""}`}>
                                                        {currentLetter}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    );
                                    // Space does not consume a character index
                                    return wordComponent;
                                })
                            })()}
                            <input
                                ref={inputRef}
                                type="text"
                                className={styles.hiddenInput}
                                value={selectedOption}
                                onChange={handleInputChange}
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
                                    unoptimized
                                    draggable={false}
                                />
                                <div className={styles.modalText}>
                                    <h2 className={styles.successTitle}>You've already played today's trivia!</h2>
                                    <p className={styles.modalMessage}>Come back tomorrow for a new question or checkout some of our other games in the home page!</p>
                                </div>
                                <div className={styles.buttons}>
                                    <Link href={"/games/guess-the-film/levels"} className={styles.button}>See all levels</Link>
                                    <Link href={"/"} className={styles.button} style={{ backgroundColor: "#0E0E0E" }}>See other games</Link>
                                </div>
                            </div>
                        </Modal>
                    )}
                    {openFeedbackModal && (
                        <Modal
                            onClose={() => {
                                setOpenFeedbackModal(false);
                                setSelectedOption("");
                            }}
                            className={selectedOption.toLowerCase().trim() === todaysGuessGame.answer.toLowerCase().replace(/\s/g, "") ? styles.modalSuccess : styles.modalFailure}
                        >
                            <div className={styles.modalContent}>
                                <Image
                                    src={selectedOption.toLowerCase().trim() === todaysGuessGame.answer.toLowerCase().replace(/\s/g, "") ? successGif : failureGif}
                                    alt={selectedOption.toLowerCase().trim() === todaysGuessGame.answer.toLowerCase().replace(/\s/g, "") ? "Success" : "Failure"}
                                    width={460}
                                    height={selectedOption.toLowerCase().trim() === todaysGuessGame.answer.toLowerCase().replace(/\s/g, "") ? 360 : 220}
                                    unoptimized
                                />
                                <div className={styles.modalText}>
                                    <h2 className={selectedOption.toLowerCase().trim() === todaysGuessGame.answer.toLowerCase().replace(/\s/g, "") ? styles.successTitle : styles.failureTitle}>
                                        {selectedOption.toLowerCase().trim() === todaysGuessGame.answer.toLowerCase().replace(/\s/g, "") ? "Blockbuster Performance!" : "Plot Twist! Almost had it!"}
                                    </h2>
                                    <p className={styles.modalMessage}>
                                        {selectedOption.toLowerCase().trim() === todaysGuessGame.answer.toLowerCase().replace(/\s/g, "")
                                            ? <>You nailed that scene! You're a true cinephile. <br /> Come back tomorrow for the sequel.</>
                                            : <>The correct answer was <strong>&quot;{todaysGuessGame.answer}&quot;</strong>. Don&apos;t worry, even the greats have off days. Catch you at the next screening!</>}
                                    </p>
                                </div>
                                <div className={styles.buttons}>
                                    <button
                                        className={styles.button}
                                        onClick={() => {
                                            setOpenFeedbackModal(false);
                                            setSelectedOption("");
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
