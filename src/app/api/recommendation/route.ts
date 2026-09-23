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

    const body = await req.json().catch(() => ({}));
    const { tone } = body;

    const TONE_INSTRUCTIONS: Record<string, string> = {
      direct: "Be short, blunt, and free of cushioning language.",
      encouraging: "Be warm, supportive, and motivational.",
      analytical: "Be dispassionate, precise, and data-driven.",
    };

    const toneInstruction =
      typeof tone === "string" && TONE_INSTRUCTIONS[tone]
        ? TONE_INSTRUCTIONS[tone]
        : TONE_INSTRUCTIONS.direct;

    const { data: goals } = await supabaseAdmin
      .from("goals")
      .select("*")
      .eq("user_id", user.id);

    const { data: tasks } = await supabaseAdmin
      .from("tasks")
      .select("*")
      .eq("user_id", user.id);

    const { data: objectives } = await supabaseAdmin
      .from("focus_objectives")
      .select("*")
      .eq("user_id", user.id);

    const prompt = `
Goals:
${JSON.stringify(goals)}

Tasks:
${JSON.stringify(tasks)}

Focus Objectives:
${JSON.stringify(objectives)}

Give ONE short recommendation.

Maximum 2 sentences.
`;

    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        {
          role: "system",
          content: `You are an elite execution advisor. ${toneInstruction}`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const recommendation =
      completion.choices[0]?.message?.content ??
      "Add a goal or task to get a personalized recommendation.";

    return Response.json({ recommendation });
  } catch (error) {
    console.error(error);

    const message =
      error instanceof Error ? error.message : "Failed to get a recommendation.";

    return Response.json({ error: message }, { status: 500 });
  }
}
