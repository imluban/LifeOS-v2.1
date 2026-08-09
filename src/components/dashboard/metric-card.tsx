import GlassCard from "@/components/ui/glass-card";
import Skeleton from "@/components/ui/skeleton";

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  loading?: boolean;
  accent?: "violet" | "amber";
}

export default function MetricCard({
  title,
  value,
  change,
  loading = false,
  accent = "violet",
}: MetricCardProps) {
  return (
    <GlassCard className="p-6 transition hover:bg-white/[0.05]">
      <div className="space-y-3">
        <p className="text-sm text-white/50">{title}</p>

        {loading ? (
          <Skeleton className="h-10 w-24" />
        ) : (
          <h3
            className={`font-mono text-4xl font-bold tracking-tight tabular-nums ${
              accent === "amber" ? "text-amber-300" : "text-white"
            }`}
          >
            {value}
          </h3>
        )}

        <p className="text-sm text-white/40">{change}</p>
      </div>
    </GlassCard>
  );
}
