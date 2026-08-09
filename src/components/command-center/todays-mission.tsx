"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Crosshair } from "lucide-react";

import { supabase } from "@/lib/supabase";
import GlassCard from "@/components/ui/glass-card";
import Skeleton from "@/components/ui/skeleton";
import { useCurrentUser } from "@/hooks/use-current-user";

export default function TodaysMission() {
  const { user } = useCurrentUser();
  const [objective, setObjective] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    async function load() {
      const { data } = await supabase
        .from("focus_objectives")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(1);

      if (!cancelled) {
        setObjective(data?.[0]?.objective || "");
        setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [user]);

  return (
    <GlassCard className="border-amber-500/10 bg-amber-500/[0.03] p-6">
      <div className="flex items-center gap-2">
        <Crosshair size={16} className="text-amber-400" />
        <h2 className="font-display text-xl font-bold">
          Today&apos;s Mission
        </h2>
      </div>

      {loading ? (
        <Skeleton className="mt-4 h-6 w-2/3" />
      ) : objective ? (
        <p className="mt-4 text-lg text-white/80">{objective}</p>
      ) : (
        <p className="mt-4 text-sm text-white/40">
          No mission set yet.{" "}
          <Link href="/focus/deep" className="text-amber-300 hover:underline">
            Set one in Deep Focus
          </Link>
          .
        </p>
      )}
    </GlassCard>
  );
}
