"use client";

import { useEffect, useState } from "react";
import { Download, X, Share } from "lucide-react";

import Button from "@/components/ui/button";
import GlassCard from "@/components/ui/glass-card";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "lifeos-install-dismissed";

function isStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone ===
      true
  );
}

function isIOS() {
  if (typeof navigator === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isStandalone()) return;
    if (localStorage.getItem(DISMISS_KEY)) return;

    function handleBeforeInstallPrompt(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // iOS never fires beforeinstallprompt — show our own instructions instead.
    if (isIOS()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(true);
    }

    return () =>
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
  }, []);

  function dismiss() {
    setVisible(false);
    setShowIOSInstructions(false);
    localStorage.setItem(DISMISS_KEY, "1");
  }

  async function handleInstallClick() {
    if (isIOS()) {
      setShowIOSInstructions(true);
      return;
    }

    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setVisible(false);
    }

    setDeferredPrompt(null);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-[80] w-full max-w-md -translate-x-1/2 px-4">
      <GlassCard className="p-5 shadow-2xl shadow-black/50">
        <div className="flex items-start gap-3">
          <div className="rounded-xl border border-amber-400/20 bg-amber-400/10 p-2.5 text-amber-300">
            <Download size={18} />
          </div>

          <div className="flex-1">
            <p className="text-sm font-medium">Install LifeOS</p>

            {showIOSInstructions ? (
              <p className="mt-1 text-xs leading-relaxed text-white/50">
                Tap the <Share size={12} className="inline align-text-top" />{" "}
                Share button in Safari, then choose &ldquo;Add to Home
                Screen&rdquo;.
              </p>
            ) : (
              <p className="mt-1 text-xs text-white/50">
                Add it to your home screen for the full app experience.
              </p>
            )}

            {!showIOSInstructions && (
              <div className="mt-3 flex gap-2">
                <Button
                  onClick={handleInstallClick}
                  className="!px-4 !py-2 text-xs"
                >
                  Install
                </Button>

                <button
                  onClick={dismiss}
                  className="rounded-full border border-white/10 px-4 py-2 text-xs text-white/50 transition hover:text-white"
                >
                  Not now
                </button>
              </div>
            )}
          </div>

          <button
            onClick={dismiss}
            aria-label="Dismiss"
            className="text-white/30 transition hover:text-white"
          >
            <X size={16} />
          </button>
        </div>
      </GlassCard>
    </div>
  );
}
