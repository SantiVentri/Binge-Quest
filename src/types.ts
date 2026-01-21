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

export interface GuessGame {
    id: string;
    title: string;
    image: string;
    answer: string;
    release_at: string; // ISO date string
}

export interface GameSessionProps {
    user_id: string;
    game_date: string;
    game: "trivia_game" | "find_the_impostor" | "guess_the_film";
    is_correct: boolean;
}