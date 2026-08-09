"use client";

import DashboardLayout from "@/components/layout/dashboard-layout";
import ProtectedRoute from "@/components/auth/protected-route";

import GoalsWidget from "@/components/command-center/goals-widget";
import TasksWidget from "@/components/command-center/tasks-widget";

import ExecutionWidget from "@/components/command-center/execution-widget";
import StreakWidget from "@/components/command-center/streak-widget";
import FocusWidget from "@/components/command-center/focus-widget";

import RecentFocusWidget from "@/components/command-center/recent-focus-widget";
import TodaysMission from "@/components/command-center/todays-mission";

import AIAdvisor from "@/components/dashboard/ai-advisor";

export default function CommandCenterPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-8">
          <div>
            <h1 className="font-display text-3xl font-bold md:text-4xl">
              Command Center
            </h1>

            <p className="mt-2 text-white/50">
              Your entire life operating system, in one view.
            </p>
          </div>

          <TodaysMission />

          <AIAdvisor />

          <div className="grid gap-6 md:grid-cols-3">
            <ExecutionWidget />
            <StreakWidget />
            <FocusWidget />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <GoalsWidget />
            <TasksWidget />
          </div>

          <RecentFocusWidget />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
