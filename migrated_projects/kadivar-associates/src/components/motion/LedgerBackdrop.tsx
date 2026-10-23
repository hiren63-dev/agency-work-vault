"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EASE_OUT } from "@/lib/motion";

/**
 * Ruled ledger lines that draw themselves in behind the hero.
 *
 * Replaces the pulsing blurred blob that was here. A gradient orb says
 * nothing about the subject; ruled paper is the surface this profession
 * actually works on, and lines that draw once and stop are calmer than
 * anything that loops forever.
 */
export function LedgerBackdrop() {
  const reduced = useReducedMotion();
  const rows = 9;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Horizontal rules */}
      <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 flex-col gap-[52px]">
        {Array.from({ length: rows }).map((_, index) => {
          // Fade toward the edges so the block reads as a page, not a grid.
          const distance = Math.abs(index - (rows - 1) / 2) / ((rows - 1) / 2);
          const opacity = 0.09 * (1 - distance * 0.85);
          return (
            <motion.div
              key={index}
              className="h-px w-full origin-left bg-white"
              style={{ opacity }}
              initial={reduced ? false : { scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{
                duration: 1.5,
                ease: EASE_OUT,
                delay: 0.15 + index * 0.06,
              }}
            />
          );
        })}
      </div>

      {/* Single vertical margin rule, offset like a real ledger */}
      <motion.div
        className="absolute inset-y-0 left-[14%] w-px origin-top bg-[#e6ff00]"
        style={{ opacity: 0.14 }}
        initial={reduced ? false : { scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 1.7, ease: EASE_OUT, delay: 0.5 }}
      />

      {/* Soft vignette so type stays legible over the rules */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,#050505_78%)]" />
    </div>
  );
}
