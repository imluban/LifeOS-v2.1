"use client";

import { useAuthStore } from "@/store/auth-store";

/**
 * Reads the current user from the global auth store (populated once by
 * AuthProvider on load and kept in sync via onAuthStateChange).
 *
 * Prefer this over calling supabase.auth.getUser() in individual
 * components — that pattern forces every widget to make its own network
 * round trip on mount, which is what caused the dashboard to feel slow
 * and "flash" empty states before this fix.
 */
export function useCurrentUser() {
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);

  return { user, loading };
}
