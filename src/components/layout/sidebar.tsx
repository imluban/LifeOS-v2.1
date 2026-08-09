"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Target,
  Brain,
  Timer,
  Settings,
  CheckSquare,
  ClipboardCheck,
  Command,
  FileText,
  X,
} from "lucide-react";

import { useSettingsStore } from "@/store/settings-store";
import { useUIStore } from "@/store/ui-store";

const links = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { name: "Check-In", href: "/checkin", icon: ClipboardCheck },
  { name: "Command Center", href: "/command-center", icon: Command },
  { name: "Goals", icon: Target, href: "/goals" },
  { name: "Focus", icon: Timer, href: "/focus" },
  { name: "AI Planner", icon: Brain, href: "/ai-planner" },
  { name: "Execution", icon: CheckSquare, href: "/tasks" },
  { name: "Reports", icon: FileText, href: "/reports" },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const openSettings = useSettingsStore((state) => state.openSettings);

  return (
    <>
      <div className="border-b border-white/10 px-8 py-8">
        <h1 className="font-display text-3xl font-bold tracking-tight">
          LifeOS
        </h1>

        <p className="mt-2 text-sm text-white/50">
          Human Optimization System
        </p>
      </div>

      <nav className="flex flex-1 flex-col">
        <div className="flex flex-col gap-2 p-4">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive =
              pathname === link.href || pathname?.startsWith(`${link.href}/`);

            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={onNavigate}
                className={`flex items-center gap-4 rounded-2xl px-5 py-4 text-left transition-all ${
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={20} className={isActive ? "text-amber-400" : ""} />
                <span className="text-sm font-medium">{link.name}</span>
              </Link>
            );
          })}
        </div>

        <div className="mt-auto p-4">
          <button
            onClick={() => {
              openSettings();
              onNavigate?.();
            }}
            className="flex w-full items-center gap-4 rounded-2xl px-5 py-4 text-left text-white/70 transition-all hover:bg-white/5 hover:text-white"
          >
            <Settings size={20} />
            <span className="text-sm font-medium">Settings</span>
          </button>
        </div>
      </nav>
    </>
  );
}

export default function Sidebar() {
  const mobileNavOpen = useUIStore((state) => state.mobileNavOpen);
  const closeMobileNav = useUIStore((state) => state.closeMobileNav);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-[280px] border-r border-white/10 bg-black/40 backdrop-blur-xl lg:flex lg:flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-40 lg:hidden ${
          mobileNavOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div
          onClick={closeMobileNav}
          className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
            mobileNavOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        <aside
          className={`absolute left-0 top-0 flex h-full w-[280px] flex-col border-r border-white/10 bg-black/95 backdrop-blur-xl transition-transform duration-300 ${
            mobileNavOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <button
            onClick={closeMobileNav}
            aria-label="Close navigation"
            className="absolute right-4 top-4 rounded-xl border border-white/10 p-2 text-white/60 transition hover:text-white"
          >
            <X size={18} />
          </button>

          <SidebarContent onNavigate={closeMobileNav} />
        </aside>
      </div>
    </>
  );
}
