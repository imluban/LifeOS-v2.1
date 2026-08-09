import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

export default function GlassCard({
  children,
  className,
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-[24px]",
        "border border-white/10",
        "bg-white/[0.03]",
        "backdrop-blur-xl",
        "shadow-2xl shadow-black/30",
        className
      )}
    >
      {children}
    </div>
  );
}