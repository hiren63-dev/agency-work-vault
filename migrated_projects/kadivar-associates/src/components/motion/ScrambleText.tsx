"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

/**
 * Character resolve for mono eyebrow labels.
 *
 * Reads as a figure settling rather than a typewriter effect — it fits a
 * practice whose work is numbers reconciling. Deliberately reserved for
 * short uppercase labels; on a sentence it would be noise.
 */

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/#§±";

export function ScrambleText({
  text,
  className = "",
  speed = 34,
}: {
  text: string;
  className?: string;
  speed?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const reduced = useReducedMotion();
  const [output, setOutput] = useState(reduced ? text : "");

  useEffect(() => {
    if (reduced || !inView) return;

    let frame = 0;
    let raf = 0;
    let last = 0;

    const run = (now: number) => {
      if (now - last >= speed) {
        last = now;
        // Each character locks in turn; everything after it keeps churning.
        const settled = Math.floor(frame / 2);
        setOutput(
          text
            .split("")
            .map((char, index) => {
              if (char === " ") return " ";
              if (index < settled) return char;
              return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
            })
            .join("")
        );
        frame += 1;
      }

      if (Math.floor(frame / 2) <= text.length) {
        raf = requestAnimationFrame(run);
      } else {
        setOutput(text);
      }
    };

    raf = requestAnimationFrame(run);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced, speed, text]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      <span aria-hidden="true">{output || " "}</span>
    </span>
  );
}
