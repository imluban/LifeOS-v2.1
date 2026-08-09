import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export default function Button({
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "rounded-full px-6 py-3 font-medium transition-all duration-300",
        "hover:scale-[1.03] active:scale-[0.98]",
        "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100",
        variant === "primary" &&
          "bg-white text-black hover:bg-white/90",
        variant === "secondary" &&
          "border border-white/10 bg-white/5 text-white hover:bg-white/10",
        className
      )}
      {...props}
    />
  );
}