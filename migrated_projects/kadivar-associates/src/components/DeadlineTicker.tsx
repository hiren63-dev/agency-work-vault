"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { EASE_OUT } from "@/lib/motion";
import { formatDeadline, getUpcoming, type UpcomingDeadline } from "@/lib/deadlines";

/**
 * What is actually due next.
 *
 * Gives a business owner a reason to care within two seconds of landing,
 * and demonstrates competence without a single claim about the firm. The
 * rotation is slow enough to read and pauses on hover.
 *
 * Computed after mount — the server and the visitor can be on different
 * days, and rendering a date during SSR would cause a hydration mismatch.
 */
export function DeadlineTicker() {
  const [items, setItems] = useState<UpcomingDeadline[]>([]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    setItems(getUpcoming(new Date(), 3));
  }, []);

  useEffect(() => {
    if (items.length < 2 || paused || reduced) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % items.length);
    }, 4200);
    return () => window.clearInterval(timer);
  }, [items.length, paused, reduced]);

  if (items.length === 0) {
    // Reserve the height so the hero does not shift when this arrives.
    return <div className="mb-8 h-[38px]" aria-hidden="true" />;
  }

  const active = items[index];

  return (
    <div
      className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] py-2 pl-3 pr-4 backdrop-blur-md"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      title="General statutory dates. Extensions are notified by the CBDT and CBIC from time to time."
    >
      <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
        <span
          className={`absolute inline-flex h-full w-full rounded-full bg-[#e6ff00] ${
            reduced ? "" : "animate-ping"
          } opacity-60`}
        />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-[#e6ff00]" />
      </span>

      <span className="font-mono text-[10px] uppercase tracking-widest text-gray-500">
        Next due
      </span>

      <div className="relative h-5 overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={active.label + active.date.toISOString()}
            initial={reduced ? false : { y: 18, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduced ? undefined : { y: -18, opacity: 0 }}
            transition={{ duration: 0.42, ease: EASE_OUT }}
            className="whitespace-nowrap text-[13px] leading-5 text-gray-200"
          >
            <span className="font-medium text-white">{active.label}</span>
            <span className="mx-2 text-gray-600">·</span>
            <span>{formatDeadline(active.date)}</span>
            {active.daysAway <= 10 && (
              <span className="ml-2 text-[#e6ff00]">
                {active.daysAway === 0
                  ? "today"
                  : active.daysAway === 1
                    ? "tomorrow"
                    : `in ${active.daysAway} days`}
              </span>
            )}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
