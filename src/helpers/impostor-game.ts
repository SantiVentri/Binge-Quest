import { createClient } from "@/utils/supabase/client";
import { getLocalDateString } from "./games";

export async function fetchTodaysImpostor() {
  const supabase = createClient();
  const today = getLocalDateString();

  const { data, error } = await supabase
    .from("find_the_impostor")
    .select("*")
    .eq("release_at", today)
    .maybeSingle();

  if (error) throw error;
  return data ?? null;
}

