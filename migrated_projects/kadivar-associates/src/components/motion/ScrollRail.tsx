"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";

/**
 * Reading-progress rail down the left margin, with section markers.
 *
 * Doubles as navigation: the markers are real anchors, so the rail tells
 * you where you are and lets you jump. Hidden below lg — on a phone it
 * would be a decoration competing with the sticky call bar.
 */

const SECTIONS = [
  { id: "top", label: "Top" },
  { id: "about", label: "The Partner" },
  { id: "services", label: "Services" },
  { id: "support", label: "Ongoing Support" },
  { id: "faq", label: "Questions" },
  { id: "enquiry-form", label: "Contact" },
];

export function ScrollRail() {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 32,
    restDelta: 0.0005,
  });

  const [active, setActive] = useState("top");

  useEffect(() => {
    const targets = SECTIONS.map((section) => document.getElementById(section.id)).filter(
      Boolean
    ) as HTMLElement[];

    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // The section occupying the middle band of the viewport wins.
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] }
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Page sections"
      className="fixed left-6 top-1/2 z-40 hidden -translate-y-1/2 lg:block"
    >
      <div className="relative flex flex-col gap-5 pl-4">
        {/* Track */}
        <span className="absolute left-0 top-1 h-[calc(100%-8px)] w-px bg-white/10" aria-hidden="true" />
        {/* Filled portion */}
        <motion.span
          aria-hidden="true"
          className="absolute left-0 top-1 w-px origin-top bg-[#e6ff00]"
          style={{
            height: "calc(100% - 8px)",
            scaleY: reduced ? 1 : progress,
          }}
        />

        {SECTIONS.map((section) => {
          const isActive = active === section.id;
          return (
            <a
              key={section.id}
              href={`#${section.id}`}
              data-cursor-type="pull"
              className="group flex items-center gap-3"
            >
              <span
                className={`h-1.5 w-1.5 shrink-0 rounded-full transition-all duration-500 ${
                  isActive ? "scale-150 bg-[#e6ff00]" : "bg-white/25 group-hover:bg-white/60"
                }`}
              />
              <span
                className={`whitespace-nowrap font-mono text-[10px] uppercase tracking-widest transition-all duration-500 ${
                  isActive
                    ? "translate-x-0 text-white opacity-100"
                    : "-translate-x-1 text-gray-500 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                }`}
              >
                {section.label}
              </span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
