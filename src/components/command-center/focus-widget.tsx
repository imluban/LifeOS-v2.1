"use client";

import { useEffect, useState } from "react";
import { Timer } from "lucide-react";

import { supabase } from "@/lib/supabase";
import GlassCard from "@/components/ui/glass-card";
import Skeleton from "@/components/ui/skeleton";
import { useCurrentUser } from "@/hooks/use-current-user";

export default function FocusWidget() {
  const { user } = useCurrentUser();
  const [hours, setHours] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    async function load() {
      const { data } = await supabase
        .from("focus_sessions")
        .select("*")
        .eq("user_id", user!.id);

      const minutes =
        data?.reduce((sum, item) => sum + item.duration_minutes, 0) || 0;

      if (!cancelled) {
        setHours(Number((minutes / 60).toFixed(1)));
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
        <Timer size={16} className="text-amber-400" />
        <h2 className="text-lg font-semibold">Focus Hours</h2>
      </div>

      {loading ? (
        <Skeleton className="mt-4 h-11 w-16" />
      ) : (
        <div className="mt-4 font-mono text-5xl font-bold tabular-nums">
          {hours}
        </div>
      )}
    </GlassCard>
  );
}
