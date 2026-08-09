"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Compass,
  Timer,
  Brain,
  Palette,
  Database,
  X,
  Download,
  Trash2,
  AlertTriangle,
} from "lucide-react";

import Button from "@/components/ui/button";
import SettingsSelect from "./settings-select";

import { getProfile, saveProfile } from "@/lib/profile";
import { supabase } from "@/lib/supabase";
import { apiFetch } from "@/lib/api-client";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useToast } from "@/components/providers/toast-provider";
import {
  usePreferencesStore,
  THEME_PRESETS,
  AI_TONES,
  type ThemePreset,
  type AITone,
} from "@/store/preferences-store";

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "vision", label: "Vision", icon: Compass },
  { id: "focus", label: "Focus", icon: Timer },
  { id: "ai", label: "AI", icon: Brain },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "data", label: "Data", icon: Database },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function SettingsModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const { user } = useCurrentUser();
  const { toast } = useToast();

  const [tab, setTab] = useState<TabId>("profile");
  const [loading, setLoading] = useState(false);

  // Profile
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("");

  // Vision
  const [primaryGoal, setPrimaryGoal] = useState("");
  const [ambitionLevel, setAmbitionLevel] = useState("emerging");
  const [vision, setVision] = useState("");
  const [lifeMission, setLifeMission] = useState("");
  const [wealthTarget, setWealthTarget] = useState("");

  // Focus
  const [focusType, setFocusType] = useState("deep_work");

  // Preferences (persisted to localStorage via store)
  const theme = usePreferencesStore((s) => s.theme);
  const setTheme = usePreferencesStore((s) => s.setTheme);
  const aiTone = usePreferencesStore((s) => s.aiTone);
  const setAITone = usePreferencesStore((s) => s.setAITone);
  const focusSound = usePreferencesStore((s) => s.focusSound);
  const setFocusSound = usePreferencesStore((s) => s.setFocusSound);
  const defaultFocusMinutes = usePreferencesStore((s) => s.defaultFocusMinutes);
  const setDefaultFocusMinutes = usePreferencesStore(
    (s) => s.setDefaultFocusMinutes
  );

  // Data tab destructive actions
  const [confirmingClear, setConfirmingClear] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [exporting, setExporting] = useState(false);
  const [destructiveLoading, setDestructiveLoading] = useState(false);

  async function loadProfile() {
    const profile = await getProfile();

    if (!profile) return;

    setFullName(profile.full_name || "");
    setRole(profile.role || "");
    setPrimaryGoal(profile.primary_goal || "");
    setAmbitionLevel(profile.ambition_level || "emerging");
    setVision(profile.vision || "");
    setLifeMission(profile.life_mission || "");
    setWealthTarget(profile.wealth_target || profile.net_worth_goal || "");
    setFocusType(profile.focus_type || "deep_work");
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (open) loadProfile();
  }, [open]);

  async function handleSaveProfile() {
    try {
      setLoading(true);

      await saveProfile({ full_name: fullName, role });

      toast("Profile saved.", "success");
    } catch (error) {
      toast(
        error instanceof Error ? error.message : "Failed to save profile.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveVision() {
    try {
      setLoading(true);

      await saveProfile({
        primary_goal: primaryGoal,
        ambition_level: ambitionLevel,
        vision,
        life_mission: lifeMission,
        // Written to both columns for backwards compatibility with data
        // saved under either the old or new field name.
        wealth_target: wealthTarget,
        net_worth_goal: wealthTarget,
      });

      toast("Vision saved.", "success");
    } catch (error) {
      toast(
        error instanceof Error ? error.message : "Failed to save vision.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveFocusType(nextFocusType: string) {
    setFocusType(nextFocusType);

    try {
      await saveProfile({ focus_type: nextFocusType });
    } catch (error) {
      toast(
        error instanceof Error
          ? error.message
          : "Failed to save focus preference.",
        "error"
      );
    }
  }

  async function handleExportData() {
    if (!user) return;

    setExporting(true);

    try {
      const tables = [
        "profiles",
        "tasks",
        "goals",
        "streaks",
        "user_stats",
        "focus_sessions",
        "focus_objectives",
        "daily_checkins",
      ];

      const results = await Promise.all(
        tables.map((table) =>
          table === "profiles"
            ? supabase.from(table).select("*").eq("id", user.id)
            : supabase.from(table).select("*").eq("user_id", user.id)
        )
      );

      const exportData = Object.fromEntries(
        tables.map((table, i) => [table, results[i].data || []])
      );

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `lifeos-export-${new Date().toISOString().slice(0, 10)}.json`;
      link.click();

      URL.revokeObjectURL(url);

      toast("Your data export has started downloading.", "success");
    } catch (error) {
      console.error(error);
      toast("Couldn't export your data — please try again.", "error");
    } finally {
      setExporting(false);
    }
  }

  async function handleClearData() {
    setDestructiveLoading(true);

    try {
      await apiFetch("/api/clear-data", { method: "POST", body: "{}" });

      toast("All your content has been cleared.", "success");
      setConfirmingClear(false);
    } catch (error) {
      toast(
        error instanceof Error ? error.message : "Failed to clear data.",
        "error"
      );
    } finally {
      setDestructiveLoading(false);
    }
  }

  async function handleDeleteAccount() {
    if (deleteConfirmText !== "DELETE") return;

    setDestructiveLoading(true);

    try {
      await apiFetch("/api/delete-account", { method: "POST", body: "{}" });

      onClose();
      router.push("/auth");
    } catch (error) {
      toast(
        error instanceof Error ? error.message : "Failed to delete account.",
        "error"
      );
      setDestructiveLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      <div className="relative flex h-[80vh] w-full max-w-3xl overflow-hidden rounded-[24px] border border-white/10 bg-black/95 shadow-2xl shadow-black/50 backdrop-blur-xl">
        <button
          onClick={onClose}
          aria-label="Close settings"
          className="absolute right-4 top-4 z-10 rounded-xl border border-white/10 p-2 text-white/50 transition hover:text-white"
        >
          <X size={18} />
        </button>

        {/* Tab rail */}
        <div className="w-48 shrink-0 border-r border-white/10 p-4">
          <h2 className="font-display mb-4 px-2 text-lg font-bold">
            Settings
          </h2>

          <div className="flex flex-col gap-1">
            {TABS.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${
                    tab === t.id
                      ? "bg-white/10 text-white"
                      : "text-white/50 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon size={16} />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto p-8">
          {tab === "profile" && (
            <div className="space-y-5">
              <div>
                <h3 className="font-display text-2xl font-bold">Profile</h3>
                <p className="mt-1 text-sm text-white/50">
                  How you&apos;re identified across LifeOS.
                </p>
              </div>

              <label className="block">
                <span className="mb-2 block text-sm text-white/50">
                  Full name
                </span>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 p-3 outline-none"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm text-white/50">Role</span>
                <input
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Founder, Engineer, Student..."
                  className="w-full rounded-xl border border-white/10 bg-white/5 p-3 outline-none placeholder:text-white/30"
                />
              </label>

              <Button onClick={handleSaveProfile} disabled={loading}>
                {loading ? "Saving..." : "Save Profile"}
              </Button>
            </div>
          )}

          {tab === "vision" && (
            <div className="space-y-5">
              <div>
                <h3 className="font-display text-2xl font-bold">Vision</h3>
                <p className="mt-1 text-sm text-white/50">
                  The long-range target everything else executes toward.
                </p>
              </div>

              <label className="block">
                <span className="mb-2 block text-sm text-white/50">
                  Primary goal
                </span>
                <input
                  value={primaryGoal}
                  onChange={(e) => setPrimaryGoal(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 p-3 outline-none"
                />
              </label>

              <SettingsSelect
                label="Ambition level"
                value={ambitionLevel}
                onChange={setAmbitionLevel}
                options={[
                  { value: "emerging", label: "Emerging" },
                  { value: "high-performer", label: "High Performer" },
                  { value: "elite", label: "Elite" },
                  { value: "founder", label: "Founder" },
                ]}
              />

              <label className="block">
                <span className="mb-2 block text-sm text-white/50">
                  Wealth target
                </span>
                <input
                  value={wealthTarget}
                  onChange={(e) => setWealthTarget(e.target.value)}
                  placeholder="$1,000,000"
                  className="w-full rounded-xl border border-white/10 bg-white/5 p-3 outline-none placeholder:text-white/30"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm text-white/50">
                  Vision
                </span>
                <textarea
                  value={vision}
                  onChange={(e) => setVision(e.target.value)}
                  className="min-h-[90px] w-full rounded-xl border border-white/10 bg-white/5 p-3 outline-none"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm text-white/50">
                  Life mission
                </span>
                <textarea
                  value={lifeMission}
                  onChange={(e) => setLifeMission(e.target.value)}
                  className="min-h-[90px] w-full rounded-xl border border-white/10 bg-white/5 p-3 outline-none"
                />
              </label>

              <Button onClick={handleSaveVision} disabled={loading}>
                {loading ? "Saving..." : "Save Vision"}
              </Button>
            </div>
          )}

          {tab === "focus" && (
            <div className="space-y-5">
              <div>
                <h3 className="font-display text-2xl font-bold">Focus</h3>
                <p className="mt-1 text-sm text-white/50">
                  How your deep work sessions behave.
                </p>
              </div>

              <SettingsSelect
                label="Focus type"
                value={focusType}
                onChange={handleSaveFocusType}
                options={[
                  { value: "deep_work", label: "Deep Work" },
                  { value: "sprints", label: "Sprints" },
                  { value: "creative", label: "Creative" },
                  { value: "analytical", label: "Analytical" },
                ]}
              />

              <SettingsSelect
                label="Default session length"
                value={String(defaultFocusMinutes)}
                onChange={(v) => setDefaultFocusMinutes(Number(v))}
                options={[
                  { value: "25", label: "25 minutes" },
                  { value: "45", label: "45 minutes" },
                  { value: "60", label: "60 minutes" },
                  { value: "90", label: "90 minutes" },
                ]}
              />

              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
                <div>
                  <p className="text-sm font-medium">Completion sound</p>
                  <p className="text-xs text-white/40">
                    Play a chime when a focus session ends.
                  </p>
                </div>

                <button
                  onClick={() => setFocusSound(!focusSound)}
                  aria-pressed={focusSound}
                  className={`h-6 w-11 shrink-0 rounded-full transition ${
                    focusSound ? "bg-amber-400" : "bg-white/10"
                  }`}
                >
                  <span
                    className={`block h-5 w-5 translate-y-0.5 rounded-full bg-black transition-transform ${
                      focusSound ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {tab === "ai" && (
            <div className="space-y-5">
              <div>
                <h3 className="font-display text-2xl font-bold">
                  AI Advisor
                </h3>
                <p className="mt-1 text-sm text-white/50">
                  How your AI advisor talks to you.
                </p>
              </div>

              <div className="space-y-3">
                {(Object.keys(AI_TONES) as AITone[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => setAITone(key)}
                    className={`w-full rounded-xl border p-4 text-left transition ${
                      aiTone === key
                        ? "border-violet-400/50 bg-violet-400/10"
                        : "border-white/10 bg-white/5 hover:bg-white/[0.07]"
                    }`}
                  >
                    <p className="text-sm font-medium">
                      {AI_TONES[key].label}
                    </p>
                    <p className="mt-1 text-xs text-white/40">
                      {AI_TONES[key].description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {tab === "appearance" && (
            <div className="space-y-5">
              <div>
                <h3 className="font-display text-2xl font-bold">
                  Appearance
                </h3>
                <p className="mt-1 text-sm text-white/50">
                  Pick the accent colors used across LifeOS.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {(Object.keys(THEME_PRESETS) as ThemePreset[]).map((key) => {
                  const preset = THEME_PRESETS[key];

                  return (
                    <button
                      key={key}
                      onClick={() => setTheme(key)}
                      className={`rounded-xl border p-4 text-left transition ${
                        theme === key
                          ? "border-white/40 bg-white/10"
                          : "border-white/10 bg-white/5 hover:bg-white/[0.07]"
                      }`}
                    >
                      <div className="mb-3 flex gap-2">
                        <span
                          className="h-6 w-6 rounded-full"
                          style={{ background: preset.primary }}
                        />
                        <span
                          className="h-6 w-6 rounded-full"
                          style={{ background: preset.secondary }}
                        />
                      </div>
                      <p className="text-sm font-medium">{preset.label}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {tab === "data" && (
            <div className="space-y-6">
              <div>
                <h3 className="font-display text-2xl font-bold">
                  Your Data
                </h3>
                <p className="mt-1 text-sm text-white/50">
                  Export or permanently remove your data.
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium">Export your data</p>
                    <p className="text-xs text-white/40">
                      Download everything as a JSON file.
                    </p>
                  </div>

                  <Button
                    variant="secondary"
                    onClick={handleExportData}
                    disabled={exporting}
                  >
                    <Download size={14} className="mr-2 inline" />
                    {exporting ? "Exporting..." : "Export"}
                  </Button>
                </div>
              </div>

              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-amber-200">
                      Clear my data
                    </p>
                    <p className="text-xs text-white/40">
                      Wipes tasks, goals, and history. Keeps your account.
                    </p>
                  </div>

                  {!confirmingClear ? (
                    <Button
                      variant="secondary"
                      onClick={() => setConfirmingClear(true)}
                    >
                      Clear Data
                    </Button>
                  ) : null}
                </div>

                {confirmingClear && (
                  <div className="mt-4 flex items-center gap-3 rounded-lg border border-amber-500/20 bg-black/30 p-3">
                    <AlertTriangle size={16} className="shrink-0 text-amber-400" />
                    <p className="flex-1 text-xs text-white/60">
                      This can&apos;t be undone. Are you sure?
                    </p>
                    <Button
                      variant="secondary"
                      onClick={() => setConfirmingClear(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleClearData}
                      disabled={destructiveLoading}
                    >
                      {destructiveLoading ? "Clearing..." : "Confirm"}
                    </Button>
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-red-300">
                      Delete account
                    </p>
                    <p className="text-xs text-white/40">
                      Permanently deletes your account and all data.
                    </p>
                  </div>

                  {!confirmingDelete ? (
                    <Button
                      variant="secondary"
                      onClick={() => setConfirmingDelete(true)}
                    >
                      <Trash2 size={14} className="mr-2 inline" />
                      Delete
                    </Button>
                  ) : null}
                </div>

                {confirmingDelete && (
                  <div className="mt-4 space-y-3 rounded-lg border border-red-500/20 bg-black/30 p-3">
                    <p className="text-xs text-white/60">
                      Type <span className="font-mono text-red-300">DELETE</span>{" "}
                      to permanently delete your account.
                    </p>

                    <input
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-black/40 p-2 text-sm outline-none"
                    />

                    <div className="flex justify-end gap-3">
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setConfirmingDelete(false);
                          setDeleteConfirmText("");
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleDeleteAccount}
                        disabled={
                          deleteConfirmText !== "DELETE" || destructiveLoading
                        }
                      >
                        {destructiveLoading
                          ? "Deleting..."
                          : "Permanently Delete"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
