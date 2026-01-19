import { createClient } from "@/utils/supabase/client";

// Types
import { GameSessionProps } from "@/types";
import { hasPlayedToday } from "./user";

export function getLocalDateString() {
  const d = new Date();
  return d.toLocaleDateString("en-US"); // YYYY-MM-DD
}

export async function submitGame({ user_id, game, game_date, is_correct }: GameSessionProps) {
    const supabase = createClient();

    const hasPlayed = await hasPlayedToday({ game });

    if (hasPlayed) {
      throw new Error("User has already played today");
    }

    const { data, error } = await supabase
      .from("game_sessions")
      .insert([{
        user_id,
        game,
        game_date,
        is_correct
      }]);
    if (error) throw error;
    return data ?? null;
}