"use client";

import { useEffect, useState } from "react";
import { BarChart3 } from "lucide-react";

import GlassCard from "@/components/ui/glass-card";
import Skeleton from "@/components/ui/skeleton";
import { apiFetch } from "@/lib/api-client";
import { useCurrentUser } from "@/hooks/use-current-user";

interface FocusStats {
  sessions: number;
  totalHours: number;
}

export default function FocusInsights() {
  const { user } = useCurrentUser();
  const [stats, setStats] = useState<FocusStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    async function load() {
      try {
        const data = (await apiFetch("/api/focus-stats", {
          method: "POST",
          body: JSON.stringify({}),
        })) as FocusStats;

        if (!cancelled) setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
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
        <BarChart3 size={16} className="text-violet-400" />
        <h3 className="text-lg font-semibold">Focus Insights</h3>
      </div>

      {loading ? (
        <div className="mt-6 space-y-3">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-5 w-20" />
        </div>
      ) : (
        <div className="mt-6 space-y-2 font-mono text-sm text-white/70">
          <div className="flex justify-between">
            <span>Sessions</span>
            <span>{stats?.sessions || 0}</span>
          </div>
          <div className="flex justify-between">
            <span>Hours</span>
            <span>{Number(stats?.totalHours || 0).toFixed(1)}</span>
          </div>
        </div>
      )}
    </GlassCard>
  );
}
