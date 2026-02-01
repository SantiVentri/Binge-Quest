import { createClient } from "@/utils/supabase/client";

// Types
import { GameSessionProps } from "@/types";

// Get Local Date String
export function getLocalDateString() {
  const d = new Date();
  return d.toLocaleDateString("en-US"); // YYYY-MM-DD
}

// Submit Game Session
export async function submitGame({ user_id, game, game_date, is_correct }: GameSessionProps) {
    const supabase = createClient();

    const hasPlayed = await hasPlayedGame({ game, game_date });

    if (hasPlayed) {
      throw new Error("User has already played this level");
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

// Fetch Games
export async function fetchGameByDate({ game, game_date }: Pick<GameSessionProps, "game" | "game_date">) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from(game)
    .select("*")
    .eq("release_at", game_date)
    .maybeSingle();

  if (error) throw error;
  return data ?? null;
}

// Check if level was played
export async function hasPlayedGame({ game, game_date }: Pick<GameSessionProps, "game" | "game_date">) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return false;

  const { data, error } = await supabase
    .from("game_sessions")
    .select("id")
    .eq("user_id", user.id)
    .eq("game", game)
    .eq("game_date", game_date)
    .maybeSingle();

  if (error) {
    console.error("Error checking game session:", error);
    return false;
  }
  return !!data;
}