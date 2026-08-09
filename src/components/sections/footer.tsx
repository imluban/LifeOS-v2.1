import Link from "next/link";
import Button from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 px-6 py-20">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
          Stop planning. Start executing.
        </h2>

        <p className="mt-4 text-white/50">
          Your system is waiting. It takes less than a minute to start.
        </p>

        <div className="mt-8">
          <Link href="/auth">
            <Button>Enter LifeOS</Button>
          </Link>
        </div>

        <p className="mt-16 text-xs text-white/30">
          LifeOS — Human Optimization System
        </p>
      </div>
    </footer>
  );
}
