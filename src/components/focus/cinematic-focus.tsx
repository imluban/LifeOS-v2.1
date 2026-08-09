"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { supabase } from "@/lib/supabase";
import { apiFetch } from "@/lib/api-client";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useToast } from "@/components/providers/toast-provider";
import { usePreferencesStore } from "@/store/preferences-store";
import { playChime } from "@/lib/sound";
import Button from "@/components/ui/button";
import RadialTimer from "./radial-timer";

const SESSION_MINUTES = 90;

export default function CinematicFocus() {
  const { user } = useCurrentUser();
  const { toast } = useToast();
  const focusSound = usePreferencesStore((s) => s.focusSound);

  const [sessionGoal, setSessionGoal] = useState("");
  const [latestObjective, setLatestObjective] = useState("");
  const [running, setRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(SESSION_MINUTES * 60);

  const notStarted = secondsLeft === SESSION_MINUTES * 60;

  useEffect(() => {
    if (!user) return;
    loadObjective();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (running && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [running, secondsLeft]);

  // Auto-save the session once the countdown finishes.
  useEffect(() => {
    if (running && secondsLeft === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRunning(false);
      if (focusSound) playChime();
      saveSession(SESSION_MINUTES);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, running]);

  async function saveSession(actualMinutes: number) {
    if (!user || actualMinutes <= 0) return;

    try {
      const { error } = await supabase.from("focus_sessions").insert({
        user_id: user.id,
        session_name: sessionGoal || "Deep Work",
        duration_minutes: actualMinutes,
        completed: true,
      });

      if (error) throw error;

      toast(`Session logged — ${actualMinutes} minutes of deep work.`, "success");
    } catch (error) {
      console.error(error);
      toast("Couldn't log that session.", "error");
    }
  }

  function endSession() {
    const elapsedMinutes = SESSION_MINUTES - Math.floor(secondsLeft / 60);
    setRunning(false);
    saveSession(elapsedMinutes);
  }

  async function saveObjective() {
    if (!sessionGoal.trim()) return;

    try {
      await apiFetch("/api/focus-objective", {
        method: "POST",
        body: JSON.stringify({ objective: sessionGoal }),
      });

      await loadObjective();
      setSessionGoal("");
      toast("Objective set.", "success");
    } catch (error) {
      console.error(error);
      toast("Couldn't save your objective.", "error");
    }
  }

  async function loadObjective() {
    if (!user) return;

    const result = await supabase
      .from("focus_objectives")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1);

    if (result.data && result.data.length > 0) {
      setLatestObjective(result.data[0].objective);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,166,35,0.06),transparent_70%)]" />

      <div className="pointer-events-none absolute inset-0 opacity-[0.03] [background-image:linear-gradient(rgba(255,255,255,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.6)_1px,transparent_1px)] [background-size:48px_48px]" />

      <div className="relative flex min-h-screen flex-col items-center justify-center px-8 py-16">
        <Link
          href="/focus"
          className="absolute left-8 top-8 text-sm text-white/50 transition hover:text-white"
        >
          ← Exit deep focus
        </Link>

        <h1 className="font-display text-6xl font-bold tracking-tight md:text-7xl">
          Deep Work
        </h1>

        <p className="mt-4 text-white/50">
          Eliminate distraction. Execute with intention.
        </p>

        <div className="mt-10 flex w-full max-w-xl gap-3">
          <input
            value={sessionGoal}
            onChange={(e) => setSessionGoal(e.target.value)}
            placeholder="Session objective..."
            className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 outline-none placeholder:text-white/30"
          />

          <Button onClick={saveObjective} disabled={!sessionGoal.trim()}>
            Set
          </Button>
        </div>

        <div className="mt-12">
          <RadialTimer
            secondsLeft={secondsLeft}
            totalSeconds={SESSION_MINUTES * 60}
            size={360}
          />
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button onClick={() => setRunning(true)} disabled={secondsLeft === 0 || running}>
            Start
          </Button>

          <Button variant="secondary" onClick={() => setRunning(false)} disabled={!running}>
            Pause
          </Button>

          <Button
            variant="secondary"
            onClick={() => {
              setRunning(false);
              setSecondsLeft(SESSION_MINUTES * 60);
            }}
            disabled={notStarted}
          >
            Reset
          </Button>

          <Button onClick={endSession} disabled={notStarted}>
            End & Save
          </Button>
        </div>

        <p className="mt-12 text-xs uppercase tracking-[0.3em] text-white/30">
          Current Mission
        </p>

        <p className="mt-2 text-xl">{latestObjective || "No mission set"}</p>
      </div>
    </div>
  );
}
