import React, { useEffect, useRef } from "react";

interface HeartParticle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  swaySpeed: number;
  swayOffset: number;
  swayAmplitude: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  maxOpacity: number;
  color: string;
}

interface GlitterStarParticle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  twinkleSpeed: number;
  twinklePhase: number;
  baseOpacity: number;
  maxOpacity: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  points: 4 | 8;
  rayScale: number;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
  decay: number;
  color: string;
}

export interface FloatingHeartsBackgroundProps {
  density?: "low" | "medium" | "high";
  interactive?: boolean;
  enableHearts?: boolean;
  enableGlitterStars?: boolean;
}

const ROMANTIC_HEART_PALETTE = [
  "#f43f5e", // Rose 500
  "#fb7185", // Rose 400
  "#fda4af", // Rose 300
  "#ec4899", // Pink 500
  "#f472b6", // Pink 400
  "#e879f9", // Fuchsia 400
  "#fbcfe8", // Pink 200
  "#ffe4e6", // Pale blush
];

const GLITTER_STAR_PALETTE = [
  "#ffffff", // Diamond starlight
  "#fef08a", // Champagne gold
  "#fde047", // Radiant warm gold
  "#fef9c3", // Pale moonlight
  "#ffe4e6", // Romantic rose starlight
  "#e0e7ff", // Celestial blue-white
];

