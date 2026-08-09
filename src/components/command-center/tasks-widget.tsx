"use client";

import { useEffect, useState } from "react";
import { CheckSquare } from "lucide-react";

import { supabase } from "@/lib/supabase";
import GlassCard from "@/components/ui/glass-card";
import Skeleton from "@/components/ui/skeleton";
import { useCurrentUser } from "@/hooks/use-current-user";

interface Task {
  id: string;
  title: string;
}

export default function TasksWidget() {
  const { user } = useCurrentUser();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    async function loadTasks() {
      const { data } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user!.id)
        .eq("status", "pending")
        .limit(5);

      if (!cancelled) {
        setTasks(data || []);
        setLoading(false);
      }
    }

    loadTasks();

    return () => {
      cancelled = true;
    };
  }, [user]);

  return (
    <GlassCard className="p-6">
      <div className="mb-4 flex items-center gap-2">
        <CheckSquare size={16} className="text-amber-400" />
        <h2 className="font-display text-xl font-bold">Priority Tasks</h2>
      </div>

      <div className="space-y-3">
        {loading && (
          <>
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-5 w-1/2" />
          </>
        )}

        {!loading && tasks.length === 0 && (
          <p className="text-sm text-white/40">No pending tasks.</p>
        )}

        {tasks.map((task) => (
          <div key={task.id} className="text-sm text-white/80">
            {task.title}
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
