import Groq from "groq-sdk";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { getAuthenticatedUser } from "@/lib/auth-server";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

interface GeneratedTask {
  title: string;
  description: string;
  priority?: "high" | "medium" | "low";
}

export async function POST(req: Request) {
  try {
    const user = await getAuthenticatedUser(req);

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { goal } = body;

    if (!goal || typeof goal !== "string" || !goal.trim()) {
      return Response.json({ error: "goal is required." }, { status: 400 });
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `
You are an elite execution strategist.

Break the user's goal into exactly 5 actionable tasks.

Return ONLY valid JSON.

Example:

[
  {
    "title": "Validate Idea",
    "description": "Interview 20 potential customers",
    "priority": "high"
  }
]

Rules:
- Return exactly 5 tasks
- Priorities must be: high, medium, or low
- No markdown
- No explanations
- JSON only
`,
        },
        {
          role: "user",
          content: goal,
        },
      ],
      temperature: 0.7,
    });

    const aiText = completion.choices[0]?.message?.content ?? "";

    const cleanedText = aiText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsedTasks: GeneratedTask[];

    try {
      parsedTasks = JSON.parse(cleanedText);
    } catch {
      console.error("Failed to parse AI task response:", cleanedText);

      return Response.json(
        { error: "AI returned invalid JSON. Please try again." },
        { status: 502 }
      );
    }

    if (!Array.isArray(parsedTasks) || parsedTasks.length === 0) {
      return Response.json(
        { error: "AI did not return any tasks. Please try again." },
        { status: 502 }
      );
    }

    const validPriorities = new Set(["high", "medium", "low"]);

    const tasksToInsert = parsedTasks
      .filter((task) => task && typeof task.title === "string")
      .map((task) => ({
        user_id: user.id,
        title: task.title,
        description: task.description || "",
        priority: validPriorities.has(task.priority as string)
          ? task.priority
          : "medium",
        status: "pending",
      }));

    if (tasksToInsert.length === 0) {
      return Response.json(
        { error: "AI did not return any usable tasks. Please try again." },
        { status: 502 }
      );
    }

    const { error } = await supabaseAdmin.from("tasks").insert(tasksToInsert);

    if (error) {
      console.error("Supabase insert error:", error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ success: true, tasks: tasksToInsert });
  } catch (error) {
    console.error("Generate tasks error:", error);

    const message =
      error instanceof Error ? error.message : "Task generation failed.";

    return Response.json({ error: message }, { status: 500 });
  }
}
