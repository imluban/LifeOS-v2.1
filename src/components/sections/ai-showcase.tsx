"use client";

import { motion } from "framer-motion";
import { Sparkles, MessageSquare } from "lucide-react";

const EXAMPLE_EXCHANGE = [
  {
    role: "user",
    text: "I keep starting projects and never finishing them.",
  },
  {
    role: "assistant",
    text: "Your data shows 6 open goals and 2 completions this month. Pick one goal, kill the rest for 30 days, and log a focus session against it today.",
  },
];

export default function AIShowcase() {
  return (
    <section id="ai" className="px-6 py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-4 py-2 text-sm text-violet-300">
            <Sparkles size={14} />
            AI Strategic Advisor
          </div>

          <h2 className="font-display mt-6 text-4xl font-bold tracking-tight md:text-5xl">
            An advisor that remembers everything.
          </h2>

          <p className="mt-6 text-white/60">
            Your advisor sees your actual goals, tasks, and focus history —
            not a generic chatbot. Every recommendation is grounded in what
            you&apos;ve actually done, not what you said you&apos;d do.
          </p>

          <ul className="mt-8 space-y-3 text-sm text-white/50">
            <li className="flex items-start gap-3">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
              Persistent memory across every conversation
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
              Recommendations grounded in your real execution data
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
              Choose the tone — direct, encouraging, or analytical
            </li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="rounded-[24px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl"
        >
          <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-widest text-white/40">
            <MessageSquare size={14} />
            Example
          </div>

          <div className="space-y-4">
            {EXAMPLE_EXCHANGE.map((message, i) => (
              <div
                key={i}
                className={`rounded-2xl p-4 text-sm leading-relaxed ${
                  message.role === "user"
                    ? "ml-8 bg-white/5 text-white/70"
                    : "mr-4 border border-violet-400/20 bg-violet-400/10 text-white/90"
                }`}
              >
                {message.text}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
