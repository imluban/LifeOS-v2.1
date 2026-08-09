"use client";

import { useState } from "react";
import { FileText } from "lucide-react";

import { apiFetch } from "@/lib/api-client";
import Button from "@/components/ui/button";
import GlassCard from "@/components/ui/glass-card";
import Skeleton from "@/components/ui/skeleton";

export default function WeeklyReport() {
  const [report, setReport] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generateReport() {
    try {
      setLoading(true);
      setError("");

      const data = (await apiFetch("/api/weekly-report", {
        method: "POST",
        body: JSON.stringify({}),
      })) as { report?: string };

      setReport(data.report || "");
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Failed to generate report."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <div className="flex items-center gap-2">
          <FileText size={20} className="text-violet-400" />
          <h1 className="font-display text-4xl font-bold">
            Weekly Executive Report
          </h1>
        </div>

        <p className="mt-2 text-white/50">
          AI-powered analysis of your execution performance.
        </p>
      </div>

      <Button onClick={generateReport} disabled={loading}>
        {loading ? "Generating..." : "Generate Report"}
      </Button>

      {error && <p className="text-sm text-red-400">{error}</p>}

      {loading ? (
        <GlassCard className="space-y-3 p-6">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-3/4" />
        </GlassCard>
      ) : (
        <GlassCard className="whitespace-pre-wrap p-6">
          {report || "No report generated yet."}
        </GlassCard>
      )}
    </div>
  );
}
