"use client";

import React, { useEffect, useState, useRef } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import Image from "next/image";

const ParticlesBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const animationRef = useRef<number | null>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const isDark = theme === "dark";
    const particleCount = 70;
    const connectionDistance = 140;

    class Particle {
      x: number; y: number; vx: number; vy: number; radius: number; isEmerald: boolean;
      constructor(canvas: HTMLCanvasElement) {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 1.8 + 0.8;
        this.isEmerald = Math.random() > 0.65;
      }
      update(canvas: HTMLCanvasElement) {
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }
      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        if (isDark) {
          ctx.fillStyle = this.isEmerald ? "rgba(80,200,120,0.55)" : "rgba(80,80,255,0.35)";
        } else {
          ctx.fillStyle = this.isEmerald ? "rgba(80,200,120,0.45)" : "rgba(0,0,128,0.30)";
        }
        ctx.fill();
      }
    }

    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) particles.push(new Particle(canvas));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        p.update(canvas); p.draw(ctx);
        particles.slice(i + 1).forEach((o) => {
          const dx = p.x - o.x, dy = p.y - o.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connectionDistance) {
            const alpha = 0.18 * (1 - dist / connectionDistance);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y); ctx.lineTo(o.x, o.y);
            ctx.strokeStyle = isDark
              ? `rgba(80,200,120,${alpha})`
              : `rgba(0,0,128,${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      if (canvas) { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [mounted, theme]);

  if (!mounted) return null;
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ background: "transparent" }} />;
};

const HeroSection = () => {
  const integrationGroups = [
    ["TradeStation", "Tastytrade", "Ally Invest"],
    ["E-Trade", "WEBULL", "Think or Swim", "Schwab"],
    ["TD Ameritrade", "Interactive Brokers"],
  ];
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [animating, setAnimating] = React.useState(false);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setAnimating(true);
      setTimeout(() => { setActiveIndex((p) => (p + 1) % integrationGroups.length); setAnimating(false); }, 400);
    }, 3000);
    return () => clearInterval(interval);
  }, [integrationGroups.length]);

  return (
    <section className="relative overflow-hidden lg:min-h-[calc(100vh-80px)]">
      <ParticlesBackground />

      {/* Navy glow — center */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-[#000080]/[0.05] dark:bg-[#000080]/[0.35] rounded-full blur-[140px] pointer-events-none" />
      {/* Emerald glow — top right */}
      <div className="absolute -top-20 right-1/4 w-[500px] h-[400px] bg-[#50C878]/[0.04] dark:bg-[#50C878]/[0.07] rounded-full blur-[120px] pointer-events-none" />
      {/* Emerald glow — bottom left */}
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-[#50C878]/[0.03] dark:bg-[#50C878]/[0.05] rounded-full blur-[100px] pointer-events-none" />

      <div
        className={`relative z-10 mx-auto max-w-7xl pt-8 px-4 transition-all duration-1000 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        {/* Integration Badge */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/70 dark:bg-white/[0.04] backdrop-blur-md border border-[#000080]/[0.12] dark:border-[#50C878]/[0.15] px-4 py-2 text-[10px] sm:text-xs font-medium shadow-sm shadow-[#000080]/[0.06] dark:shadow-[#50C878]/[0.04]">
            <span className="flex h-1.5 w-1.5 shrink-0 rounded-full bg-[#50C878] animate-pulse" />
            <span className="text-gray-500 dark:text-gray-400 whitespace-nowrap">Integrates with</span>
            <span className={`flex items-center gap-1.5 transition-all duration-400 ${animating ? "opacity-0 translate-y-1.5" : "opacity-100 translate-y-0"}`}>
              {integrationGroups[activeIndex].map((platform, i) => (
                <React.Fragment key={platform}>
                  <span className="font-semibold text-gray-800 dark:text-white whitespace-nowrap">{platform}</span>
                  {i < integrationGroups[activeIndex].length - 1 && (
                    <span className="text-[#000080]/30 dark:text-[#50C878]/30">/</span>
                  )}
                </React.Fragment>
              ))}
            </span>
          </div>
        </div>

        {/* Headline */}
        <div className="mx-auto mt-6 max-w-4xl text-center lg:mt-12">
          <h1 className="text-[1.5rem] sm:text-[2.25rem] lg:text-[3.1rem] font-bold leading-[1.1] tracking-tight text-gray-900 dark:text-white lg:leading-[1.08]">
            Copy Futures, Options & Contracts
            <br />
            <span className="bg-gradient-to-r from-[#000080] via-[#2020cc] to-[#50C878] dark:from-[#a0a0ff] dark:via-white dark:to-[#50C878] bg-clip-text text-transparent">
              with Precision
            </span>
          </h1>

          <p className="text-[13px] sm:text-base lg:text-lg mx-auto mt-4 max-w-2xl leading-relaxed text-gray-500 dark:text-gray-400 lg:mt-6">
            Mirror real-time stock and options trades from top-performing
            traders. Precision, flexibility, and transparency—straight to your
            fingertips.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:mt-10">
          <Link
            href="/register"
            className="group w-full sm:w-auto relative overflow-hidden rounded-full bg-[#000080] dark:bg-[#50C878] px-8 py-3 text-center text-sm font-semibold text-white dark:text-[#000025] transition-all hover:bg-[#0000b3] dark:hover:bg-[#3ab060] hover:shadow-xl hover:shadow-[#000080]/30 dark:hover:shadow-[#50C878]/25 hover:-translate-y-0.5 sm:px-10 sm:py-3.5"
          >
            <span className="relative z-10">Start Copying Now</span>
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto rounded-full border border-[#000080]/25 dark:border-[#50C878]/25 bg-white/50 dark:bg-white/[0.03] backdrop-blur-sm px-8 py-3 text-center text-sm font-semibold text-[#000080] dark:text-[#50C878] transition-all hover:border-[#000080] dark:hover:border-[#50C878] hover:bg-[#000080]/5 dark:hover:bg-[#50C878]/8 hover:-translate-y-0.5 sm:px-10 sm:py-3.5"
          >
            View Expert Traders
          </Link>
        </div>

        {/* Hero Image */}
        <div className="relative mx-auto mt-8 w-full max-w-xl lg:mt-14">
          <div className="relative">
            <div className="max-w-2xl">
              <Image
                src="/images/banner_image.png"
                alt="Network Illustration"
                width={1536}
                height={1024}
                className="rounded-2xl object-contain hidden dark:block"
              />
              <Image
                src="/images/banner_image_light.png"
                alt="Network Illustration"
                width={1536}
                height={1024}
                className="rounded-2xl object-contain block dark:hidden"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
