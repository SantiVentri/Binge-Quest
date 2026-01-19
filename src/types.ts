export interface TriviaQuestion {
    id: string;
    title: string;
    options: string[];
    answer: string;
    banner: string;
    image: string;
    release_at: string; // ISO date string
}

export interface ImpostorGame {
    id: string;
    title: string;
    options: string[];
    answer: string;
    banner: string;
    image: string;
    release_at: string; // ISO date string
}

export interface GameSessionProps {
    user_id: string;
    game_date: string;
    game: "trivia-game" | "find-the-impostor";
    is_correct: boolean;
}