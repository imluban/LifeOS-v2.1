"use client";

import { useEffect, useState } from "react";
import { Gauge } from "lucide-react";

import { supabase } from "@/lib/supabase";
import GlassCard from "@/components/ui/glass-card";
import Skeleton from "@/components/ui/skeleton";
import { useCurrentUser } from "@/hooks/use-current-user";

export default function ExecutionWidget() {
  const { user } = useCurrentUser();
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    async function load() {
      const { data } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user!.id);

      const total = data?.length || 0;
      const completed =
        data?.filter((task) => task.status === "completed").length || 0;

      const score = total === 0 ? 0 : Math.round((completed / total) * 100);

      if (!cancelled) {
        setScore(score);
        setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [user]);

  return (
    <GlassCard className="p-6">
      <div className="flex items-center gap-2">
        <Gauge size={16} className="text-amber-400" />
        <h2 className="text-lg font-semibold">Execution Score</h2>
      </div>

      {loading ? (
        <Skeleton className="mt-4 h-11 w-20" />
      ) : (
        <div className="mt-4 font-mono text-5xl font-bold tabular-nums text-amber-300">
          {score}%
        </div>
      )}
    </GlassCard>
  );
}
