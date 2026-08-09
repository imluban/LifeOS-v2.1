import GlassCard from "@/components/ui/glass-card";

export default function FutureTimeline() {
  return (
    <GlassCard className="p-6">
      <div className="mb-6">
        <h3 className="text-2xl font-bold">
          Future Projection
        </h3>

        <p className="mt-2 text-sm text-white/50">
          Illustrative example — real trajectory modeling is coming soon
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-white/60">
            Financial Freedom
          </span>

          <span className="font-semibold text-emerald-400">
            2032
          </span>
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-white/5">
          <div className="h-full w-[68%] rounded-full bg-violet-500" />
        </div>

        <div className="flex justify-between text-sm text-white/40">
          <span>Current Trajectory</span>

          <span>68% Alignment</span>
        </div>
      </div>
    </GlassCard>
  );
}