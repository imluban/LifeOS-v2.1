"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

type ToastVariant = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  toast: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const VARIANT_STYLES: Record<
  ToastVariant,
  { icon: typeof CheckCircle2; className: string }
> = {
  success: {
    icon: CheckCircle2,
    className: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
  },
  error: {
    icon: XCircle,
    className: "border-red-500/20 bg-red-500/10 text-red-300",
  },
  info: {
    icon: Info,
    className: "border-violet-500/20 bg-violet-500/10 text-violet-300",
  },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, variant: ToastVariant = "info") => {
      const id = crypto.randomUUID();

      setToasts((prev) => [...prev, { id, message, variant }]);

      setTimeout(() => dismiss(id), 4000);
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      <div className="pointer-events-none fixed bottom-6 right-6 z-[100] flex w-full max-w-sm flex-col gap-3">
        {toasts.map((t) => {
          const { icon: Icon, className } = VARIANT_STYLES[t.variant];

          return (
            <div
              key={t.id}
              style={{ animation: "toast-in 0.2s ease-out" }}
              className={`pointer-events-auto flex items-start gap-3 rounded-2xl border px-4 py-3 backdrop-blur-xl shadow-2xl shadow-black/40 ${className}`}
            >
              <Icon size={18} className="mt-0.5 shrink-0" />

              <p className="flex-1 text-sm text-white">{t.message}</p>

              <button
                onClick={() => dismiss(t.id)}
                aria-label="Dismiss notification"
                className="text-white/40 transition hover:text-white"
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
}
