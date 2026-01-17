import { createClient } from "@/utils/supabase/client";

function getLocalDateString() {
  const d = new Date();
  return d.toLocaleDateString("en-US"); // YYYY-MM-DD
}

export async function fetchTodaysTrivia() {
  const supabase = createClient();
  const today = getLocalDateString();

  const { data, error } = await supabase
    .from("trivia_questions")
    .select("*")
    .eq("release_at", today)
    .maybeSingle();

  if (error) throw error;
  return data ?? null;
}
