import { supabaseAdmin } from "@/lib/supabase-admin";
import { getAuthenticatedUser } from "@/lib/auth-server";
import { updateMomentum } from "@/lib/update-momentum";
import { updateStreak } from "@/lib/update-streak";

export async function POST(req: Request) {
  try {
    const user = await getAuthenticatedUser(req);

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { taskId } = body;

    if (!taskId) {
      return Response.json(
        { error: "taskId is required." },
        { status: 400 }
      );
    }

    // Scope the update to this user so nobody can complete someone
    // else's task by guessing an id.
    const { data, error } = await supabaseAdmin
      .from("tasks")
      .update({ status: "completed" })
      .eq("id", taskId)
      .eq("user_id", user.id)
      .select("id");

    if (error) throw error;

    if (!data || data.length === 0) {
      return Response.json({ error: "Task not found." }, { status: 404 });
    }

    await updateMomentum(user.id);
    await updateStreak(user.id);

    return Response.json({ success: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to complete task.";

    return Response.json({ error: message }, { status: 500 });
  }
}
