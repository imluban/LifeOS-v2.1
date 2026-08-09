"use client";

import { useEffect, useState } from "react";
import { History } from "lucide-react";

import { supabase } from "@/lib/supabase";
import GlassCard from "@/components/ui/glass-card";
import Skeleton from "@/components/ui/skeleton";
import { useCurrentUser } from "@/hooks/use-current-user";

interface FocusSession {
  id: string;
  session_name: string;
  duration_minutes: number;
}

export default function RecentFocusWidget() {
  const { user } = useCurrentUser();
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    async function load() {
      const { data } = await supabase
        .from("focus_sessions")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(5);

      if (!cancelled) {
        setSessions(data || []);
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
      <div className="mb-4 flex items-center gap-2">
        <History size={16} className="text-violet-400" />
        <h2 className="font-display text-xl font-bold">
          Recent Focus Sessions
        </h2>
      </div>

      <div className="space-y-3">
        {loading && (
          <>
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-2/3" />
          </>
        )}

        {!loading && sessions.length === 0 && (
          <p className="text-sm text-white/40">No focus sessions yet.</p>
        )}

        {sessions.map((session) => (
          <div
            key={session.id}
            className="flex justify-between text-sm text-white/80"
          >
            <span>{session.session_name}</span>
            <span className="font-mono text-white/50">
              {session.duration_minutes}m
            </span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
