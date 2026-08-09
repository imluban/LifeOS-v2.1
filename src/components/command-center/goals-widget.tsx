"use client";

import { useEffect, useState } from "react";
import { Target } from "lucide-react";

import { supabase } from "@/lib/supabase";
import GlassCard from "@/components/ui/glass-card";
import Skeleton from "@/components/ui/skeleton";
import { useCurrentUser } from "@/hooks/use-current-user";

interface Goal {
  id: string;
  title: string;
}

export default function GoalsWidget() {
  const { user } = useCurrentUser();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    async function loadGoals() {
      const { data } = await supabase
        .from("goals")
        .select("*")
        .eq("user_id", user!.id);

      if (!cancelled) {
        setGoals(data || []);
        setLoading(false);
      }
    }

    loadGoals();

    return () => {
      cancelled = true;
    };
  }, [user]);

  return (
    <GlassCard className="p-6">
      <div className="mb-4 flex items-center gap-2">
        <Target size={16} className="text-violet-400" />
        <h2 className="font-display text-xl font-bold">Active Goals</h2>
      </div>

      <div className="space-y-3">
        {loading && (
          <>
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-5 w-1/2" />
          </>
        )}

        {!loading && goals.length === 0 && (
          <p className="text-sm text-white/40">No goals yet.</p>
        )}

        {goals.map((goal) => (
          <div key={goal.id} className="text-sm text-white/80">
            {goal.title}
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
