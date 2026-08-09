"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

import GlassCard from "@/components/ui/glass-card";

const data = [
  { day: "Mon", score: 42 },
  { day: "Tue", score: 58 },
  { day: "Wed", score: 67 },
  { day: "Thu", score: 72 },
  { day: "Fri", score: 81 },
  { day: "Sat", score: 88 },
  { day: "Sun", score: 92 },
];

export default function PerformanceChart() {
  return (
    <GlassCard className="p-6">
      <div className="mb-8">
        <h3 className="text-xl font-semibold">
          Execution Velocity
        </h3>

        <p className="mt-2 text-sm text-white/50">
          Sample trajectory — daily history tracking is coming soon
        </p>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient
                id="colorScore"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#7c3aed"
                  stopOpacity={0.8}
                />

                <stop
                  offset="100%"
                  stopColor="#7c3aed"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="day"
              stroke="rgba(255,255,255,0.3)"
            />

            <Tooltip
              contentStyle={{
                background: "#111",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "16px",
              }}
            />

            <Area
              type="monotone"
              dataKey="score"
              stroke="#7c3aed"
              strokeWidth={3}
              fill="url(#colorScore)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}