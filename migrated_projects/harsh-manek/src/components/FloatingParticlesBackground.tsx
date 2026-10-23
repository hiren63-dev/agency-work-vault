import React, { useEffect, useRef, useState, useCallback } from "react";

export interface FloatingParticlesBackgroundProps {
  particleCount?: number;
  particleSize?: number;
  particleOpacity?: number;
  glowIntensity?: number;
  movementSpeed?: number;
  mouseInfluence?: number;
  backgroundColor?: string;
  particleColor?: string;
  mouseGravity?: "none" | "attract" | "repel";
  gravityStrength?: number;
  glowAnimation?: "instant" | "ease" | "spring";
  particleInteraction?: boolean;
  interactionType?: "bounce" | "merge";
  className?: string;
  style?: React.CSSProperties;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  baseOpacity: number;
  mass: number;
  id: number;
  glowMultiplier?: number;
  glowVelocity?: number;
}

/**
 * FloatingParticlesBackground
 * Ported directly from Framer module:
 * https://framer.com/m/FloatingParticlesBackground-wpRj.js@yY4SPTplzSd09KMWBopV
 */
export default function FloatingParticlesBackground({
  particleCount = 65,
  particleSize = 2,
  particleOpacity = 0.6,
  glowIntensity = 12,
  movementSpeed = 0.45,
  mouseInfluence = 120,
  backgroundColor = "transparent",
  particleColor = "#FFFFFF",
  mouseGravity = "attract",
  gravityStrength = 40,
  glowAnimation = "spring",
  particleInteraction = true,
  interactionType = "bounce",
  className = "",
  style = {},
}: FloatingParticlesBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const mouseRef = useRef<{ x: number; y: number }>({ x: -1000, y: -1000 });
  const particlesRef = useRef<Particle[]>([]);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });

  const initializeParticles = useCallback(
    (width: number, height: number): Particle[] => {
      return Array.from({ length: particleCount }, (_, index) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * movementSpeed,
        vy: (Math.random() - 0.5) * movementSpeed,
        size: Math.random() * particleSize + 1,
        opacity: particleOpacity,
        baseOpacity: particleOpacity,
        mass: Math.random() * 0.5 + 0.5,
        id: index,
      }));
    },
    [particleCount, particleSize, particleOpacity, movementSpeed]
  );

  const redistributeParticles = useCallback((width: number, height: number) => {
    particlesRef.current.forEach((particle) => {
      particle.x = Math.random() * width;
      particle.y = Math.random() * height;
    });
  }, []);

  const updateParticles = useCallback(
    (canvas: HTMLCanvasElement) => {
      const rect = canvas.getBoundingClientRect();
      const mouse = mouseRef.current;

      particlesRef.current.forEach((particle, index) => {
        // Calculate distance to mouse
        const dx = mouse.x - particle.x;
        const dy = mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Mouse influence and gravity
        if (distance < mouseInfluence && distance > 0) {
          const force = (mouseInfluence - distance) / mouseInfluence;
          const normalizedDx = dx / distance;
          const normalizedDy = dy / distance;
          const gravityForce = force * (gravityStrength * 0.001);

          if (mouseGravity === "attract") {
            particle.vx += normalizedDx * gravityForce;
            particle.vy += normalizedDy * gravityForce;
          } else if (mouseGravity === "repel") {
            particle.vx -= normalizedDx * gravityForce;
            particle.vy -= normalizedDy * gravityForce;
          }

          particle.opacity = Math.min(1, particle.baseOpacity + force * 0.4);

          // Apply glow animation based on type
          const targetGlow = 1 + force * 2;
          const currentGlow = particle.glowMultiplier || 1;

          if (glowAnimation === "instant") {
            particle.glowMultiplier = targetGlow;
          } else if (glowAnimation === "ease") {
            const easeSpeed = 0.15;
            particle.glowMultiplier =
              currentGlow + (targetGlow - currentGlow) * easeSpeed;
          } else if (glowAnimation === "spring") {
            const springForce = (targetGlow - currentGlow) * 0.2;
            const damping = 0.85;
            particle.glowVelocity =
              (particle.glowVelocity || 0) * damping + springForce;
            particle.glowMultiplier = currentGlow + particle.glowVelocity;
          }
        } else {
          particle.opacity = Math.max(
            particle.baseOpacity * 0.3,
            particle.opacity - 0.02
          );

          const targetGlow = 1;
          const currentGlow = particle.glowMultiplier || 1;

          if (glowAnimation === "instant") {
            particle.glowMultiplier = targetGlow;
          } else if (glowAnimation === "ease") {
            const easeSpeed = 0.08;
            particle.glowMultiplier = Math.max(
              1,
              currentGlow + (targetGlow - currentGlow) * easeSpeed
            );
          } else if (glowAnimation === "spring") {
            const springForce = (targetGlow - currentGlow) * 0.15;
            const damping = 0.9;
            particle.glowVelocity =
              (particle.glowVelocity || 0) * damping + springForce;
            particle.glowMultiplier = Math.max(
              1,
              currentGlow + particle.glowVelocity
            );
          }
        }

        // Particle interaction
        if (particleInteraction) {
          for (let j = index + 1; j < particlesRef.current.length; j++) {
            const other = particlesRef.current[j];
            const odx = other.x - particle.x;
            const ody = other.y - particle.y;
            const odistance = Math.sqrt(odx * odx + ody * ody);
            const minDistance = particle.size + other.size + 5;

            if (odistance < minDistance && odistance > 0) {
              if (interactionType === "bounce") {
                const normalX = odx / odistance;
                const normalY = ody / odistance;
                const relativeVx = particle.vx - other.vx;
                const relativeVy = particle.vy - other.vy;
                const speed = relativeVx * normalX + relativeVy * normalY;

                if (speed < 0) {
                  const impulse =
                    (2 * speed) / (particle.mass + other.mass);
                  particle.vx -= impulse * other.mass * normalX;
                  particle.vy -= impulse * other.mass * normalY;
                  other.vx += impulse * particle.mass * normalX;
                  other.vy += impulse * particle.mass * normalY;

                  const overlap = minDistance - odistance;
                  const separationX = normalX * overlap * 0.5;
                  const separationY = normalY * overlap * 0.5;
                  particle.x -= separationX;
                  particle.y -= separationY;
                  other.x += separationX;
                  other.y += separationY;
                }
              } else if (interactionType === "merge") {
                const mergeForce = (minDistance - odistance) / minDistance;
                particle.glowMultiplier =
                  (particle.glowMultiplier || 1) + mergeForce * 0.5;
                other.glowMultiplier =
                  (other.glowMultiplier || 1) + mergeForce * 0.5;
                const attractForce = mergeForce * 0.01;
                particle.vx += odx * attractForce;
                particle.vy += ody * attractForce;
                other.vx -= odx * attractForce;
                other.vy -= ody * attractForce;
              }
            }
          }
        }

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Subtle organic float
        particle.vx += (Math.random() - 0.5) * 0.001;
        particle.vy += (Math.random() - 0.5) * 0.001;

        // Damping
        particle.vx *= 0.999;
        particle.vy *= 0.999;

        // Boundary wrapping
        if (particle.x < 0) particle.x = rect.width;
        if (particle.x > rect.width) particle.x = 0;
        if (particle.y < 0) particle.y = rect.height;
        if (particle.y > rect.height) particle.y = 0;
      });
    },
    [
      mouseInfluence,
      mouseGravity,
      gravityStrength,
      glowAnimation,
      particleInteraction,
      interactionType,
    ]
  );

  const drawParticles = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      particlesRef.current.forEach((particle) => {
        ctx.save();
        const currentGlowMultiplier = particle.glowMultiplier || 1;
        ctx.shadowColor = particleColor;
        ctx.shadowBlur = glowIntensity * currentGlowMultiplier * 2;
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = particleColor;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    },
    [particleColor, glowIntensity]
  );

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    updateParticles(canvas);
    drawParticles(ctx);
    animationRef.current = requestAnimationFrame(animate);
  }, [updateParticles, drawParticles]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current = { x: -1000, y: -1000 };
  }, []);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const newWidth = rect.width;
    const newHeight = rect.height;
    if (newWidth === 0 || newHeight === 0) return;

    canvas.width = newWidth;
    canvas.height = newHeight;
    setCanvasSize({ width: newWidth, height: newHeight });

    if (particlesRef.current.length > 0) {
      redistributeParticles(newWidth, newHeight);
    }
  }, [redistributeParticles]);

  // Reinitialize particles when count/size/etc change or on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.width || canvasSize.width;
    const h = canvas.height || canvasSize.height;
    particlesRef.current = initializeParticles(w, h);
  }, [particleCount, initializeParticles, canvasSize]);

  // Update properties on existing particles
  useEffect(() => {
    particlesRef.current.forEach((particle) => {
      particle.baseOpacity = particleOpacity;
      particle.opacity = particleOpacity;
      const currentSpeed = Math.sqrt(
        particle.vx * particle.vx + particle.vy * particle.vy
      );
      if (currentSpeed > 0) {
        const ratio = movementSpeed / currentSpeed;
        particle.vx *= ratio;
        particle.vy *= ratio;
      }
    });
  }, [particleOpacity, movementSpeed]);

  // Handle resize & mouse events
  useEffect(() => {
    resizeCanvas();

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave, { passive: true });
    window.addEventListener("resize", resizeCanvas);

    let resizeObserver: ResizeObserver | null = null;
    if (containerRef.current && typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        resizeCanvas();
      });
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", resizeCanvas);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, [handleMouseMove, handleMouseLeave, resizeCanvas]);

  // Animation frame loop
  useEffect(() => {
    animate();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate]);

  return (
    <div
      ref={containerRef}
      className={className || "relative w-full h-full overflow-hidden"}
      style={{
        backgroundColor,
        ...style,
      }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block pointer-events-none"
      />
    </div>
  );
}
