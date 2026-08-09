import { supabaseAdmin } from "@/lib/supabase-admin";
import { getAuthenticatedUser } from "@/lib/auth-server";

const USER_DATA_TABLES = [
  "tasks",
  "goals",
  "streaks",
  "user_stats",
  "focus_sessions",
  "focus_objectives",
  "daily_checkins",
  "ai_messages",
];

export async function POST(req: Request) {
  try {
    const user = await getAuthenticatedUser(req);

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    for (const table of USER_DATA_TABLES) {
      await supabaseAdmin.from(table).delete().eq("user_id", user.id);
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error(error);

    const message =
      error instanceof Error ? error.message : "Failed to clear data.";

    return Response.json({ error: message }, { status: 500 });
  }
}
