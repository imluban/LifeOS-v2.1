import Link from "next/link";
import Button from "@/components/ui/button";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">LifeOS</h1>
        </div>

        <div className="hidden items-center gap-8 md:flex">
          <a
            href="#features"
            className="text-sm text-white/60 transition hover:text-white"
          >
            Features
          </a>

          <a
            href="#vision"
            className="text-sm text-white/60 transition hover:text-white"
          >
            Vision
          </a>

          <a
            href="#ai"
            className="text-sm text-white/60 transition hover:text-white"
          >
            AI
          </a>
        </div>

        <Link href="/auth">
          <Button variant="secondary">Enter System</Button>
        </Link>
      </div>
    </nav>
  );
}
