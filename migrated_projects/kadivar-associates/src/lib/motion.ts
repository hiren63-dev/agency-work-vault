/**
 * Shared motion language.
 *
 * The firm's work is precision under deadline, so the motion is mechanical
 * rather than floaty: sharp custom easing, springs with almost no bounce,
 * and reveals that behave like a document being uncovered — never a
 * generic fade-up. One signature move (the mask reveal), used consistently.
 */

// Sharp out-expo. Fast departure, long settle. The house easing.
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

// Symmetrical, for things that open and close (accordions, toggles).
export const EASE_IN_OUT = [0.76, 0, 0.24, 1] as const;

// Slight anticipation, for elements that should feel physical.
export const EASE_BACK = [0.34, 1.4, 0.64, 1] as const;

/** Tight, near-critically-damped. Cursor rings, magnetic pulls. */
export const SPRING_TIGHT = {
  type: "spring" as const,
  stiffness: 420,
  damping: 34,
  mass: 0.7,
};

/** Softer, for panels and larger travel. */
export const SPRING_SOFT = {
  type: "spring" as const,
  stiffness: 220,
  damping: 30,
  mass: 0.9,
};

/** The mask reveal used on every heading. */
export const REVEAL_DURATION = 0.85;
export const REVEAL_STAGGER = 0.045;

/** Linear interpolation for rAF-driven values. */
export function lerp(current: number, target: number, factor: number) {
  return current + (target - current) * factor;
}
