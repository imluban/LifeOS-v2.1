"use client";

import { motion } from "framer-motion";
import {
  Brain,
  Target,
  Timer,
  CheckSquare,
  Command,
  FileText,
} from "lucide-react";

const FEATURES = [
  {
    icon: Command,
    title: "Command Center",
    description:
      "Every system — execution, focus, goals, and AI — surfaced in one live view.",
    accent: "amber",
  },
  {
    icon: CheckSquare,
    title: "Execution Engine",
    description:
      "Describe a goal in plain language and get a structured, prioritized task system in seconds.",
    accent: "amber",
  },
  {
    icon: Timer,
    title: "Focus Engine",
    description:
      "A distraction-free deep work mode with a precision timer that logs exactly what you accomplish.",
    accent: "amber",
  },
  {
    icon: Target,
    title: "Goals Engine",
    description:
      "Structure long-range ambitions and track real progress against them.",
    accent: "violet",
  },
  {
    icon: Brain,
    title: "AI Strategic Advisor",
    description:
      "An advisor that remembers your history and gives grounded, personalized recommendations.",
    accent: "violet",
  },
  {
    icon: FileText,
    title: "Weekly Reports",
    description:
      "AI-generated performance breakdowns — strengths, weaknesses, and what to fix next.",
    accent: "violet",
  },
];

export default function Features() {
  return (
    <section id="features" className="px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
            One system. Every lever.
          </h2>

          <p className="mt-4 text-white/60">
            LifeOS replaces a dozen scattered apps with a single strategic
            operating system built for execution.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="rounded-[24px] border border-white/10 bg-white/[0.03] p-7 backdrop-blur-xl transition hover:bg-white/[0.05]"
              >
                <div
                  className={`inline-flex rounded-2xl border p-3 ${
                    feature.accent === "amber"
                      ? "border-amber-400/20 bg-amber-400/10 text-amber-300"
                      : "border-violet-400/20 bg-violet-400/10 text-violet-300"
                  }`}
                >
                  <Icon size={20} />
                </div>

                <h3 className="mt-5 text-lg font-semibold">
                  {feature.title}
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-white/50">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
