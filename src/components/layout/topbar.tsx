"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, Search, LogOut, CheckSquare, Target } from "lucide-react";

import { supabase } from "@/lib/supabase";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useUIStore } from "@/store/ui-store";

interface SearchResult {
  id: string;
  title: string;
  type: "task" | "goal";
}

export default function Topbar() {
  const router = useRouter();
  const { user } = useCurrentUser();
  const openMobileNav = useUIStore((state) => state.openMobileNav);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/auth";
  }

  useEffect(() => {
    if (!user || !query.trim()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      const [tasks, goals] = await Promise.all([
        supabase
          .from("tasks")
          .select("id, title")
          .eq("user_id", user.id)
          .ilike("title", `%${query}%`)
          .limit(4),
        supabase
          .from("goals")
          .select("id, title")
          .eq("user_id", user.id)
          .ilike("title", `%${query}%`)
          .limit(4),
      ]);

      setResults([
        ...(tasks.data || []).map((t) => ({ ...t, type: "task" as const })),
        ...(goals.data || []).map((g) => ({ ...g, type: "goal" as const })),
      ]);
    }, 250);

    return () => clearTimeout(timeout);
  }, [query, user]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowResults(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function goToResult(type: "task" | "goal") {
    setShowResults(false);
    setQuery("");
    router.push(type === "task" ? "/tasks" : "/goals");
  }

  return (
    <header className="flex items-center justify-between border-b border-white/10 px-4 py-6 md:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={openMobileNav}
          aria-label="Open navigation"
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 transition hover:bg-white/10 lg:hidden"
        >
          <Menu size={18} />
        </button>

        <div>
          <h2 className="font-display text-xl font-semibold">
            Mission Control
          </h2>

          <p className="hidden text-sm text-white/50 sm:block">
            Engineer your future deliberately.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div ref={containerRef} className="relative hidden md:block">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
            <Search size={18} className="text-white/40" />

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setShowResults(true)}
              placeholder="Search tasks & goals..."
              className="w-48 bg-transparent text-sm outline-none placeholder:text-white/30"
            />
          </div>

          {showResults && query.trim() && (
            <div className="absolute right-0 top-full z-20 mt-2 w-72 overflow-hidden rounded-2xl border border-white/10 bg-black/95 backdrop-blur-xl shadow-2xl shadow-black/40">
              {results.length === 0 && (
                <p className="px-4 py-4 text-sm text-white/40">
                  No matches for &ldquo;{query}&rdquo;
                </p>
              )}

              {results.map((result) => (
                <button
                  key={`${result.type}-${result.id}`}
                  onClick={() => goToResult(result.type)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition hover:bg-white/5"
                >
                  {result.type === "task" ? (
                    <CheckSquare size={14} className="shrink-0 text-amber-400" />
                  ) : (
                    <Target size={14} className="shrink-0 text-violet-400" />
                  )}

                  <span className="truncate">{result.title}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300 transition hover:bg-red-500/20"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
