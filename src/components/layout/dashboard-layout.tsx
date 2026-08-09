"use client";

import { ReactNode } from "react";

import Sidebar from "./sidebar";
import Topbar from "./topbar";

import SettingsModal from "@/components/settings/settings-modal";

import { useSettingsStore } from "@/store/settings-store";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {

  const open =
    useSettingsStore(
      (state) => state.open
    );

  const closeSettings =
    useSettingsStore(
      (state) => state.closeSettings
    );

  return (
    <div className="flex min-h-screen bg-black text-white">

      <Sidebar />

      <div className="flex flex-1 flex-col">

        <Topbar />

        <main className="flex-1 overflow-x-hidden p-4 md:p-8">
          {children}
        </main>

      </div>

      <SettingsModal
        open={open}
        onClose={closeSettings}
      />

    </div>
  );
}