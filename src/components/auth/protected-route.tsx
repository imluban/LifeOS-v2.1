"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-black text-white">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-violet-400" />
        <p className="font-mono text-sm uppercase tracking-[0.3em] text-white/40">
          Booting LifeOS
        </p>
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}
