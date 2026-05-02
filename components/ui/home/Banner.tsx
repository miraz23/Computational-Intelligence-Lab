"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const PARTICLE_COUNT = 80;
const LINK_DISTANCE = 150;
const PARTICLE_COLOR = "rgba(242, 101, 34,"; // orange — alpha appended later
const LINK_COLOR = "rgba(242, 101, 34,";
const PARTICLE_SPEED = 0.8;
const BG_COLOR = "#0d1117";
/** Max opacity for particle–particle links at zero distance (fade by distance). */
const LINK_OPACITY_MAX = 0.48;
/** Max opacity for cursor–particle links at zero distance. */
const MOUSE_LINK_OPACITY_MAX = 0.78;

// ─── Hook: canvas particle animation ─────────────────────────────────────────
function useParticleCanvas(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let mouseX = -9999;
    let mouseY = -9999;

    // Resize canvas to fill parent
    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    // Seed particles
    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * PARTICLE_SPEED * 2,
      vy: (Math.random() - 0.5) * PARTICLE_SPEED * 2,
      radius: Math.random() * 1.5 + 1.5,
    }));

    // Mouse tracking
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };
    const onMouseLeave = () => { mouseX = -9999; mouseY = -9999; };
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);

    // Click: push particles away
    const onClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      particles.forEach((p) => {
        const dx = p.x - cx;
        const dy = p.y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          p.vx += (dx / dist) * 2;
          p.vy += (dy / dist) * 2;
        }
      });
    };
    canvas.addEventListener("click", onClick);

    // Draw loop
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update & bounce
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Clamp speed after mouse interaction
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > PARTICLE_SPEED * 20) {
          p.vx = (p.vx / speed) * PARTICLE_SPEED * 50;
          p.vy = (p.vy / speed) * PARTICLE_SPEED * 50;
        }
      });

      // Draw links
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Particle–particle links
          if (dist < LINK_DISTANCE) {
            const opacity = (1 - dist / LINK_DISTANCE) * LINK_OPACITY_MAX;
            ctx.beginPath();
            ctx.strokeStyle = `${LINK_COLOR}${opacity})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }

        // Mouse grab links
        const mdx = particles[i].x - mouseX;
        const mdy = particles[i].y - mouseY;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mDist < 180) {
          const opacity = (1 - mDist / 180) * MOUSE_LINK_OPACITY_MAX;
          ctx.beginPath();
          ctx.strokeStyle = `${LINK_COLOR}${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouseX, mouseY);
          ctx.stroke();
        }
      }

      // Draw dots
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${PARTICLE_COLOR}0.75)`;
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      canvas.removeEventListener("click", onClick);
    };
  }, [canvasRef]);
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function Banner() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useParticleCanvas(canvasRef);

  return (
    <section
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden"
      style={{ backgroundColor: BG_COLOR }}
    >
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      />

      {/* Hero content */}
      <div className="relative z-10 mx-auto max-w-3xl px-6 py-20 text-center">
        <h1
          className="mb-1 text-4xl font-bold leading-tight tracking-wide text-white sm:text-5xl font-poppins"
        >
          IEEE Computer Society
        </h1>

        <p
          className="mb-5 text-3xl font-bold tracking-wide sm:text-4xl text-[#f26522] font-poppins"
        >
          IIUC Student Branch Chapter
        </p>

        <p className="mb-9 text-sm leading-relaxed text-neutral-400 sm:text-base font-poppins">
          Advancing Robotics and Automation through education, hands-on learning
          and community involvement.
        </p>

        {/* CTA Button */}
        <Link
          href="/ras"
          className="inline-block rounded-full px-8 py-3 text-base font-semibold text-white transition-transform hover:scale-105 active:scale-95 font-poppins bg-[#f26522]"
        >
          Visit Page
        </Link>
      </div>
    </section>
  );
}