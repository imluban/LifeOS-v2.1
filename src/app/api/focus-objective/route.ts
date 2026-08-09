import { supabaseAdmin } from "@/lib/supabase-admin";
import { getAuthenticatedUser } from "@/lib/auth-server";

export async function POST(req: Request) {
  try {
    const user = await getAuthenticatedUser(req);

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { objective } = body;

    if (!objective || typeof objective !== "string" || !objective.trim()) {
      return Response.json(
        { error: "objective is required." },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin.from("focus_objectives").insert({
      user_id: user.id,
      objective: objective.trim(),
    });

    if (error) throw error;

    return Response.json({ success: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to save objective.";

    return Response.json({ error: message }, { status: 500 });
  }
}
