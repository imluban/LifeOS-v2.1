import Groq from "groq-sdk";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { getAuthenticatedUser } from "@/lib/auth-server";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const user = await getAuthenticatedUser(req);

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { goal, tone } = body;

    const TONE_INSTRUCTIONS: Record<string, string> = {
      direct: "Be short, blunt, and free of cushioning language.",
      encouraging: "Be warm, supportive, and motivational.",
      analytical: "Be dispassionate, precise, and data-driven.",
    };

    const toneInstruction =
      typeof tone === "string" && TONE_INSTRUCTIONS[tone]
        ? TONE_INSTRUCTIONS[tone]
        : TONE_INSTRUCTIONS.direct;

    if (!goal || typeof goal !== "string" || !goal.trim()) {
      return Response.json({ error: "goal is required." }, { status: 400 });
    }

    const { data: previousMessages } = await supabaseAdmin
      .from("ai_messages")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true })
      .limit(30);

    const memoryMessages =
      previousMessages
        ?.filter((msg) => msg.content && msg.role)
        .map((msg) => ({
          role: msg.role as "user" | "assistant",
          content: msg.content as string,
        })) || [];

    const messages: Groq.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: `
You are LifeOS AI.

You are an elite strategic operating system.

You MUST:
- remember previous conversations
- maintain continuity
- reference earlier goals
- behave like a persistent AI advisor
- help users execute long-term ambitions

Your personality:
- strategic
- intelligent
- execution-focused
- psychologically sharp
- future-oriented

Always maintain conversational memory.

Tone: ${toneInstruction}
`,
      },

      ...memoryMessages,

      {
        role: "user",
        content: goal,
      },
    ];

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages,
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0]?.message?.content ?? "";

    await supabaseAdmin.from("ai_messages").insert([
      {
        user_id: user.id,
        role: "user",
        content: goal,
      },
      {
        user_id: user.id,
        role: "assistant",
        content: aiResponse,
      },
    ]);

    return Response.json({ result: aiResponse });
  } catch (error) {
    console.error(error);

    const message =
      error instanceof Error ? error.message : "AI request failed.";

    return Response.json({ error: message }, { status: 500 });
  }
}
