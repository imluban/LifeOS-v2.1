"use client";

import { useEffect, useState } from "react";
import { ClipboardCheck } from "lucide-react";

import { supabase } from "@/lib/supabase";

import DashboardLayout from "@/components/layout/dashboard-layout";
import GlassCard from "@/components/ui/glass-card";
import Skeleton from "@/components/ui/skeleton";
import Button from "@/components/ui/button";
import ProtectedRoute from "@/components/auth/protected-route";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useToast } from "@/components/providers/toast-provider";

interface CheckinRow {
  id: string;
  focus_score: number;
  energy_score: number;
  execution_score: number;
  notes: string;
  created_at: string;
}

function SliderField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <div className="mb-2 flex justify-between text-sm">
        <label className="text-white/50">{label}</label>
        <span className="font-mono text-amber-300">{value}</span>
      </div>

      <input
        type="range"
        min={1}
        max={10}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-amber-400"
      />
    </div>
  );
}

export default function CheckinPage() {
  const { user } = useCurrentUser();
  const { toast } = useToast();

  const [focus, setFocus] = useState(5);
  const [energy, setEnergy] = useState(5);
  const [execution, setExecution] = useState(5);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const [history, setHistory] = useState<CheckinRow[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  async function loadHistory() {
    if (!user) return;

    const { data } = await supabase
      .from("daily_checkins")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5);

    setHistory(data || []);
    setHistoryLoading(false);
  }

  async function submitCheckin() {
    if (!user) return;

    setSaving(true);

    try {
      const { error } = await supabase.from("daily_checkins").insert({
        user_id: user.id,
        focus_score: focus,
        energy_score: energy,
        execution_score: execution,
        notes,
      });

      if (error) throw error;

      toast("Check-in recorded.", "success");
      setNotes("");
      setFocus(5);
      setEnergy(5);
      setExecution(5);
      loadHistory();
    } catch (error) {
      console.error(error);
      toast("Something went wrong saving your check-in.", "error");
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (user) loadHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="mx-auto max-w-3xl space-y-8">
          <GlassCard className="p-8">
            <div className="flex items-center gap-2">
              <ClipboardCheck size={18} className="text-amber-400" />
              <h1 className="font-display text-3xl font-bold">
                Daily Check-In
              </h1>
            </div>

            <div className="mt-8 space-y-6">
              <SliderField label="Focus" value={focus} onChange={setFocus} />
              <SliderField label="Energy" value={energy} onChange={setEnergy} />
              <SliderField
                label="Execution"
                value={execution}
                onChange={setExecution}
              />

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="How did today go?"
                className="min-h-[150px] w-full rounded-xl border border-white/10 bg-white/5 p-4 outline-none placeholder:text-white/30"
              />

              <Button onClick={submitCheckin} disabled={saving}>
                {saving ? "Saving..." : "Save Check-In"}
              </Button>
            </div>
          </GlassCard>

          <div>
            <h2 className="mb-4 text-lg font-semibold text-white/70">
              Recent Check-Ins
            </h2>

            <div className="space-y-3">
              {historyLoading && (
                <>
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </>
              )}

              {!historyLoading && history.length === 0 && (
                <p className="text-sm text-white/40">No check-ins yet.</p>
              )}

              {history.map((entry) => (
                <GlassCard key={entry.id} className="p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/40">
                      {new Date(entry.created_at).toLocaleDateString(
                        undefined,
                        { month: "short", day: "numeric" }
                      )}
                    </span>

                    <div className="flex gap-4 font-mono text-white/60">
                      <span>F {entry.focus_score}</span>
                      <span>E {entry.energy_score}</span>
                      <span>X {entry.execution_score}</span>
                    </div>
                  </div>

                  {entry.notes && (
                    <p className="mt-2 text-sm text-white/50">
                      {entry.notes}
                    </p>
                  )}
                </GlassCard>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
