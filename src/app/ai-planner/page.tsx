"use client";

import { useState } from "react";

import DashboardLayout from "@/components/layout/dashboard-layout";
import GlassCard from "@/components/ui/glass-card";
import Button from "@/components/ui/button";
import ProtectedRoute from "@/components/auth/protected-route";

import { apiFetch } from "@/lib/api-client";
import { usePreferencesStore } from "@/store/preferences-store";
import Skeleton from "@/components/ui/skeleton";
import { Brain } from "lucide-react";

export default function AIPlannerPage() {
  const aiTone = usePreferencesStore((s) => s.aiTone);
  const [goal, setGoal] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");

  async function generatePlan() {
    if (!goal.trim()) return;

    try {
      setLoading(true);
      setError("");

      const data = (await apiFetch("/api/ai", {
        method: "POST",
        body: JSON.stringify({ goal, tone: aiTone }),
      })) as { result?: string };

      setResponse(data.result || "");
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Failed to generate a plan."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="mx-auto max-w-4xl space-y-8">
          <div>
            <div className="flex items-center gap-2">
              <Brain size={20} className="text-violet-400" />
              <h1 className="font-display text-4xl font-bold tracking-tight">
                AI Strategic Planner
              </h1>
            </div>

            <p className="mt-2 text-white/50">
              Convert ambition into execution systems.
            </p>
          </div>

          <GlassCard className="p-6">
            <div className="space-y-5">
              <textarea
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="Describe your goal..."
                className="min-h-[180px] w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 outline-none placeholder:text-white/30"
              />

              <Button onClick={generatePlan} disabled={loading || !goal.trim()}>
                {loading ? "Generating..." : "Generate Strategic Plan"}
              </Button>

              {error && <p className="text-sm text-red-400">{error}</p>}
            </div>
          </GlassCard>

          {loading && (
            <GlassCard className="space-y-3 p-8">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-2/3" />
            </GlassCard>
          )}

          {!loading && response && (
            <GlassCard className="p-8">
              <div className="prose prose-invert max-w-none whitespace-pre-wrap">
                {response}
              </div>
            </GlassCard>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
