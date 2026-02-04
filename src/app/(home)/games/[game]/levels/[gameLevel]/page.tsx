"use client"

// Styles
import styles from "./gameLevel.module.css";

// Hooks
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

// Icons
import { Grid2x2 } from "lucide-react";

// Helpers
import { fetchGameByDate } from "@/helpers/games";
import { submitGame } from "@/helpers/games";
import { hasPlayedGame } from "@/helpers/games";

// Utils
import { createClient } from "@/utils/supabase/client";

// Types
import { TriviaQuestion, ImpostorGame, GuessGame } from "@/types";

// Components
import EmptyListComponent from "@/components/ui/EmptyListComponent/EmptyListComponent";
import TriviaGame from "@/components/ui/games/Trivia/Trivia";
import FindTheImpostorGame from "@/components/ui/games/FindTheImpostor/FindTheImpostor";
import GuessTheFilmGame from "@/components/ui/games/GuessTheFilm/GuessTheFilm";
import SuccessModal from "@/components/ui/games/SuccessModal/SuccessModal";
import FailureModal from "@/components/ui/games/FailureModal/FailureModal";
import HasPlayedModal from "@/components/ui/games/HasPlayedModal/HasPlayedModal";
import { useToast } from "@/context/ToastContext";

export default function GamePage({ params }: { params: Promise<{ game: string; gameLevel: string }> }) {
    // Extract Params
    const [game, setGame] = useState<string | null>(null);
    const [gameLevel, setGameLevel] = useState<string | null>(null);
    const games = ["trivia-game", "find-the-impostor", "guess-the-film"];

    // Loading and error states
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    // Game states
    const [gameData, setGameData] = useState<TriviaQuestion | ImpostorGame | GuessGame | null>(null);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [showAnswer, setShowAnswer] = useState(false);

    // Modals
    const [openFeedbackModal, setOpenFeedbackModal] = useState(false);
    const [openHasPlayedModal, setOpenHasPlayedModal] = useState(false);

    // Supabase client
    const supabase = createClient();

    // Toast
    const Toast = useToast();

    // Get today's date in YYYY-MM-DD format (local)
    const today = new Date().toLocaleDateString("en-CA");


    useEffect(() => {
        params.then(({ game: gameParam, gameLevel: levelParam }) => {
            setGame(gameParam);
            setGameLevel(levelParam);
        });
    }, [params]);

    // Validate Game and Level
    if (game && (game.trim() === "" || games.indexOf(game) === -1)) {
        return notFound();
    }

    if (gameLevel && (gameLevel.trim() === "")) {
        return notFound();
    }

    if (gameLevel && gameLevel > today) {
        return notFound();
    }

    const dbGameName = game?.replace(/-/g, "_") as "trivia_game" | "find_the_impostor" | "guess_the_film";

    const handleSelection = (option: string) => {
        if (isLoading) return;
        if (showAnswer) return;
        setSelectedOption(option);
    };

    const handleInputChange = (value: string) => {
        if (isLoading || showAnswer) return;
        setSelectedOption(value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedOption || !game) return;
        setIsLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("User not authenticated");

            let isCorrect = false;

            if (game === "guess-the-film" && gameData) {
                const guessGame = gameData as GuessGame;
                isCorrect = selectedOption.toLowerCase().trim() === guessGame.answer.toLowerCase().replace(/\s/g, "");
            } else if (gameData) {
                const triviaOrImpostor = gameData as TriviaQuestion | ImpostorGame;
                isCorrect = selectedOption === triviaOrImpostor.answer;
            }

            await submitGame({
                user_id: user.id,
                game: dbGameName,
                game_date: gameData?.release_at as string,
                is_correct: isCorrect
            });
            setShowAnswer(true);
        } catch {
            Toast.showToast("Error submitting your answer. Please try again.", "error");
        } finally {
            setOpenFeedbackModal(true);
            checkPlayed();
            setIsLoading(false);
        }
    };

    const loadGame = async () => {
        if (!game) return;
        try {
            const data = await fetchGameByDate({ game: dbGameName, game_date: gameLevel as string });
            setGameData(data || null);
        } catch {
            setError(true);
        } finally {
            setIsLoading(false);
        }
    };

    const checkPlayed = async () => {
        if (!game || !gameLevel) return;
        const played = await hasPlayedGame({ game: dbGameName, game_date: gameLevel });
        if (played) {
            setOpenHasPlayedModal(true);
            setShowAnswer(true);
        }
    };

    useEffect(() => {
        if (game) {
            loadGame();
            checkPlayed();
        }
    }, [game]);

    const getCorrectAnswer = () => {
        if (!gameData) return "";
        if (game === "guess-the-film") {
            return (gameData as GuessGame).answer;
        }
        return (gameData as TriviaQuestion | ImpostorGame).answer;
    };

    const isAnswerCorrect = () => {
        if (!gameData || !selectedOption) return false;
        if (game === "guess-the-film") {
            const guessGame = gameData as GuessGame;
            return selectedOption.toLowerCase().trim() === guessGame.answer.toLowerCase().replace(/\s/g, "");
        }
        const triviaOrImpostor = gameData as TriviaQuestion | ImpostorGame;
        return selectedOption === triviaOrImpostor.answer;
    };

    if (!game) return null;

    if (error) return <p>There was an error loading today's game.</p>;

    return (
        <main>
            <Link href={`/games/${game}/levels`} className={styles.levelsIcon}>
                <Grid2x2 size={25} color="white" />
            </Link>
            {gameData ? (
                <>
                    {game === "trivia-game" && (
                        <TriviaGame
                            gameData={gameData as TriviaQuestion}
                            selectedOption={selectedOption}
                            showAnswer={showAnswer}
                            isLoading={isLoading}
                            onSelectOption={handleSelection}
                            onSubmit={handleSubmit}
                        />
                    )}
                    {game === "find-the-impostor" && (
                        <FindTheImpostorGame
                            gameData={gameData as ImpostorGame}
                            selectedOption={selectedOption}
                            showAnswer={showAnswer}
                            isLoading={isLoading}
                            onSelectOption={handleSelection}
                            onSubmit={handleSubmit}
                        />
                    )}
                    {game === "guess-the-film" && (
                        <GuessTheFilmGame
                            gameData={gameData as GuessGame}
                            selectedOption={selectedOption || ""}
                            showAnswer={showAnswer}
                            isLoading={isLoading}
                            onInputChange={handleInputChange}
                            onSubmit={handleSubmit}
                        />
                    )}

                    {/* Modals */}
                    {openHasPlayedModal && (
                        <HasPlayedModal gameSlug={game} />
                    )}
                    {openFeedbackModal && isAnswerCorrect() && (
                        <SuccessModal
                            onClose={() => {
                                setOpenFeedbackModal(false);
                                setSelectedOption(null);
                            }}
                        />
                    )}
                    {openFeedbackModal && !isAnswerCorrect() && (
                        <FailureModal
                            onClose={() => {
                                setOpenFeedbackModal(false);
                                setSelectedOption(null);
                            }}
                            correctAnswer={getCorrectAnswer()}
                        />
                    )}
                </>
            ) : (
                !isLoading && <EmptyListComponent />
            )}
        </main>
    );
}