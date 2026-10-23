import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";

function modulo(value: number, length: number) {
  return ((value % length) + length) % length;
}

interface CurvedGalleryArcProps {
  items: React.ReactNode[];
  cardSize?: number;
  cardHeight?: number;
  gap?: number;
  curve?: number;
  perspective?: number;
  autoScrollSpeed?: number;
  dragSpeed?: number;
  inertia?: number;
  style?: React.CSSProperties;
  className?: string;
}

export default function CurvedGalleryArc({
  items = [],
  cardSize = 250,
  cardHeight = 320,
  gap = 24,
  curve = 40,
  perspective = 1200,
  autoScrollSpeed = 0.22,
  dragSpeed = 1,
  inertia = 0.75,
  style,
  className
}: CurvedGalleryArcProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const sizeRef = useRef({ width: 800, height: 450 });
  const [tick, setTick] = useState(0);

  const motionRef = useRef({
    offset: 0,
    velocity: autoScrollSpeed,
    dragging: false,
    pointerId: -1,
    lastX: 0,
    samples: [] as { x: number; t: number }[],
    lastTime: 0
  });

  const span = Math.max(1, cardSize + gap);
  const hasItems = items.length > 0;

  const geometry = useMemo(() => {
    const curveStrength = Math.min(1, Math.abs(curve) / 300);
    const sign = curve < 0 ? -1 : 1;
    const count = Math.max(10, Math.min(40, Math.ceil(sizeRef.current.width / span) + 10));
    const half = Math.floor(count / 2);
    const baseAngleStep = curveStrength === 0 ? 0 : 0.04 + curveStrength * 0.2;
    const baseMaxTheta = half * baseAngleStep;
    let angleStep = baseAngleStep;

    if (sign === 1 && curveStrength > 0 && half > 0) {
      const wrapBlend = Math.pow(curveStrength, 2.2);
      const targetMaxTheta = Math.PI * 2 * 0.98;
      const blendedMaxTheta = baseMaxTheta * (1 - wrapBlend) + targetMaxTheta * wrapBlend;
      angleStep = blendedMaxTheta / half;
    }
    const radius = angleStep === 0 ? 999999 : span / angleStep;
    const maxTheta = half * angleStep;
    const edgeCos = Math.cos(maxTheta);

    return { curveStrength, sign, angleStep, radius, count, half, maxTheta, edgeCos };
  }, [curve, span, tick]);

  const releaseVelocity = useCallback(() => {
    const samples = motionRef.current.samples;
    if (samples.length < 2) return motionRef.current.velocity;
    const first = samples[0];
    const last = samples[samples.length - 1];
    const dt = (last.t - first.t) / 1000;
    if (dt <= 0) return motionRef.current.velocity;
    const pxPerSecond = (last.x - first.x) / dt;
    return -(pxPerSecond * dragSpeed) / span * 0.95;
  }, [dragSpeed, span]);

  useEffect(() => {
    motionRef.current.velocity = autoScrollSpeed;
  }, [autoScrollSpeed]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const node = rootRef.current;
    if (!node) return;
    const observer = new ResizeObserver(entries => {
      const next = entries[0]?.contentRect;
      if (!next) return;
      sizeRef.current = { width: next.width, height: next.height };
      React.startTransition(() => setTick(v => v + 1));
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !hasItems) return;
    let disposed = false;
    const frame = (time: number) => {
      if (disposed) return;
      const motion = motionRef.current;
      if (motion.lastTime === 0) motion.lastTime = time;
      const dt = Math.max(0.001, Math.min(0.05, (time - motion.lastTime) / 1000));
      motion.lastTime = time;

      if (!motion.dragging) {
        const retentionPerFrame = 0.82 + Math.max(0, Math.min(1, inertia)) * 0.17;
        const damping = Math.pow(retentionPerFrame, dt * 60);
        motion.velocity *= damping;
        const pull = 1 - Math.exp(-1.2 * dt);
        motion.velocity += (autoScrollSpeed - motion.velocity) * pull;
        motion.offset += motion.velocity * dt;
      }
      React.startTransition(() => setTick(v => v + 1));
      rafRef.current = window.requestAnimationFrame(frame);
    };
    rafRef.current = window.requestAnimationFrame(frame);
    return () => {
      disposed = true;
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      motionRef.current.lastTime = 0;
    };
  }, [autoScrollSpeed, hasItems, inertia]);

  const handlePointerDown = useCallback((event: React.PointerEvent) => {
    const node = rootRef.current;
    if (!node) return;
    motionRef.current.dragging = true;
    motionRef.current.pointerId = event.pointerId;
    motionRef.current.lastX = event.clientX;
    motionRef.current.samples = [{ x: event.clientX, t: performance.now() }];
    node.setPointerCapture(event.pointerId);
  }, []);

  const handlePointerMove = useCallback((event: React.PointerEvent) => {
    const motion = motionRef.current;
    if (!motion.dragging || motion.pointerId !== event.pointerId) return;
    const dx = event.clientX - motion.lastX;
    motion.lastX = event.clientX;
    motion.offset += -dx / span * dragSpeed;
    const now = performance.now();
    motion.samples.push({ x: event.clientX, t: now });
    while (motion.samples.length > 8) motion.samples.shift();
    while (motion.samples.length > 2 && now - motion.samples[0].t > 120) {
      motion.samples.shift();
    }
    motion.velocity = releaseVelocity();
    React.startTransition(() => setTick(v => v + 1));
  }, [dragSpeed, releaseVelocity, span]);

  const handlePointerUp = useCallback((event: React.PointerEvent) => {
    const node = rootRef.current;
    const motion = motionRef.current;
    if (!motion.dragging || motion.pointerId !== event.pointerId) return;
    motion.dragging = false;
    motion.velocity = releaseVelocity();
    motion.samples = [];
    if (node && node.hasPointerCapture(event.pointerId)) {
      node.releasePointerCapture(event.pointerId);
    }
  }, [releaseVelocity]);

  const cards = useMemo(() => {
    if (!hasItems) return [];
    const { angleStep, radius, curveStrength, sign, count, half, edgeCos } = geometry;
    const offset = motionRef.current.offset;
    const startIndex = Math.floor(offset) - half;

    return Array.from({ length: count }, (_, slot) => {
      const virtualIndex = startIndex + slot;
      const relative = virtualIndex - offset;
      const itemIndex = modulo(virtualIndex, items.length);
      const item = items[itemIndex];

      if (angleStep === 0 || curveStrength === 0) {
        return {
          key: `${slot}-${itemIndex}`,
          item,
          x: relative * span,
          z: 0,
          rotateY: 0,
          opacity: 1,
          zIndex: 1000 - Math.abs(Math.round(relative))
        };
      }

      const theta = relative * angleStep;
      const x = Math.sin(theta) * radius;
      const centeredCos = Math.cos(theta) - (1 + edgeCos) / 2;
      const z = centeredCos * radius * sign;
      const rotateY = (theta * 180) / Math.PI * sign;
      const fade = Math.min(1, Math.abs(relative) / Math.max(1, half));

      return {
        key: `${slot}-${itemIndex}`,
        item,
        x,
        z,
        rotateY,
        opacity: 1 - fade * 0.15,
        zIndex: 1000 - Math.abs(Math.round(theta * 100))
      };
    });
  }, [items, geometry, hasItems, span, tick]);

  return (
    <div
      ref={rootRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={className}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        touchAction: "none",
        ...style
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          perspective: `${perspective}px`,
          perspectiveOrigin: "50% 50%",
          transformStyle: "preserve-3d",
          overflow: "hidden"
        }}
      >
        {cards.map(card => (
          <div
            key={card.key}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: cardSize,
              height: cardHeight,
              transformStyle: "preserve-3d",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              opacity: card.opacity,
              zIndex: card.zIndex,
              transform: `translate3d(-50%, -50%, 0) translateX(${card.x}px) translateZ(${card.z}px) rotateY(${card.rotateY}deg)`,
              willChange: "transform, opacity"
            }}
          >
            {card.item}
          </div>
        ))}
      </div>
    </div>
  );
}
