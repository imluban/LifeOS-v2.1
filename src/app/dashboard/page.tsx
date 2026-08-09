"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getProfile, type Profile } from "@/lib/profile";
import { calculateExecutionScore } from "@/lib/execution-score";
import { supabase } from "@/lib/supabase";
import { useCurrentUser } from "@/hooks/use-current-user";

import DashboardLayout from "@/components/layout/dashboard-layout";
import MetricCard from "@/components/dashboard/metric-card";
import PerformanceChart from "@/components/dashboard/performance-chart";
import FutureTimeline from "@/components/dashboard/future-timeline";
import MomentumCard from "@/components/dashboard/momentum-card";
import ProtectedRoute from "@/components/auth/protected-route";
import StreakCard from "@/components/dashboard/streak-card";
import FocusCard from "@/components/dashboard/focus-card";
import FocusInsights from "@/components/dashboard/focus-insights";
import AIAdvisor from "@/components/dashboard/ai-advisor";

interface DashboardStats {
  executionScore: number;
  focusHours: number;
  goalsCount: number;
  momentumScore: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useCurrentUser();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    executionScore: 0,
    focusHours: 0,
    goalsCount: 0,
    momentumScore: 0,
  });

  useEffect(() => {
    if (authLoading || !user) return;

    let cancelled = false;

    async function loadDashboard() {
      const [profileResult, tasksResult, focusResult, goalsResult, statsResult] =
        await Promise.all([
          getProfile(),
          supabase.from("tasks").select("*").eq("user_id", user!.id),
          supabase
            .from("focus_sessions")
            .select("duration_minutes")
            .eq("user_id", user!.id),
          supabase
            .from("goals")
            .select("id", { count: "exact", head: true })
            .eq("user_id", user!.id),
          supabase
            .from("user_stats")
            .select("momentum_score")
            .eq("user_id", user!.id)
            .maybeSingle(),
        ]);

      if (cancelled) return;

      if (!profileResult) {
        router.push("/onboarding");
        return;
      }

      setProfile(profileResult);

      const tasks = tasksResult.data || [];
      const completed = tasks.filter((t) => t.status === "completed").length;
      const executionScore = calculateExecutionScore(completed, tasks.length);

      const totalMinutes =
        focusResult.data?.reduce(
          (acc, s) => acc + s.duration_minutes,
          0
        ) || 0;

      setStats({
        executionScore,
        focusHours: Number((totalMinutes / 60).toFixed(1)),
        goalsCount: goalsResult.count || 0,
        momentumScore: statsResult.data?.momentum_score || 0,
      });

      setStatsLoading(false);
    }

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, [user, authLoading, router]);

  const displayName = profile?.full_name || user?.email?.split("@")[0] || "there";

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-10">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
              Welcome Back, {displayName}!
            </h1>

            <p className="mt-2 text-white/60">
              Your execution systems are accelerating.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              title="Execution Score"
              value={`${stats.executionScore}%`}
              change="Based on completed tasks"
              loading={statsLoading}
              accent="amber"
            />

            <MetricCard
              title="Focus Hours"
              value={`${stats.focusHours}`}
              change="Total deep work logged"
              loading={statsLoading}
              accent="amber"
            />

            <MetricCard
              title="Goals Active"
              value={`${stats.goalsCount}`}
              change="Currently tracked"
              loading={statsLoading}
              accent="violet"
            />

            <MetricCard
              title="Momentum Score"
              value={`${stats.momentumScore}`}
              change="From completed tasks"
              loading={statsLoading}
              accent="violet"
            />
          </div>

          <div>
            <h2 className="font-display mb-4 text-xl font-bold">
              Execution Detail
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              <MomentumCard />
              <StreakCard />
              <FocusCard />
              <FocusInsights />
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <PerformanceChart />
            </div>

            <FutureTimeline />
          </div>

          <AIAdvisor />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
