// Styles
import Banner from "@/components/ui/games/Banner/Banner";
import styles from "./about.module.css";
import { User } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
    return (
        <main className={styles.page}>
            <Banner image="https://xscyhjniouateyibsogs.supabase.co/storage/v1/object/public/images/Banner.png" />
            <div className={styles.container}>
                <h1>About Binge Quest</h1>

                <section>
                    <p>
                        Binge Quest is an interactive gaming platform designed for true cinephiles.
                        The project's goal is to combine entertainment with challenges about films and TV series. There are currently 3 games and more to come in the future. Designed and developed by <a href="https://github.com/SantiVentri">Santino Ventrice</a>.
                    </p>
                </section>

                <hr />

                <section>
                    <h2>🎯 How to Play</h2>
                    <p>
                        Each game presents a unique challenge related to movies and TV series. You can play daily challenges or explore different levels. The answers of each level are <span>final</span> and <span>cannot be changed after submitting</span>, so choose wisely!
                    </p>
                </section>

                <hr />

                <section>
                    <h2>🧠 Trivia Game</h2>
                    <p>
                        Trivia Game is the classic choice for movie and TV series fans. Answer questions about plots, characters, actors and directors. 4 options are presented for each question, choose the correct one to win the game.
                    </p>
                </section>

                <hr />

                <section>
                    <h2>🔍 Find the Impostor</h2>
                    <p>
                        Find the Impostor presents you with 12 films or TV series, all belong to an specific category, except for one. Your challenge is to identify the impostor.
                    </p>
                </section>

                <hr />

                <section>
                    <h2>🎬 Guess the Film</h2>
                    <p>
                        In Guess the Film, your task is to identify movies based on iconic scenes.
                        This game challenges your visual memory and knowledge.
                    </p>
                </section>

                <hr />

                <section>
                    <h2>⚙️ Profile and Settings</h2>
                    <p>
                        Here you can customize your avatar, banner and edit your personal information. You can also track your game statistics, top games and achievements.
                    </p>
                </section>

                <hr />

                <section>
                    <h2>🔜 What to expect</h2>
                    <p>I'm trying to add more content, increase difficulty, and new features. This is some of what I have planned:</p>
                    <ol>
                        <li>New games and game modes (Scheduled for next version)</li>
                        <li>Friend leaderboards and rankings (Scheduled for next version)</li>
                        <li>More customization options for profiles</li>
                    </ol>
                </section>
            </div>
        </main>
    )
}