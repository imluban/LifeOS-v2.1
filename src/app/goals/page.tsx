"use client";

import { useEffect, useState } from "react";
import { Target } from "lucide-react";

import DashboardLayout from "@/components/layout/dashboard-layout";
import GlassCard from "@/components/ui/glass-card";
import Skeleton from "@/components/ui/skeleton";
import Button from "@/components/ui/button";

import { supabase } from "@/lib/supabase";
import ProtectedRoute from "@/components/auth/protected-route";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useToast } from "@/components/providers/toast-provider";

interface Goal {
  id: string;
  title: string;
  description: string;
  progress: number;
}

export default function GoalsPage() {
  const { user } = useCurrentUser();
  const { toast } = useToast();

  const [goals, setGoals] = useState<Goal[]>([]);
  const [goalsLoading, setGoalsLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function fetchGoals() {
    if (!user) return;

    const { data, error } = await supabase
      .from("goals")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setGoals(data || []);
    setGoalsLoading(false);
  }

  async function createGoal() {
    if (!user || !title.trim()) return;

    setSaving(true);
    setError("");

    const { error } = await supabase.from("goals").insert({
      user_id: user.id,
      title: title.trim(),
      description,
    });

    setSaving(false);

    if (error) {
      setError(error.message);
      toast(error.message, "error");
      return;
    }

    setTitle("");
    setDescription("");
    toast("Goal created.", "success");

    fetchGoals();
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (user) fetchGoals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-8">
          <div>
            <h1 className="font-display text-4xl font-bold tracking-tight">
              Goals Engine
            </h1>

            <p className="mt-2 text-white/60">
              Structure your future deliberately.
            </p>
          </div>

          <GlassCard className="p-6">
            <div className="space-y-4">
              <input
                placeholder="Goal title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 outline-none placeholder:text-white/30"
              />

              <textarea
                placeholder="Goal description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[120px] w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 outline-none placeholder:text-white/30"
              />

              <Button onClick={createGoal} disabled={saving || !title.trim()}>
                {saving ? "Creating..." : "Create Goal"}
              </Button>

              {error && <p className="text-sm text-red-400">{error}</p>}
            </div>
          </GlassCard>

          <div className="grid gap-6 md:grid-cols-2">
            {goalsLoading &&
              Array.from({ length: 2 }).map((_, i) => (
                <GlassCard key={i} className="p-6">
                  <Skeleton className="h-6 w-2/3" />
                  <Skeleton className="mt-3 h-4 w-full" />
                  <Skeleton className="mt-6 h-3 w-full rounded-full" />
                </GlassCard>
              ))}

            {!goalsLoading && goals.length === 0 && (
              <GlassCard className="flex flex-col items-center gap-3 p-10 text-center md:col-span-2">
                <Target size={28} className="text-white/20" />
                <p className="text-sm text-white/40">
                  No goals yet — add one above.
                </p>
              </GlassCard>
            )}

            {goals.map((goal) => (
              <GlassCard key={goal.id} className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-semibold">{goal.title}</h3>

                    <p className="mt-2 text-white/50">{goal.description}</p>
                  </div>

                  <div>
                    <div className="mb-2 flex justify-between font-mono text-sm text-white/40">
                      <span>Progress</span>

                      <span>{goal.progress || 0}%</span>
                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-white/5">
                      <div
                        className="h-full rounded-full bg-violet-500 transition-all duration-500"
                        style={{ width: `${goal.progress || 0}%` }}
                      />
                    </div>
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
