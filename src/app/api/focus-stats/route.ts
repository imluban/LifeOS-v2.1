import { supabaseAdmin } from "@/lib/supabase-admin";
import { getAuthenticatedUser } from "@/lib/auth-server";

export async function POST(req: Request) {
  try {
    const user = await getAuthenticatedUser(req);

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin
      .from("focus_sessions")
      .select("*")
      .eq("user_id", user.id);

    if (error) throw error;

    const totalMinutes =
      data?.reduce((sum, session) => sum + session.duration_minutes, 0) || 0;

    return Response.json({
      totalHours: totalMinutes / 60,
      sessions: data?.length || 0,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load focus stats.";

    return Response.json({ error: message }, { status: 500 });
  }
}
