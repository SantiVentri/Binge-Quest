import { GameSessionProps } from "@/types";
import { createClient } from "@/utils/supabase/client";
import { create } from "domain";

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
