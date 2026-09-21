import React, { useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { Sparkles, Heart } from "lucide-react";

interface FireworksCanvasProps {
  isActive: boolean;
  onDone: () => void;
  girlfriendName: string;
}

export const FireworksCanvas: React.FC<FireworksCanvasProps> = ({
  isActive,
  onDone,
  girlfriendName,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isActive) return;

    // Launch multi-stage canvas-confetti bursts
    const end = Date.now() + 4500; // 4.5 seconds of grandeur
    const colors = ["#f43f5e", "#ec4899", "#f59e0b", "#a855f7", "#ffffff", "#ffd700"];

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors,
      });
      confetti({
        particleCount: 5,
        angle: 90,
        spread: 100,
        origin: { x: 0.5, y: 0.8 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      } else {
        setTimeout(onDone, 800);
      }
    };

    frame();

    // Also draw custom starry heart fireworks on the canvas
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      size: number;
      alpha: number;
      life: number;
    }

    let particles: Particle[] = [];

    const createHeartBurst = (cx: number, cy: number, color: string) => {
      for (let i = 0; i < 40; i++) {
        const t = (i / 40) * Math.PI * 2;
        // Heart curve
        const hx = 16 * Math.pow(Math.sin(t), 3);
        const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        const speed = 0.15 + Math.random() * 0.08;

        particles.push({
          x: cx,
          y: cy,
          vx: hx * speed,
          vy: hy * speed,
          color,
          size: 2.5 + Math.random() * 2,
          alpha: 1,
          life: 0.015 + Math.random() * 0.01,
        });
      }
    };

    // Burst at multiple intervals
    createHeartBurst(canvas.width * 0.3, canvas.height * 0.4, "#f43f5e");
    createHeartBurst(canvas.width * 0.7, canvas.height * 0.35, "#ec4899");
    setTimeout(() => {
      createHeartBurst(canvas.width * 0.5, canvas.height * 0.25, "#fbbf24");
    }, 800);
    setTimeout(() => {
      createHeartBurst(canvas.width * 0.4, canvas.height * 0.5, "#f472b6");
      createHeartBurst(canvas.width * 0.65, canvas.height * 0.45, "#e11d48");
    }, 1600);

    let animId: number;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.04; // gravity
        p.alpha -= p.life;

        if (p.alpha > 0) {
          ctx.save();
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      });

      particles = particles.filter((p) => p.alpha > 0);

      if (Date.now() < end + 1000) {
        animId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-40 pointer-events-none flex flex-col items-center justify-center">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      
      {/* Grand banner in the sky */}
      <div className="relative z-50 text-center animate-bounce duration-1000">
        <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-rose-600/90 text-white font-bold text-sm tracking-widest uppercase shadow-2xl border border-rose-300">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Happy Birthday, {girlfriendName}!</span>
          <Heart className="w-4 h-4 text-white fill-white" />
        </div>
      </div>
    </div>
  );
};
