import Groq from "groq-sdk";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { getAuthenticatedUser } from "@/lib/auth-server";
import { GROQ_MODEL } from "@/lib/ai-config";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const user = await getAuthenticatedUser(req);

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: goals } = await supabaseAdmin
      .from("goals")
      .select("*")
      .eq("user_id", user.id);

    const { data: tasks } = await supabaseAdmin
      .from("tasks")
      .select("*")
      .eq("user_id", user.id);

    const { data: focus } = await supabaseAdmin
      .from("focus_sessions")
      .select("*")
      .eq("user_id", user.id);

    const prompt = `
Analyze this user's week.

Goals:
${JSON.stringify(goals)}

Tasks:
${JSON.stringify(tasks)}

Focus Sessions:
${JSON.stringify(focus)}

Create:

1. Execution Score (0-100)
2. Strengths
3. Weaknesses
4. Recommendations

Keep concise.
`;

    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        {
          role: "system",
          content: "You are an elite executive performance advisor.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const report =
      completion.choices[0]?.message?.content ??
      "Not enough activity yet to generate a report.";

    return Response.json({ report });
  } catch (error) {
    console.error(error);

    const message =
      error instanceof Error ? error.message : "Failed to generate report.";

    return Response.json({ error: message }, { status: 500 });
  }
}
