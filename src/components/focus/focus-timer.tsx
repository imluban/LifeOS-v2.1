"use client";

import { useEffect, useState } from "react";

import GlassCard from "@/components/ui/glass-card";
import Button from "@/components/ui/button";
import RadialTimer from "./radial-timer";

import { supabase } from "@/lib/supabase";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useToast } from "@/components/providers/toast-provider";
import { usePreferencesStore } from "@/store/preferences-store";
import { playChime } from "@/lib/sound";

const DURATION_OPTIONS = [25, 45, 60, 90];

export default function FocusTimer() {
  const { user } = useCurrentUser();
  const { toast } = useToast();
  const defaultFocusMinutes = usePreferencesStore((s) => s.defaultFocusMinutes);
  const focusSound = usePreferencesStore((s) => s.focusSound);

  const [minutes, setMinutes] = useState(defaultFocusMinutes);
  const [secondsLeft, setSecondsLeft] = useState(minutes * 60);
  const [running, setRunning] = useState(false);
  const [saving, setSaving] = useState(false);

  const notStarted = secondsLeft === minutes * 60;

  useEffect(() => {
    if (!running && secondsLeft === minutes * 60) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMinutes(defaultFocusMinutes);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultFocusMinutes]);

  // Changing the duration before starting resets the countdown to match.
  useEffect(() => {
    if (!running && secondsLeft === minutes * 60) return;
    if (!running) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSecondsLeft(minutes * 60);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minutes]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (running && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [running, secondsLeft]);

  // Auto-save the session once the countdown reaches zero.
  useEffect(() => {
    if (running && secondsLeft === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRunning(false);
      if (focusSound) playChime();
      saveSession(minutes);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, running]);

  async function saveSession(actualMinutes: number) {
    if (!user || actualMinutes <= 0) return;

    setSaving(true);

    try {
      const { error } = await supabase.from("focus_sessions").insert({
        user_id: user.id,
        session_name: "Deep Work",
        duration_minutes: actualMinutes,
        completed: true,
      });

      if (error) throw error;

      toast(`Logged a ${actualMinutes}-minute focus session.`, "success");
    } catch (error) {
      console.error(error);
      toast("Couldn't save that session — please try again.", "error");
    } finally {
      setSaving(false);
    }
  }

  function finishSession() {
    // Log only the time actually spent, not the full duration selected.
    const elapsedMinutes = minutes - Math.floor(secondsLeft / 60);
    setRunning(false);
    saveSession(elapsedMinutes);
  }

  function resetTimer() {
    setRunning(false);
    setSecondsLeft(minutes * 60);
  }

  return (
    <GlassCard className="p-10 text-center">
      <h1 className="font-display text-4xl font-bold">Focus Engine</h1>

      {notStarted && (
        <div className="mt-6 flex justify-center gap-2">
          {DURATION_OPTIONS.map((option) => (
            <button
              key={option}
              onClick={() => setMinutes(option)}
              className={`rounded-xl border px-4 py-2 font-mono text-sm transition ${
                minutes === option
                  ? "border-amber-400/50 bg-amber-400/10 text-amber-300"
                  : "border-white/10 text-white/60 hover:bg-white/5"
              }`}
            >
              {option}m
            </button>
          ))}
        </div>
      )}

      <div className="mt-10 flex justify-center">
        <RadialTimer secondsLeft={secondsLeft} totalSeconds={minutes * 60} />
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Button onClick={() => setRunning(true)} disabled={secondsLeft === 0 || running}>
          Start
        </Button>

        <Button variant="secondary" onClick={() => setRunning(false)} disabled={!running}>
          Pause
        </Button>

        <Button variant="secondary" onClick={resetTimer} disabled={notStarted}>
          Reset
        </Button>

        <Button onClick={finishSession} disabled={saving || notStarted}>
          {saving ? "Saving..." : "Complete"}
        </Button>
      </div>
    </GlassCard>
  );
}
