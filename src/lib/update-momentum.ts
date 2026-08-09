import { supabaseAdmin } from "./supabase-admin";

export async function updateMomentum(userId: string) {
  const { count } = await supabaseAdmin
    .from("tasks")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("status", "completed");

  const completedTasks = count || 0;
  const momentumScore = completedTasks * 10;

  await supabaseAdmin.from("user_stats").upsert({
    user_id: userId,
    completed_tasks: completedTasks,
    momentum_score: momentumScore,
  });
}
