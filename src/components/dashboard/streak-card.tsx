"use client";

import { useEffect, useState } from "react";
import { Flame } from "lucide-react";

import GlassCard from "@/components/ui/glass-card";
import Skeleton from "@/components/ui/skeleton";
import { supabase } from "@/lib/supabase";
import { useCurrentUser } from "@/hooks/use-current-user";

interface Streak {
  current_streak: number;
  longest_streak: number;
}

export default function StreakCard() {
  const { user } = useCurrentUser();
  const [streak, setStreak] = useState<Streak | null>(null);
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
        setStreak(data);
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
        <h3 className="text-lg font-semibold">Execution Streak</h3>
      </div>

      {loading ? (
        <Skeleton className="mt-6 h-12 w-16" />
      ) : (
        <div className="mt-6">
          <div className="font-mono text-5xl font-bold text-amber-300 tabular-nums">
            {streak?.current_streak || 0}
          </div>

          <p className="mt-2 text-sm text-white/50">consecutive days</p>

          <div className="mt-4 text-sm text-white/40">
            Longest:{" "}
            <span className="font-mono text-white/60">
              {streak?.longest_streak || 0}
            </span>
          </div>
        </div>
      )}
    </GlassCard>
  );
}
