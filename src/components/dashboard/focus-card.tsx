"use client";

import { useEffect, useState } from "react";
import { Timer } from "lucide-react";

import GlassCard from "@/components/ui/glass-card";
import Skeleton from "@/components/ui/skeleton";
import { supabase } from "@/lib/supabase";
import { useCurrentUser } from "@/hooks/use-current-user";

export default function FocusCard() {
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

      const totalMinutes =
        data?.reduce((acc, session) => acc + session.duration_minutes, 0) ||
        0;

      if (!cancelled) {
        setHours(Number((totalMinutes / 60).toFixed(1)));
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
        <h3 className="text-lg font-semibold">Focus Hours</h3>
      </div>

      {loading ? (
        <Skeleton className="mt-6 h-12 w-20" />
      ) : (
        <>
          <div className="mt-6 font-mono text-5xl font-bold tabular-nums">
            {hours}
          </div>
          <div className="mt-2 text-sm text-white/50">
            total deep work hours
          </div>
        </>
      )}
    </GlassCard>
  );
}
