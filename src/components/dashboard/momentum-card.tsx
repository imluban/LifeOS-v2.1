"use client";

import { useEffect, useState } from "react";
import { Zap } from "lucide-react";

import GlassCard from "@/components/ui/glass-card";
import Skeleton from "@/components/ui/skeleton";
import { supabase } from "@/lib/supabase";
import { useCurrentUser } from "@/hooks/use-current-user";

interface UserStats {
  momentum_score: number;
  completed_tasks: number;
  current_streak: number;
}

export default function MomentumCard() {
  const { user } = useCurrentUser();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    async function loadStats() {
      const { data } = await supabase
        .from("user_stats")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();

      if (!cancelled) {
        setStats(data);
        setLoading(false);
      }
    }

    loadStats();

    return () => {
      cancelled = true;
    };
  }, [user]);

  return (
    <GlassCard className="p-6">
      <div className="flex items-center gap-2">
        <Zap size={16} className="text-violet-400" />
        <h3 className="text-lg font-semibold">Momentum Engine</h3>
      </div>

      {loading ? (
        <div className="mt-6 space-y-3">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-16" />
        </div>
      ) : (
        <div className="mt-6 space-y-3 font-mono text-sm">
          <div className="flex justify-between text-white/70">
            <span>Score</span>
            <span className="text-violet-300">{stats?.momentum_score || 0}</span>
          </div>
          <div className="flex justify-between text-white/70">
            <span>Completed</span>
            <span>{stats?.completed_tasks || 0}</span>
          </div>
          <div className="flex justify-between text-white/70">
            <span>Streak</span>
            <span>{stats?.current_streak || 0}</span>
          </div>
        </div>
      )}
    </GlassCard>
  );
}
