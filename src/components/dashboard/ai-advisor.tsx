"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

import GlassCard from "@/components/ui/glass-card";
import Skeleton from "@/components/ui/skeleton";
import { apiFetch } from "@/lib/api-client";
import { useCurrentUser } from "@/hooks/use-current-user";
import { usePreferencesStore } from "@/store/preferences-store";

export default function AIAdvisor() {
  const { user } = useCurrentUser();
  const aiTone = usePreferencesStore((s) => s.aiTone);

  const [recommendation, setRecommendation] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);

    async function loadAdvice() {
      try {
        const data = (await apiFetch("/api/recommendation", {
          method: "POST",
          body: JSON.stringify({ tone: aiTone }),
        })) as { recommendation?: string };

        if (!cancelled) {
          setRecommendation(
            data.recommendation || "No recommendation available yet."
          );
        }
      } catch {
        if (!cancelled) {
          setError("Couldn't load your AI advice right now.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadAdvice();

    return () => {
      cancelled = true;
    };
  }, [user, aiTone]);

  return (
    <GlassCard className="border-violet-500/10 bg-violet-500/[0.03] p-6">
      <div className="flex items-center gap-2">
        <Sparkles size={16} className="text-violet-400" />
        <h2 className="font-display text-xl font-bold">AI Advisor</h2>
      </div>

      {loading ? (
        <div className="mt-4 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      ) : (
        <p className="mt-4 text-white/70">{error || recommendation}</p>
      )}
    </GlassCard>
  );
}
