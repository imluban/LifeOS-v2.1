"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import Button from "@/components/ui/button";

export default function Vision() {
  return (
    <section
      id="vision"
      className="relative overflow-hidden border-y border-white/10 px-6 py-32"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(124,58,237,0.1),transparent_50%)]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative mx-auto max-w-3xl text-center"
      >
        <p className="text-xs uppercase tracking-[0.3em] text-violet-300/70">
          The Philosophy
        </p>

        <h2 className="font-display mt-6 text-3xl font-bold leading-snug tracking-tight md:text-5xl">
          Most people don&apos;t fail from lack of ambition.
          <br />
          They fail from lack of{" "}
          <span className="text-amber-300">system</span>.
        </h2>

        <p className="mx-auto mt-8 max-w-xl text-white/60">
          LifeOS is built on one premise: intention without execution is just
          a wish. Every module — goals, tasks, focus, AI — exists to close
          the gap between what you want and what you actually do, day by day.
        </p>

        <div className="mt-10">
          <Link href="/auth">
            <Button variant="secondary">Build Your System</Button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
