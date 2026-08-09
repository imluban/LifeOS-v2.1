"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

import Button from "@/components/ui/button";
import GlassCard from "@/components/ui/glass-card";

export default function AuthPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  async function signUp() {
    if (!email || !password) return;

    setLoading(true);
    setError("");
    setInfo("");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    // If email confirmation is required, there won't be a session yet.
    if (!data.session) {
      setInfo("Check your email to confirm your account.");
      return;
    }

    router.push("/dashboard");
  }

  async function signIn() {
    if (!email || !password) return;

    setLoading(true);
    setError("");
    setInfo("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
      <GlassCard className="w-full max-w-md p-8">
        <h1 className="text-4xl font-bold tracking-tight">Enter LifeOS</h1>

        <p className="mt-3 text-white/50">
          Access your strategic operating system.
        </p>

        <div className="mt-8 space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 outline-none placeholder:text-white/30"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 outline-none placeholder:text-white/30"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-sm text-red-400">{error}</p>}
          {info && <p className="text-sm text-emerald-400">{info}</p>}

          <div className="flex gap-3 pt-4">
            <Button className="flex-1" onClick={signIn} disabled={loading}>
              {loading ? "Please wait..." : "Sign In"}
            </Button>

            <Button
              variant="secondary"
              className="flex-1"
              onClick={signUp}
              disabled={loading}
            >
              {loading ? "Please wait..." : "Sign Up"}
            </Button>
          </div>
        </div>
      </GlassCard>
    </main>
  );
}
