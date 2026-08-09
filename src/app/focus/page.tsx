"use client";

import DashboardLayout from "@/components/layout/dashboard-layout";
import FocusTimer from "@/components/focus/focus-timer";
import ProtectedRoute from "@/components/auth/protected-route";
import Link from "next/link";

export default function FocusPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="mx-auto max-w-5xl">
          <Link
            href="/focus/deep"
            className="mb-8 inline-flex rounded-2xl border border-white/10 px-5 py-3 transition hover:bg-white/5"
          >
            Enter Deep Focus Mode
          </Link>
          <FocusTimer />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
