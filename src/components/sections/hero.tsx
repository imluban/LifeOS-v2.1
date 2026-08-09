"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import Button from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.15),transparent_40%)]" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 mx-auto max-w-5xl text-center"
      >
        <div className="mb-6 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 backdrop-blur-xl">
          AI-Powered Life Operating System
        </div>

        <h1 className="text-6xl font-bold leading-tight tracking-tight md:text-8xl">
          Engineer
          <br />
          Your Future
        </h1>

        <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-white/60 md:text-xl">
          Strategic intelligence, execution systems, and behavioral
          optimization for ambitious humans.
        </p>

        <div className="mt-10 flex items-center justify-center gap-4">
          <Link href="/auth">
            <Button>Begin Evolution</Button>
          </Link>

          <Link href="/auth">
            <Button variant="secondary">Watch Vision</Button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
