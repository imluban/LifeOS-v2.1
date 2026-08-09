"use client";

import DashboardLayout from "@/components/layout/dashboard-layout";
import WeeklyReport from "@/components/reports/weekly-report";
import ProtectedRoute from "@/components/auth/protected-route";

export default function ReportsPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <WeeklyReport />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
