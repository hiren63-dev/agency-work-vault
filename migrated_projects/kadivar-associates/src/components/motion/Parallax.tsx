"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";

/**
 * Small vertical offset driven by scroll position.
 *
 * Kept deliberately shallow — large parallax is the fastest way to make a
 * professional site feel like a template. The purpose here is only to give
 * the portrait column a slightly different rate to the text beside it, so
 * the two feel like separate layers rather than one flat block.
 */
export function Parallax({
  children,
  distance = 48,
  className = "",
}: {
  children: ReactNode;
  distance?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const raw = useTransform(scrollYProgress, [0, 1], [distance, -distance]);
  const y = useSpring(raw, { stiffness: 120, damping: 28, mass: 0.6 });

  return (
    <div ref={ref} className={className}>
      <motion.div style={reduced ? undefined : { y }}>{children}</motion.div>
    </div>
  );
}

/**
 * Scales and fades a section slightly as it leaves the top of the viewport,
 * so consecutive full-width blocks read as stacked cards rather than an
 * endless scroll. One effect, applied consistently between sections.
 */
export function ScrollHandoff({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.15", "start -0.35"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.35]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={reduced ? undefined : { scale, opacity, transformOrigin: "center top" }}
    >
      {children}
    </motion.div>
  );
}