export const FloatingHeartsBackground: React.FC<FloatingHeartsBackgroundProps> = ({
  density = "medium",
  interactive = true,
  enableHearts = true,
  enableGlitterStars = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heartsRef = useRef<HeartParticle[]>([]);
  const starsRef = useRef<GlitterStarParticle[]>([]);
  const shootingStarsRef = useRef<ShootingStar[]>([]);
  const animationFrameRef = useRef<number>(0);
  const lastShootingStarTime = useRef<number>(Date.now());
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -999,
    y: -999,
    active: false,
  });

  const getTargetHeartCount = (width: number) => {
    if (!enableHearts) return 0;
    const base = width < 768 ? 20 : 38;
    if (density === "low") return Math.round(base * 0.5);
    if (density === "high") return Math.round(base * 1.5);
    return base;
  };

  const getTargetStarCount = (width: number) => {
    if (!enableGlitterStars) return 0;
    const base = width < 768 ? 35 : 70;
    if (density === "low") return Math.round(base * 0.5);
    if (density === "high") return Math.round(base * 1.4);
    return base;
  };

  const createHeart = (width: number, height: number, startAtBottom = true): HeartParticle => {
    const size = Math.random() * 11 + 6; // 6px to 17px
    const maxOpacity = Math.random() * 0.45 + 0.15; // Soft translucent romantic glow

    return {
      x: Math.random() * width,
      y: startAtBottom ? height + Math.random() * 30 : Math.random() * height,
      size,
      speedY: (Math.random() * 0.65 + 0.35) * (size > 12 ? 0.85 : 1.1),
      speedX: (Math.random() - 0.5) * 0.2,
      swaySpeed: Math.random() * 0.02 + 0.01,
      swayOffset: Math.random() * Math.PI * 2,
      swayAmplitude: Math.random() * 25 + 10,
      rotation: (Math.random() - 0.5) * 0.4,
      rotationSpeed: (Math.random() - 0.5) * 0.012,
      opacity: startAtBottom ? 0 : maxOpacity * Math.random(),
      maxOpacity,
      color: ROMANTIC_HEART_PALETTE[Math.floor(Math.random() * ROMANTIC_HEART_PALETTE.length)],
    };
  };

  const createStar = (width: number, height: number, startAtBottom = false): GlitterStarParticle => {
    const size = Math.random() * 3.5 + 1.8; // 1.8px to 5.3px core
    const isEightPoint = Math.random() < 0.25; // 25% are grand 8-point stars
    const maxOpacity = Math.random() * 0.45 + 0.55; // 0.55 - 1.0 (bright twinkle)
    const baseOpacity = Math.random() * 0.25 + 0.15;

    return {
      x: Math.random() * width,
      y: startAtBottom ? height + Math.random() * 20 : Math.random() * height,
      size,
      speedY: Math.random() * 0.25 + 0.08, // Slow cosmic upward drift
      speedX: (Math.random() - 0.5) * 0.1,
      twinkleSpeed: Math.random() * 0.04 + 0.02,
      twinklePhase: Math.random() * Math.PI * 2,
      baseOpacity,
      maxOpacity,
      rotation: Math.random() * Math.PI,
      rotationSpeed: (Math.random() - 0.5) * 0.008,
      color: GLITTER_STAR_PALETTE[Math.floor(Math.random() * GLITTER_STAR_PALETTE.length)],
      points: isEightPoint ? 8 : 4,
      rayScale: Math.random() * 2.2 + 2.5, // Flare multiplier
    };
  };

  const spawnShootingStar = (width: number) => {
    const startX = Math.random() * width * 0.8 + width * 0.1;
    const startY = Math.random() * 180 + 30;
    const angle = (Math.PI / 6) + (Math.random() * 0.2 - 0.1); // ~30 degrees downward
    shootingStarsRef.current.push({
      x: startX,
      y: startY,
      length: Math.random() * 110 + 90,
      speed: Math.random() * 6 + 10,
      angle,
      opacity: 1,
      decay: Math.random() * 0.02 + 0.015,
      color: Math.random() < 0.5 ? "#fef08a" : "#ffffff",
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const handleResize = () => {
      if (!canvas) return;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      // Adjust particle counts
      const targetHearts = getTargetHeartCount(width);
      if (heartsRef.current.length < targetHearts) {
        const diff = targetHearts - heartsRef.current.length;
        for (let i = 0; i < diff; i++) {
          heartsRef.current.push(createHeart(width, height, false));
        }
      } else if (heartsRef.current.length > targetHearts) {
        heartsRef.current.length = targetHearts;
      }

      const targetStars = getTargetStarCount(width);
      if (starsRef.current.length < targetStars) {
        const diff = targetStars - starsRef.current.length;
        for (let i = 0; i < diff; i++) {
          starsRef.current.push(createStar(width, height, false));
        }
      } else if (starsRef.current.length > targetStars) {
        starsRef.current.length = targetStars;
      }
    };

    handleResize();

    // Initial populations
    const targetHearts = getTargetHeartCount(width);
    heartsRef.current = Array.from({ length: targetHearts }, () =>
      createHeart(width, height, false)
    );

    const targetStars = getTargetStarCount(width);
    starsRef.current = Array.from({ length: targetStars }, () =>
      createStar(width, height, false)
    );

    // Drawing helpers
    const drawHeart = (p: HeartParticle, renderX: number, renderY: number) => {
      ctx.save();
      ctx.translate(renderX, renderY);
      ctx.rotate(p.rotation);
      ctx.scale(p.size / 10, p.size / 10);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, Math.min(1, p.opacity));

      ctx.beginPath();
      // Romantic curved heart path
      ctx.moveTo(0, -3);
      ctx.bezierCurveTo(-4, -9, -10, -5, -10, 0);
      ctx.bezierCurveTo(-10, 5, -5, 9, 0, 13);
      ctx.bezierCurveTo(5, 9, 10, 5, 10, 0);
      ctx.bezierCurveTo(10, -5, 4, -9, 0, -3);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const drawGlitterStar = (
      star: GlitterStarParticle,
      renderX: number,
      renderY: number,
      alpha: number
    ) => {
      ctx.save();
      ctx.translate(renderX, renderY);
      ctx.rotate(star.rotation);
      ctx.fillStyle = star.color;
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));

      const r = star.size;
      const flare = r * star.rayScale;

      // Soft diffuse starlight glow
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, flare * 1.5);
      gradient.addColorStop(0, star.color);
      gradient.addColorStop(0.3, star.color);
      gradient.addColorStop(1, "transparent");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(0, 0, flare * 1.5, 0, Math.PI * 2);
      ctx.fill();

      // Sharp primary 4-point diamond star
      ctx.fillStyle = star.color;
      ctx.beginPath();
      ctx.moveTo(0, -flare);
      ctx.quadraticCurveTo(0, 0, flare * 0.25, 0);
      ctx.quadraticCurveTo(0, 0, flare, 0);
      ctx.quadraticCurveTo(0, 0, flare * 0.25, 0);
      ctx.lineTo(0, flare);
      ctx.quadraticCurveTo(0, 0, -flare * 0.25, 0);
      ctx.lineTo(-flare, 0);
      ctx.quadraticCurveTo(0, 0, 0, -flare);
      ctx.closePath();
      ctx.fill();

      // Secondary 45-degree diagonal rays for 8-point stars
      if (star.points === 8) {
        ctx.save();
        ctx.rotate(Math.PI / 4);
        const subFlare = flare * 0.55;
        ctx.beginPath();
        ctx.moveTo(0, -subFlare);
        ctx.quadraticCurveTo(0, 0, subFlare * 0.2, 0);
        ctx.lineTo(subFlare, 0);
        ctx.quadraticCurveTo(0, 0, 0, subFlare);
        ctx.lineTo(0, subFlare);
        ctx.quadraticCurveTo(0, 0, -subFlare * 0.2, 0);
        ctx.lineTo(-subFlare, 0);
        ctx.quadraticCurveTo(0, 0, 0, -subFlare);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      // Bright white central pinpoint core
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(0, 0, Math.max(1, r * 0.5), 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    const drawShootingStar = (s: ShootingStar) => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, s.opacity));
      const endX = s.x - Math.cos(s.angle) * s.length;
      const endY = s.y - Math.sin(s.angle) * s.length;

      const grad = ctx.createLinearGradient(s.x, s.y, endX, endY);
      grad.addColorStop(0, s.color);
      grad.addColorStop(0.3, "rgba(254, 240, 138, 0.6)");
      grad.addColorStop(1, "transparent");

      ctx.strokeStyle = grad;
      ctx.lineWidth = 2.2;
      ctx.lineCap = "round";

      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      // Glowing head
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(s.x, s.y, 2.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    let time = 0;

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      const mouse = mouseRef.current;

      // 1. Render & Update Glittering Stars
      if (enableGlitterStars) {
        const stars = starsRef.current;
        for (let i = 0; i < stars.length; i++) {
          const s = stars[i];

          // Slow upward celestial drift
          s.y -= s.speedY;
          s.x += s.speedX;
          s.rotation += s.rotationSpeed;

          // Twinkle pulse using sinusoidal cycle
          const twinkle = (Math.sin(time * s.twinkleSpeed * 20 + s.twinklePhase) + 1) / 2;
          let currentAlpha = s.baseOpacity + twinkle * (s.maxOpacity - s.baseOpacity);

          // Subtle interactive proximity flare
          if (interactive && mouse.active) {
            const dx = s.x - mouse.x;
            const dy = s.y - mouse.y;
            const distSq = dx * dx + dy * dy;
            const maxDist = 80;
            if (distSq < maxDist * maxDist && distSq > 0) {
              const dist = Math.sqrt(distSq);
              const boost = (1 - dist / maxDist) * 0.4;
              currentAlpha = Math.min(1, currentAlpha + boost);
            }
          }

          // Edge fade in/out
          if (s.y > height - 40) {
            currentAlpha *= Math.max(0, (height - s.y) / 40);
          } else if (s.y < 50) {
            currentAlpha *= Math.max(0, s.y / 50);
          }

          drawGlitterStar(s, s.x, s.y, currentAlpha);

          // Respawn at bottom
          if (s.y < -30 || s.x < -30 || s.x > width + 30) {
            stars[i] = createStar(width, height, true);
          }
        }

        // Occasional romantic shooting star
        const now = Date.now();
        if (now - lastShootingStarTime.current > 7500 && Math.random() < 0.015) {
          spawnShootingStar(width);
          lastShootingStarTime.current = now;
        }

        // Update shooting stars
        for (let i = shootingStarsRef.current.length - 1; i >= 0; i--) {
          const ss = shootingStarsRef.current[i];
          ss.x += Math.cos(ss.angle) * ss.speed;
          ss.y += Math.sin(ss.angle) * ss.speed;
          ss.opacity -= ss.decay;
          drawShootingStar(ss);

          if (ss.opacity <= 0 || ss.x > width + 100 || ss.y > height + 100) {
            shootingStarsRef.current.splice(i, 1);
          }
        }
      }

      // 2. Render & Update Floating Hearts
      if (enableHearts) {
        const hearts = heartsRef.current;
        for (let i = 0; i < hearts.length; i++) {
          const p = hearts[i];

          // Move upward
          p.y -= p.speedY;
          p.x += p.speedX;
          p.rotation += p.rotationSpeed;

          // Sinusoidal swaying
          const sway = Math.sin(time * p.swaySpeed * 10 + p.swayOffset) * (p.swayAmplitude * 0.03);
          const renderX = p.x + sway;
          const renderY = p.y;

          // Fade transitions
          if (p.y > height - 60) {
            p.opacity = Math.min(p.maxOpacity, p.opacity + 0.015);
          } else if (p.y < 80) {
            p.opacity = Math.max(0, (p.y / 80) * p.maxOpacity);
          } else {
            p.opacity = p.maxOpacity;
          }

          // Gentle breeze deflection from cursor/touch
          if (interactive && mouse.active) {
            const dx = renderX - mouse.x;
            const dy = renderY - mouse.y;
            const distSq = dx * dx + dy * dy;
            const maxDist = 95;
            if (distSq < maxDist * maxDist && distSq > 0) {
              const dist = Math.sqrt(distSq);
              const force = (1 - dist / maxDist) * 1.6;
              p.x += (dx / dist) * force;
              p.y += (dy / dist) * force * 0.5;
            }
          }

          drawHeart(p, renderX, renderY);

          // Respawn at bottom
          if (p.y < -30 || p.x < -40 || p.x > width + 40 || p.opacity <= 0) {
            hearts[i] = createHeart(width, height, true);
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    // Pointer events
    const handlePointerMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };

    const handlePointerLeave = () => {
      mouseRef.current.active = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current.x = e.touches[0].clientX;
        mouseRef.current.y = e.touches[0].clientY;
        mouseRef.current.active = true;
      }
    };

    const handleTouchEnd = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener("resize", handleResize, { passive: true });
    if (interactive) {
      window.addEventListener("mousemove", handlePointerMove, { passive: true });
      window.addEventListener("mouseleave", handlePointerLeave, { passive: true });
      window.addEventListener("touchmove", handleTouchMove, { passive: true });
      window.addEventListener("touchend", handleTouchEnd, { passive: true });
    }

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener("resize", handleResize);
      if (interactive) {
        window.removeEventListener("mousemove", handlePointerMove);
        window.removeEventListener("mouseleave", handlePointerLeave);
        window.removeEventListener("touchmove", handleTouchMove);
        window.removeEventListener("touchend", handleTouchEnd);
      }
    };
  }, [density, interactive, enableHearts, enableGlitterStars]);

  return (
    <canvas
      id="floating-particles-background"
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[1] select-none"
      aria-hidden="true"
    />
  );
};
