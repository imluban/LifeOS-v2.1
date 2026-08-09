"use client";

import { useEffect, useState } from "react";
import { Flame } from "lucide-react";

import { supabase } from "@/lib/supabase";
import GlassCard from "@/components/ui/glass-card";
import Skeleton from "@/components/ui/skeleton";
import { useCurrentUser } from "@/hooks/use-current-user";

export default function StreakWidget() {
  const { user } = useCurrentUser();
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    async function load() {
      const { data } = await supabase
        .from("streaks")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();

      if (!cancelled) {
        setStreak(data?.current_streak || 0);
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
        <Flame size={16} className="text-amber-400" />
        <h2 className="text-lg font-semibold">Streak</h2>
      </div>

      {loading ? (
        <Skeleton className="mt-4 h-11 w-16" />
      ) : (
        <div className="mt-4 font-mono text-5xl font-bold tabular-nums text-amber-300">
          {streak}
        </div>
      )}
    </GlassCard>
  );
}
