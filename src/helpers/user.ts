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