"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Circle, ListTodo } from "lucide-react";

import DashboardLayout from "@/components/layout/dashboard-layout";
import GlassCard from "@/components/ui/glass-card";
import Skeleton from "@/components/ui/skeleton";
import Button from "@/components/ui/button";
import ProtectedRoute from "@/components/auth/protected-route";

import { supabase } from "@/lib/supabase";
import { apiFetch } from "@/lib/api-client";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useToast } from "@/components/providers/toast-provider";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
}

const PRIORITY_STYLES: Record<string, string> = {
  high: "border-amber-400/30 bg-amber-400/10 text-amber-300",
  medium: "border-violet-400/30 bg-violet-400/10 text-violet-300",
  low: "border-white/10 bg-white/5 text-white/50",
};

export default function TasksPage() {
  const { user } = useCurrentUser();
  const { toast } = useToast();

  const [goal, setGoal] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  async function fetchTasks() {
    if (!user) return;

    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setTasks(data || []);
    setTasksLoading(false);
  }

  async function generateTasks() {
    if (!goal.trim()) return;

    try {
      setGenerating(true);
      setError("");

      await apiFetch("/api/generate-tasks", {
        method: "POST",
        body: JSON.stringify({ goal }),
      });

      setGoal("");
      await fetchTasks();
      toast("Execution system generated.", "success");
    } catch (err) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Failed to generate tasks.";
      setError(message);
      toast(message, "error");
    } finally {
      setGenerating(false);
    }
  }

  async function toggleTask(taskId: string) {
    // Optimistic update so the UI feels instant.
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: "completed" } : t))
    );

    try {
      await apiFetch("/api/complete-task", {
        method: "POST",
        body: JSON.stringify({ taskId }),
      });

      await fetchTasks();
    } catch (err) {
      console.error(err);
      toast("Couldn't complete that task — please try again.", "error");
      // Roll back on failure.
      await fetchTasks();
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (user) fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="mx-auto max-w-5xl space-y-8">
          <div>
            <h1 className="font-display text-4xl font-bold tracking-tight">
              Execution Engine
            </h1>

            <p className="mt-2 text-white/50">
              Transform ambition into executable systems.
            </p>
          </div>

          <GlassCard className="p-6">
            <div className="space-y-4">
              <textarea
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="Describe your goal..."
                className="min-h-[140px] w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 outline-none placeholder:text-white/30"
              />

              <Button
                onClick={generateTasks}
                disabled={generating || !goal.trim()}
              >
                {generating ? "Generating..." : "Generate Execution System"}
              </Button>

              {error && <p className="text-sm text-red-400">{error}</p>}
            </div>
          </GlassCard>

          <div className="grid gap-5">
            {tasksLoading &&
              Array.from({ length: 3 }).map((_, i) => (
                <GlassCard key={i} className="p-5">
                  <Skeleton className="h-5 w-1/2" />
                  <Skeleton className="mt-3 h-4 w-3/4" />
                </GlassCard>
              ))}

            {!tasksLoading && tasks.length === 0 && (
              <GlassCard className="flex flex-col items-center gap-3 p-10 text-center">
                <ListTodo size={28} className="text-white/20" />
                <p className="text-sm text-white/40">
                  No tasks yet — describe a goal above to generate some.
                </p>
              </GlassCard>
            )}

            {tasks.map((task) => (
              <GlassCard
                key={task.id}
                className={`p-5 transition-all ${
                  task.status === "completed" ? "opacity-50" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-1 items-start gap-4">
                    <button
                      onClick={() => toggleTask(task.id)}
                      disabled={task.status === "completed"}
                      aria-label="Complete task"
                      className="mt-0.5 shrink-0 text-white/30 transition hover:text-amber-400 disabled:cursor-not-allowed"
                    >
                      {task.status === "completed" ? (
                        <CheckCircle2 size={22} className="text-amber-400" />
                      ) : (
                        <Circle size={22} />
                      )}
                    </button>

                    <div className="flex-1">
                      <h2 className="text-lg font-semibold">{task.title}</h2>

                      <p className="mt-2 text-sm text-white/60">
                        {task.description}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`shrink-0 rounded-full border px-3 py-1 text-xs uppercase tracking-wider ${
                      PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.low
                    }`}
                  >
                    {task.priority}
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
