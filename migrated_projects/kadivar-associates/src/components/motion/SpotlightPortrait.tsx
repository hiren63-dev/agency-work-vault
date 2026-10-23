"use client";

import { useEffect, useRef, useState } from "react";
import { lerp } from "@/lib/motion";

/**
 * Portrait that holds in monochrome and returns to colour under the pointer.
 *
 * Two stacked copies of the same image — a desaturated base and a full
 * colour layer masked to a soft circle that follows the cursor. The mask
 * position lerps rather than snapping, and the radius eases open on enter
 * and closed on leave, so the reveal feels like a light being moved across
 * a print rather than a hard cutout.
 *
 * Everything runs through CSS custom properties inside a rAF loop; no React
 * state changes per frame. On touch and under reduced-motion the colour
 * layer is simply shown in full.
 */
export function SpotlightPortrait({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const colourRef = useRef<HTMLDivElement>(null);

  const pointer = useRef({ x: 0.5, y: 0.4 });
  const current = useRef({ x: 0.5, y: 0.4 });
  const radius = useRef(0);
  const targetRadius = useRef(0);

  const [interactive, setInteractive] = useState(true);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (!fine.matches || calm.matches) {
      setInteractive(false);
      return;
    }

    const el = wrapRef.current;
    if (!el) return;

    let frame = 0;

    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      pointer.current.x = (event.clientX - rect.left) / rect.width;
      pointer.current.y = (event.clientY - rect.top) / rect.height;
    };

    const onEnter = () => {
      targetRadius.current = 30;
    };

    const onLeave = () => {
      targetRadius.current = 0;
    };

    const tick = () => {
      current.current.x = lerp(current.current.x, pointer.current.x, 0.14);
      current.current.y = lerp(current.current.y, pointer.current.y, 0.14);
      radius.current = lerp(radius.current, targetRadius.current, 0.09);

      if (colourRef.current) {
        colourRef.current.style.setProperty("--x", `${current.current.x * 100}%`);
        colourRef.current.style.setProperty("--y", `${current.current.y * 100}%`);
        colourRef.current.style.setProperty("--r", `${radius.current}%`);
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  // Feathered edge: solid to the stated radius, then falls away over ~60%
  // of that distance again. A hard stop reads as a cheap cutout.
  const maskImage =
    "radial-gradient(circle var(--r, 0%) at var(--x, 50%) var(--y, 40%), #000 0%, #000 62%, rgba(0,0,0,0.55) 82%, transparent 100%)";

  return (
    <div
      ref={wrapRef}
      className={`relative overflow-hidden ${className}`}
      data-cursor-type="hide"
    >
      {/* Monochrome base */}
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover object-top"
        style={{ filter: "grayscale(1) contrast(1.08) brightness(0.82)" }}
        draggable={false}
      />

      {/* Colour layer, revealed under the pointer */}
      <div
        ref={colourRef}
        aria-hidden="true"
        className="absolute inset-0"
        style={
          interactive
            ? {
                WebkitMaskImage: maskImage,
                maskImage,
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                willChange: "mask-image",
              }
            : undefined
        }
      >
        <img
          src={src}
          alt=""
          className="h-full w-full object-cover object-top"
          style={{ filter: "saturate(1.06) contrast(1.02)" }}
          draggable={false}
        />
      </div>

      {/* Grade so type over the image stays readable */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80" />
    </div>
  );
}
