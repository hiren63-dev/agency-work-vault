"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { SPRING_TIGHT } from "@/lib/motion";

/**
 * A control that leans toward the pointer, with the label leaning slightly
 * further than the shell. The parallax between the two is what makes it
 * read as a physical object rather than a hover state.
 *
 * The pull is capped at a third of the element's half-width so it never
 * detaches from its layout position.
 */

type MagneticProps = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  cursorLabel?: string;
  strength?: number;
  external?: boolean;
};

export function MagneticButton({
  children,
  href,
  onClick,
  className = "",
  cursorLabel,
  strength = 0.32,
  external = false,
}: MagneticProps) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, SPRING_TIGHT);
  const springY = useSpring(y, SPRING_TIGHT);
  // Looser spring for the label so it overshoots the shell slightly.
  const labelX = useSpring(x, { ...SPRING_TIGHT, stiffness: 300 });
  const labelY = useSpring(y, { ...SPRING_TIGHT, stiffness: 300 });

  const handleMove = (event: React.MouseEvent) => {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const offsetX = event.clientX - (rect.left + rect.width / 2);
    const offsetY = event.clientY - (rect.top + rect.height / 2);
    const capX = rect.width / 3;
    const capY = rect.height / 2;
    x.set(Math.max(-capX, Math.min(capX, offsetX * strength)));
    y.set(Math.max(-capY, Math.min(capY, offsetY * strength)));
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const inner = (
    <motion.span
      className="pointer-events-none relative block"
      style={reduced ? undefined : { x: springX, y: springY }}
    >
      <motion.span
        className="block"
        style={reduced ? undefined : { x: labelX, y: labelY }}
      >
        {children}
      </motion.span>
    </motion.span>
  );

  const shared = {
    ref: ref as never,
    className,
    onMouseMove: handleMove,
    onMouseLeave: reset,
    "data-cursor": cursorLabel,
    "data-cursor-type": cursorLabel ? "pull" : undefined,
  };

  if (href) {
    if (external) {
      return (
        <a {...shared} href={href} target="_blank" rel="noreferrer">
          {inner}
        </a>
      );
    }
    return (
      <Link {...shared} href={href}>
        {inner}
      </Link>
    );
  }

  return (
    <button {...shared} type="button" onClick={onClick}>
      {inner}
    </button>
  );
}
