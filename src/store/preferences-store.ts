"use client";

import { create } from "zustand";

export type ThemePreset = "violet-amber" | "emerald-blue" | "rose-gold";
export type AITone = "direct" | "encouraging" | "analytical";

export const THEME_PRESETS: Record<
  ThemePreset,
  { label: string; primary: string; secondary: string }
> = {
  "violet-amber": {
    label: "Violet / Amber",
    primary: "#7c3aed",
    secondary: "#f5a623",
  },
  "emerald-blue": {
    label: "Emerald / Blue",
    primary: "#34d399",
    secondary: "#3b82f6",
  },
  "rose-gold": {
    label: "Rose / Gold",
    primary: "#fb7185",
    secondary: "#eab308",
  },
};

export const AI_TONES: Record<AITone, { label: string; description: string }> = {
  direct: {
    label: "Direct",
    description: "Short, blunt, no cushioning.",
  },
  encouraging: {
    label: "Encouraging",
    description: "Supportive and motivational.",
  },
  analytical: {
    label: "Analytical",
    description: "Data-driven, dispassionate.",
  },
};

interface PreferencesState {
  theme: ThemePreset;
  aiTone: AITone;
  focusSound: boolean;
  defaultFocusMinutes: number;

  setTheme: (theme: ThemePreset) => void;
  setAITone: (tone: AITone) => void;
  setFocusSound: (enabled: boolean) => void;
  setDefaultFocusMinutes: (minutes: number) => void;
  hydrate: () => void;
}

const STORAGE_KEY = "lifeos-preferences";

function loadFromStorage() {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function persist(state: Partial<PreferencesState>) {
  if (typeof window === "undefined") return;

  const { theme, aiTone, focusSound, defaultFocusMinutes } = state;

  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ theme, aiTone, focusSound, defaultFocusMinutes })
  );
}

export function applyThemeToDocument(theme: ThemePreset) {
  if (typeof document === "undefined") return;

  const preset = THEME_PRESETS[theme];

  document.documentElement.style.setProperty("--accent-violet", preset.primary);
  document.documentElement.style.setProperty("--accent-amber", preset.secondary);
}

export const usePreferencesStore = create<PreferencesState>((set, get) => ({
  theme: "violet-amber",
  aiTone: "direct",
  focusSound: true,
  defaultFocusMinutes: 90,

  setTheme: (theme) => {
    set({ theme });
    applyThemeToDocument(theme);
    persist({ ...get(), theme });
  },

  setAITone: (aiTone) => {
    set({ aiTone });
    persist({ ...get(), aiTone });
  },

  setFocusSound: (focusSound) => {
    set({ focusSound });
    persist({ ...get(), focusSound });
  },

  setDefaultFocusMinutes: (defaultFocusMinutes) => {
    set({ defaultFocusMinutes });
    persist({ ...get(), defaultFocusMinutes });
  },

  hydrate: () => {
    const stored = loadFromStorage();
    if (!stored) return;

    set({
      theme: stored.theme || "violet-amber",
      aiTone: stored.aiTone || "direct",
      focusSound: stored.focusSound ?? true,
      defaultFocusMinutes: stored.defaultFocusMinutes || 90,
    });

    applyThemeToDocument(stored.theme || "violet-amber");
  },
}));
