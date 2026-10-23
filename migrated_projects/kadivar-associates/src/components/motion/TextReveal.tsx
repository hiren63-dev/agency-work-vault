"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ElementType, ReactNode } from "react";
import { EASE_OUT, REVEAL_DURATION, REVEAL_STAGGER } from "@/lib/motion";

/**
 * The house reveal: each word sits in an overflow-hidden box and rises into
 * it, so type is uncovered rather than faded in. Words are the unit (not
 * characters) — character staggers on body-length copy read as decoration,
 * and they wreck screen-reader output.
 *
 * The full string is exposed to assistive tech via `aria-label`; the
 * animated spans are hidden from it.
 */

type TextRevealProps = {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  /** Slower, wider stagger for display type. */
  display?: boolean;
  once?: boolean;
};

export function TextReveal({
  text,
  as: Tag = "span",
  className = "",
  delay = 0,
  display = false,
  once = true,
}: TextRevealProps) {
  const reduced = useReducedMotion();
  const words = text.split(" ");

  if (reduced) {
    return <Tag className={className}>{text}</Tag>;
  }

  const stagger = display ? REVEAL_STAGGER * 1.6 : REVEAL_STAGGER;

  return (
    <Tag className={className} aria-label={text}>
      <motion.span
        aria-hidden="true"
        initial="hidden"
        whileInView="visible"
        viewport={{ once, margin: "-12% 0px -12% 0px" }}
        transition={{ staggerChildren: stagger, delayChildren: delay }}
        style={{ display: "inline" }}
      >
        {words.map((word, index) => (
          <span
            key={`${word}-${index}`}
            style={{
              display: "inline-block",
              overflow: "hidden",
              verticalAlign: "top",
              // The mask clips to its own box, so it needs room for
              // descenders (g/y/p) and for italic glyphs that overhang to
              // the right. Padding is cancelled by equal negative margin so
              // layout and line-height are untouched.
              paddingBottom: "0.22em",
              marginBottom: "-0.22em",
              paddingRight: "0.08em",
              marginRight: "-0.08em",
            }}
          >
            <motion.span
              style={{ display: "inline-block", willChange: "transform" }}
              variants={{
                hidden: { y: "110%" },
                visible: {
                  y: 0,
                  transition: {
                    duration: display ? REVEAL_DURATION : REVEAL_DURATION * 0.75,
                    ease: EASE_OUT,
                  },
                },
              }}
            >
              {word}
              {index < words.length - 1 ? " " : ""}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}

/**
 * Same reveal for arbitrary children — a whole block rising behind a mask.
 * Used for paragraphs and grouped elements where per-word is too busy.
 */
export function BlockReveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <div className={className} style={{ overflow: "hidden", paddingBottom: "0.1em" }}>
      <motion.div
        initial={{ y: "104%" }}
        whileInView={{ y: 0 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: REVEAL_DURATION * 0.8, ease: EASE_OUT, delay }}
        style={{ willChange: "transform" }}
      >
        {children}
      </motion.div>
    </div>
  );
}
