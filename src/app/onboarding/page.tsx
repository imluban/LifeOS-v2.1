"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import DashboardLayout from "@/components/layout/dashboard-layout";
import GlassCard from "@/components/ui/glass-card";
import Button from "@/components/ui/button";
import ProtectedRoute from "@/components/auth/protected-route";

import { supabase } from "@/lib/supabase";

export default function OnboardingPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [ambitionLevel, setAmbitionLevel] = useState("");
  const [primaryGoal, setPrimaryGoal] = useState("");
  const [wealthTarget, setWealthTarget] = useState("");
  const [focusType, setFocusType] = useState("");

  async function handleSubmit() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        full_name: fullName,
        ambition_level: ambitionLevel,
        primary_goal: primaryGoal,
        wealth_target: wealthTarget,
        focus_type: focusType,
      });

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <ProtectedRoute>
    <DashboardLayout>
      <div className="mx-auto max-w-3xl">
        <GlassCard className="p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight">
              Build Your Identity Layer
            </h1>

            <p className="mt-3 text-white/50">
              Configure the strategic foundation of your LifeOS.
            </p>
          </div>

          <div className="space-y-5">
            <input
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 outline-none placeholder:text-white/30"
            />

            <input
              placeholder="Ambition Level (Elite, High Performer, Founder...)"
              value={ambitionLevel}
              onChange={(e) => setAmbitionLevel(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 outline-none placeholder:text-white/30"
            />

            <input
              placeholder="Primary Goal"
              value={primaryGoal}
              onChange={(e) => setPrimaryGoal(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 outline-none placeholder:text-white/30"
            />

            <input
              placeholder="Wealth Target"
              value={wealthTarget}
              onChange={(e) => setWealthTarget(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 outline-none placeholder:text-white/30"
            />

            <input
              placeholder="Focus Type"
              value={focusType}
              onChange={(e) => setFocusType(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 outline-none placeholder:text-white/30"
            />

            <div className="pt-4">
              <Button onClick={handleSubmit}>
                Initialize LifeOS
              </Button>
            </div>
          </div>
        </GlassCard>
      </div>
    </DashboardLayout>
    </ProtectedRoute>
  );
}