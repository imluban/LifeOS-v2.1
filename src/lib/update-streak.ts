import { supabaseAdmin } from "./supabase-admin";

export async function updateStreak(userId: string) {
  const today = new Date();
  const todayString = today.toISOString().split("T")[0];

  const { data: streak } = await supabaseAdmin
    .from("streaks")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (!streak) {
    await supabaseAdmin.from("streaks").insert({
      user_id: userId,
      current_streak: 1,
      longest_streak: 1,
      last_active_date: todayString,
    });

    return;
  }

  // Already checked in today — nothing to update.
  if (streak.last_active_date === todayString) {
    return;
  }

  const lastDate = new Date(streak.last_active_date);

  const diffDays = Math.floor(
    (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  let current = streak.current_streak;

  if (diffDays === 1) {
    current += 1;
  } else if (diffDays > 1) {
    current = 1;
  }

  const longest = Math.max(current, streak.longest_streak);

  await supabaseAdmin
    .from("streaks")
    .update({
      current_streak: current,
      longest_streak: longest,
      last_active_date: todayString,
    })
    .eq("user_id", userId);
}
