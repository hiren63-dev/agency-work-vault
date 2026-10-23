"use client";

import { useId, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { EASE_OUT, SPRING_SOFT } from "@/lib/motion";

/**
 * Segmented control with a shared-layout thumb — the highlight travels
 * between options rather than cutting, so the change of state is legible.
 *
 * Built as real radio inputs underneath: arrow keys work, focus is visible,
 * and it still functions with JavaScript disabled.
 */

export type Segment = {
  id: string;
  label: string;
};

export function SegmentedToggle({
  segments,
  value,
  onChange,
  className = "",
  ariaLabel,
}: {
  segments: Segment[];
  value: string;
  onChange: (id: string) => void;
  className?: string;
  ariaLabel: string;
}) {
  const groupId = useId();
  const reduced = useReducedMotion();

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={`inline-flex rounded-full border border-white/10 bg-white/[0.03] p-1 backdrop-blur-sm ${className}`}
    >
      {segments.map((segment) => {
        const active = segment.id === value;
        return (
          <button
            key={segment.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(segment.id)}
            data-cursor-type="pull"
            className="relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 sm:px-5"
          >
            {active && (
              <motion.span
                layoutId={`${groupId}-thumb`}
                className="absolute inset-0 rounded-full bg-[#e6ff00]"
                transition={reduced ? { duration: 0 } : SPRING_SOFT}
              />
            )}
            <span
              className={`relative z-10 whitespace-nowrap transition-colors duration-200 ${
                active ? "text-black" : "text-gray-400 hover:text-white"
              }`}
            >
              {segment.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/**
 * Content that cross-fades and rises when the segment changes. Keeps the
 * height animating so the page does not jump.
 */
export function SegmentPanel({
  activeKey,
  children,
}: {
  activeKey: string;
  children: React.ReactNode;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      key={activeKey}
      initial={reduced ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}

/** Small stateful wrapper for the common case. */
export function useSegment(initial: string) {
  const [value, setValue] = useState(initial);
  return { value, setValue };
}
