export interface TriviaQuestion {
    id: string;
    title: string;
    options: string[];
    answer: string;
    banner: string;
    image: string;
    release_at: string; // ISO date string
}