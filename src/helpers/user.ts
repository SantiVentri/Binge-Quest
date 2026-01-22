import { GameSessionProps } from "@/types";
import { createClient } from "@/utils/supabase/client";

export async function hasPlayedToday({ game }: Pick<GameSessionProps, "game">) {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const today = new Date();
    const startOfDay = new Date(today.setUTCHours(0, 0, 0, 0)).toISOString();
    const endOfDay = new Date(today.setUTCHours(24, 0, 0, 0)).toISOString();

    const { data, error } = await supabase
        .from("game_sessions")
        .select("id")
        .eq("user_id", user.id)
        .eq("game", game)
        .gte("game_date", startOfDay)
        .lt("game_date", endOfDay)
        .maybeSingle();

    if (error) {
        console.error("Error checking game session:", error);
        return false;
    }
    return !!data;
}

export async function fetchUserImages(userId: string): Promise<{ banner: string | null; avatar: string | null }> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("banner, avatar")
    .eq("id", userId)
    .single();

  if (error || !data) {
    console.error("Error fetching user images:", error);
    return { banner: null, avatar: null };
  }

  return {
    banner: data.banner,
    avatar: data.avatar,
  };
}


// Fetch Stats
export async function fetchUserTopGames(userId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("game_sessions")
    .select("game")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching user top games:", error);
    return [];
  }

  // Count occurrences of each game
  const counts: Record<string, number> = {};

  // Tally up the games
  for (const row of data) {
    counts[row.game] = (counts[row.game] || 0) + 1;
  }

  // Convert counts to sorted array and get top 3
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([game, count]) => ({ game, count }));
}

export async function fetchGameWinRate(userId: string, game: GameSessionProps["game"]) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("game_sessions")
      .select("is_correct")
      .eq("user_id", userId)
      .eq("game", game);

    if (error) {
      throw error;
    }

    const totalGames = data?.length || 0;
    const correctGames = data?.filter((record) => record.is_correct).length || 0;
    const winRate = totalGames > 0 ? (correctGames / totalGames) * 100 : 0;

    return winRate;
  } catch (error) {
    console.error("Error fetching game win rate:", error);
    return 0;
  }
    
}