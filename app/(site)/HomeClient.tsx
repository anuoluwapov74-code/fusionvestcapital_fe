"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import LiquidityProvidersSection from "@/components/site/LiquidityProvidersSection";

// ─── Shared animation variants ────────────────────────────────
const vp = { once: true, margin: "-60px" };
const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.55 } },
};

const slideLeft = {
  hidden: { opacity: 0, x: -48 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease } },
};

const slideRight = {
  hidden: { opacity: 0, x: 48 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease } },
};

const staggerWrap = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

const staggerItem = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
};

// ─────────────────────────────────────────────────────────────
// HERO
// ─────────────────────────────────────────────────────────────

const ParticlesBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particleCount = 70;
    const connectionDistance = 140;

    class Particle {
      x: number; y: number; vx: number; vy: number; radius: number; isEmerald: boolean;
      constructor(c: HTMLCanvasElement) {
        this.x = Math.random() * c.width;
        this.y = Math.random() * c.height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 1.8 + 0.8;
        this.isEmerald = Math.random() > 0.65;
      }
      update(c: HTMLCanvasElement) {
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0 || this.x > c.width) this.vx *= -1;
        if (this.y < 0 || this.y > c.height) this.vy *= -1;
      }
      draw(c2d: CanvasRenderingContext2D) {
        c2d.beginPath();
        c2d.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        c2d.fillStyle = this.isEmerald ? "rgba(80,200,120,0.55)" : "rgba(80,80,255,0.35)";
        c2d.fill();
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
            ctx.strokeStyle = `rgba(80,200,120,${alpha})`;
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
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ background: "transparent" }} />;
};

const Hero = () => {
  const integrations = [
    ["TradeStation", "Tastytrade"],
    ["E-Trade", "WEBULL", "Schwab"],
    ["TD Ameritrade", "Interactive Brokers"],
  ];
  const [integIdx, setIntegIdx] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const t = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIntegIdx((i) => (i + 1) % integrations.length);
        setFade(true);
      }, 300);
    }, 3000);
    return () => clearInterval(t);
  }, [integrations.length]);

  return (
    <section className="relative overflow-hidden bg-[#00001a] lg:min-h-[calc(100vh-80px)]">
      <ParticlesBackground />

      {/* Glow orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-[#000080]/30 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute -top-20 right-1/4 w-[500px] h-[400px] bg-[#50C878]/8 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-[#50C878]/6 rounded-full blur-[110px] pointer-events-none" />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(80,200,120,1) 1px, transparent 1px), linear-gradient(90deg, rgba(80,200,120,1) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <motion.div
        className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-10 lg:pt-12 lg:pb-14"
        variants={staggerWrap}
        initial="hidden"
        animate="visible"
      >
        {/* Integration badge */}
        <motion.div variants={fadeUp} className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-[#50C878]/20 bg-[#50C878]/8 px-4 py-2">
            <span className="h-2 w-2 rounded-full bg-[#50C878] animate-pulse shrink-0" />
            <span className="text-xs font-semibold text-[#50C878] uppercase tracking-wider">
              Integrates with&nbsp;
              <span
                style={{
                  display: "inline-block",
                  transition: "opacity 0.3s, transform 0.3s",
                  opacity: fade ? 1 : 0,
                  transform: fade ? "translateY(0)" : "translateY(4px)",
                }}
              >
                {integrations[integIdx].join(" · ")}
              </span>
            </span>
          </div>
        </motion.div>

        {/* Headline — centered */}
        <div className="mx-auto max-w-4xl text-center">
          <motion.h1
            variants={fadeUp}
            className="text-[1.6rem] sm:text-[2.4rem] lg:text-[3.2rem] font-black leading-[1.08] tracking-tight text-white mb-5"
          >
            Copy Futures, Options & Contracts
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #a0a0ff 0%, #c8c8ff 40%, #50C878 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              with Precision
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-sm sm:text-base lg:text-lg text-white/55 leading-relaxed mx-auto max-w-2xl mb-8"
          >
            Mirror real-time stock and options trades from top-performing traders.
            Precision, flexibility, and transparency—straight to your fingertips.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="group w-full sm:w-auto flex items-center justify-center gap-2.5 rounded-full bg-[#50C878] px-10 py-3.5 text-sm font-black text-white transition-all duration-300 hover:bg-[#3ab060] hover:shadow-2xl hover:shadow-[#50C878]/35 hover:-translate-y-0.5"
            >
              Start Copying Now
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto flex items-center justify-center rounded-full border border-white/20 bg-white/5 backdrop-blur-sm px-10 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:border-white/35 hover:bg-white/10 hover:-translate-y-0.5"
            >
              View Expert Traders
            </Link>
          </motion.div>
        </div>

        {/* Banner image — below text */}
        <motion.div
          variants={fadeUp}
          className="relative mx-auto mt-10 w-full max-w-xl lg:mt-14"
        >
          <div className="absolute -inset-4 bg-[#50C878]/5 rounded-3xl blur-3xl pointer-events-none" />
          <Image
            src="/images/banner_image.png"
            alt="FusionVest Capital Platform"
            width={1536}
            height={1024}
            className="relative rounded-2xl object-contain hidden dark:block w-full"
            priority
          />
          <Image
            src="/images/banner_image_light.png"
            alt="FusionVest Capital Platform"
            width={1536}
            height={1024}
            className="relative rounded-2xl object-contain block dark:hidden w-full"
            priority
          />
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30 pointer-events-none">
        <span className="text-[10px] font-bold text-white uppercase tracking-[0.3em]">Scroll</span>
        <div className="h-8 w-px bg-gradient-to-b from-white to-transparent" />
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────────────────────
// STATS BAR
// ─────────────────────────────────────────────────────────────

const useCountUp = (end: number, duration = 2000) => {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let startTime: number;
    const animate = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      setCount(Math.floor((1 - Math.pow(1 - progress, 3)) * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [started, end, duration]);

  return { count, ref };
};

const StatBar = () => {
  const stats = [
    { value: 118, suffix: "+", label: "Active Traders", sub: "Expert verified" },
    { value: 10, suffix: "M+", label: "Total Volume", sub: "USD processed" },
    { value: 1, suffix: "M+", label: "Investors", sub: "Globally regulated" },
    { value: 73, suffix: "%", label: "Success Rate", sub: "Copy trading avg" },
  ];

  return (
    <motion.section
      className="bg-[#000080] py-0"
      variants={fadeIn}
      initial="hidden"
      whileInView="visible"
      viewport={vp}
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/10 divide-y lg:divide-y-0"
          variants={staggerWrap}
          initial="hidden"
          whileInView="visible"
          viewport={vp}
        >
          {stats.map((s, i) => {
            const { count, ref } = useCountUp(s.value);
            return (
              <motion.div key={i} ref={ref} variants={staggerItem} className="flex flex-col items-center justify-center py-10 px-6 text-center">
                <div className="text-4xl lg:text-6xl font-black text-white mb-2">
                  {count}{s.suffix}
                </div>
                <div className="text-sm font-black text-[#50C878] mb-0.5">{s.label}</div>
                <div className="text-xs text-white/40">{s.sub}</div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </motion.section>
  );
};

// ─────────────────────────────────────────────────────────────
// PROBLEM / SOLUTION
// ─────────────────────────────────────────────────────────────

const ProblemSolution = () => (
  <section className="py-24 lg:py-36">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <motion.div
        className="text-center mb-16 lg:mb-20"
        variants={fadeUp} initial="hidden" whileInView="visible" viewport={vp}
      >
        <p className="text-sm font-black uppercase tracking-widest text-[#000080] dark:text-[#50C878] mb-3">
          The Problem & Solution
        </p>
        <h2 className="text-4xl lg:text-6xl font-black tracking-tight">You should know...</h2>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Challenge */}
        <motion.div
          variants={slideLeft} initial="hidden" whileInView="visible" viewport={vp}
          className="group relative overflow-hidden rounded-3xl border border-red-200/50 dark:border-red-800/30 bg-red-50/70 dark:bg-red-950/30 backdrop-blur-sm p-10 lg:p-14 transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/8"
        >
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-red-500/8 rounded-full blur-3xl pointer-events-none" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full bg-red-100 dark:bg-red-900/40 border border-red-200/60 dark:border-red-700/30 px-4 py-1.5 mb-8">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              <span className="text-xs font-black text-red-600 dark:text-red-400 uppercase tracking-wide">The Challenge</span>
            </div>
            <div className="text-[6rem] font-black leading-none text-red-500/10 dark:text-red-400/10 select-none -mt-4 mb-2">
              89%
            </div>
            <h3 className="text-2xl lg:text-3xl font-black mb-5">Studying the market takes time</h3>
            <p className="text-base leading-relaxed text-gray-600 dark:text-gray-400">
              Building and maintaining a trading strategy is hard. Options require timing, strategy,
              and discipline. Only 11–26% of manual investors succeed on their own. The odds are stacked against you.
            </p>
          </div>
        </motion.div>

        {/* Solution */}
        <motion.div
          variants={slideRight} initial="hidden" whileInView="visible" viewport={vp}
          className="group relative overflow-hidden rounded-3xl border border-[#50C878]/20 dark:border-[#50C878]/20 bg-gradient-to-br from-[#50C878]/8 to-[#000080]/5 dark:from-[#50C878]/10 dark:to-[#000080]/20 backdrop-blur-sm p-10 lg:p-14 transition-all duration-300 hover:shadow-2xl hover:shadow-[#50C878]/10"
        >
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#50C878]/8 rounded-full blur-3xl pointer-events-none" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#50C878]/15 border border-[#50C878]/25 px-4 py-1.5 mb-8">
              <span className="h-2 w-2 rounded-full bg-[#50C878]" />
              <span className="text-xs font-black text-[#3ab060] dark:text-[#50C878] uppercase tracking-wide">The Solution</span>
            </div>
            <div className="text-[6rem] font-black leading-none text-[#50C878]/15 select-none -mt-4 mb-2">
              73%
            </div>
            <h3 className="text-2xl lg:text-3xl font-black mb-5">Beat the odds with Copy Trading</h3>
            <p className="text-base leading-relaxed text-gray-600 dark:text-gray-400 mb-10">
              Over 73% of investors generate profits by copying top leaders—especially in dynamic options markets.
              With FusionVest Capital, you replicate successful trades from seasoned traders and tilt the odds in your favor.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-2xl bg-[#000080] dark:bg-[#50C878] px-8 py-3.5 text-sm font-black text-white dark:text-[#000025] transition-all hover:bg-[#0000b3] dark:hover:bg-[#3ab060] hover:shadow-xl hover:shadow-[#000080]/25 dark:hover:shadow-[#50C878]/25 hover:-translate-y-0.5"
            >
              Start copy trading
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

// ─────────────────────────────────────────────────────────────
// HOW IT WORKS
// ─────────────────────────────────────────────────────────────

const HowItWorks = () => {
  const steps = [
    { number: "01", title: "Create Your Account", description: "Sign up in minutes and verify your identity to get started with our secure platform." },
    { number: "02", title: "Set Investment Amount", description: "Choose how much you want to invest and set your risk management preferences." },
    { number: "03", title: "Choose a Strategy", description: "Browse successful traders and select strategies that match your goals." },
    { number: "04", title: "Track & Grow", description: "Monitor your investments in real-time and watch your portfolio grow automatically." },
  ];

  return (
    <section id="how-it-works" className="relative py-24 lg:py-36 bg-[#00001a] overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] bg-[#000080]/18 rounded-full blur-[180px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16 lg:mb-20"
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={vp}
        >
          <p className="text-sm font-black uppercase tracking-widest text-[#50C878] mb-3">Simple Process</p>
          <h2 className="text-4xl lg:text-6xl font-black text-white">How it works</h2>
          <p className="mt-5 text-lg text-white/40 max-w-2xl mx-auto">
            Four steps to start copying expert options traders today.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          variants={staggerWrap} initial="hidden" whileInView="visible" viewport={vp}
        >
          {steps.map((step, i) => (
            <motion.div key={i} variants={staggerItem} className="group relative">
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[calc(50%+2.5rem)] right-[-2.5rem] h-px bg-gradient-to-r from-[#50C878]/30 to-transparent z-0" />
              )}
              <div className="relative z-10 rounded-3xl border border-white/7 bg-white/[0.03] backdrop-blur-sm p-8 transition-all duration-300 hover:border-[#50C878]/25 hover:bg-[#50C878]/5 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-[#50C878]/8">
                <div className="text-[3.5rem] font-black text-[#50C878]/15 leading-none mb-6 select-none">{step.number}</div>
                <div className="mb-5 h-11 w-11 rounded-xl bg-[#50C878]/15 flex items-center justify-center">
                  <div className="h-3 w-3 rounded-full bg-[#50C878]" />
                </div>
                <h3 className="text-base font-black text-white mb-3">{step.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────────────────────
// WHAT YOU CAN COPY — BENTO
// ─────────────────────────────────────────────────────────────

const WhatYouCanCopy = () => (
  <section className="py-24 lg:py-36">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <motion.div
        className="text-center mb-16 lg:mb-20"
        variants={fadeUp} initial="hidden" whileInView="visible" viewport={vp}
      >
        <p className="text-sm font-black uppercase tracking-widest text-[#000080] dark:text-[#50C878] mb-3">Instruments</p>
        <h2 className="text-4xl lg:text-6xl font-black">What you can copy</h2>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Large card */}
        <motion.div
          variants={slideLeft} initial="hidden" whileInView="visible" viewport={vp}
          className="lg:col-span-2 group relative overflow-hidden rounded-3xl border border-[#000080]/12 dark:border-[#50C878]/12 bg-gradient-to-br from-[#000080]/6 to-[#50C878]/4 dark:from-[#000080]/20 dark:to-[#50C878]/8 p-10 lg:p-14 transition-all duration-300 hover:border-[#000080]/25 dark:hover:border-[#50C878]/25 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#000080]/8 dark:hover:shadow-[#50C878]/8"
        >
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-[#000080]/8 dark:bg-[#50C878]/8 rounded-full blur-3xl pointer-events-none" />
          <div className="relative">
            <div className="h-16 w-16 rounded-3xl bg-[#000080]/10 dark:bg-[#50C878]/15 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
              <svg className="h-8 w-8 text-[#000080] dark:text-[#50C878]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <circle cx="12" cy="12" r="3" fill="currentColor" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v4m0 12v4M2 12h4m12 0h4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
              </svg>
            </div>
            <h3 className="text-2xl lg:text-3xl font-black mb-4">Multi-Leg Options Strategies</h3>
            <p className="text-base leading-relaxed text-gray-600 dark:text-gray-400 max-w-lg mb-8">
              Copy complex structures as a single unit: verticals, iron condors, butterflies, calendars, ratio spreads.
              We preserve leg ratios and timing—the most sophisticated execution in the industry.
            </p>
            <div className="flex flex-wrap gap-2">
              {["Verticals", "Iron Condors", "Butterflies", "Calendars", "Ratio Spreads"].map((tag) => (
                <span key={tag} className="rounded-full border border-[#000080]/15 dark:border-[#50C878]/20 bg-[#000080]/6 dark:bg-[#50C878]/8 px-4 py-1.5 text-xs font-bold text-[#000080] dark:text-[#50C878]">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Stacked small cards */}
        <motion.div
          className="grid grid-rows-2 gap-5"
          variants={staggerWrap} initial="hidden" whileInView="visible" viewport={vp}
        >
          {[
            {
              title: "Stocks & ETFs",
              desc: "Full-share or fractional allocations, instantaneous entry/exit mirroring, price-based T/P and S/L.",
              icon: (
                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              ),
              accent: "emerald",
            },
            {
              title: "Single-Leg Options",
              desc: "Replicate trade by trade: ticker, strike, expiry, premium, quantity, and timestamp.",
              icon: (
                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              ),
              accent: "navy",
            },
          ].map((item, i) => (
            <motion.div key={i} variants={staggerItem} className="group relative overflow-hidden rounded-3xl border border-[#000080]/8 dark:border-[#50C878]/8 bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm p-8 transition-all duration-300 hover:border-[#000080]/20 dark:hover:border-[#50C878]/20 hover:-translate-y-0.5 hover:shadow-xl">
              <div
                className={`mb-5 h-13 w-13 h-12 w-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${
                  item.accent === "emerald"
                    ? "bg-[#50C878]/12 dark:bg-[#50C878]/15 text-[#3ab060] dark:text-[#50C878]"
                    : "bg-[#000080]/8 dark:bg-[#000080]/25 text-[#000080] dark:text-[#a0a0ff]"
                }`}
              >
                {item.icon}
              </div>
              <h3 className="font-black text-base mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  </section>
);

// ─────────────────────────────────────────────────────────────
// FEATURES — BENTO GRID
// ─────────────────────────────────────────────────────────────

const featureList = [
  {
    title: "Transparent Options Copying",
    desc: "See exactly what you're mirroring—ticker, strategy, side, strike, expiry, entry/exit premium, size, timestamps—plus a clear history of each leader's performance and drawdowns.",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    accent: "navy",
    large: true,
  },
  {
    title: "Advanced Risk Tools",
    desc: "Per-trade caps, %-of-equity, max contracts, slippage guard, chain filters, auto-hedge toggles.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    accent: "emerald",
    large: false,
  },
  {
    title: "Multi-Leg Execution",
    desc: "Copy verticals, condors, butterflies. Legs synced, ratios preserved, best-effort routing.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    accent: "navy",
    large: false,
  },
  {
    title: "Human Support",
    desc: "Real people on chat, phone, and email for account linking, order settings, and contract questions.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    accent: "orange",
    large: false,
  },
  {
    title: "Learn While Copying",
    desc: "Leaders attach notes, rationale, and risk context to each trade. Use strategy tags and debriefs to sharpen your playbook.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    accent: "emerald",
    large: false,
  },
  {
    title: "AutoGuard™",
    desc: "Auto TP/SL by premium, % move, or delta. Smart protections built into every trade you copy.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3l7 7 7-7M5 21h14M7 21V10l5 5 5-5v11" />
      </svg>
    ),
    accent: "amber",
    large: false,
  },
];

const accentStyles: Record<string, string> = {
  navy: "bg-[#000080]/8 dark:bg-[#000080]/25 text-[#000080] dark:text-[#a0a0ff]",
  emerald: "bg-[#50C878]/12 dark:bg-[#50C878]/15 text-[#3ab060] dark:text-[#50C878]",
  orange: "bg-orange-50 dark:bg-orange-500/10 text-orange-500 dark:text-orange-400",
  amber: "bg-amber-50 dark:bg-amber-500/10 text-amber-500 dark:text-amber-400",
};

const Features = () => (
  <section id="features" className="py-24 lg:py-36 bg-[#00001a]">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <motion.div
        className="text-center mb-16 lg:mb-20"
        variants={fadeUp} initial="hidden" whileInView="visible" viewport={vp}
      >
        <p className="text-sm font-black uppercase tracking-widest text-[#50C878] mb-3">Platform Features</p>
        <h2 className="text-4xl lg:text-6xl font-black text-white">Why FusionVest Capital</h2>
        <p className="mt-5 text-lg text-white/40 max-w-2xl mx-auto">
          The most advanced copy trading platform with enterprise-grade security and lightning-fast execution.
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        variants={staggerWrap} initial="hidden" whileInView="visible" viewport={vp}
      >
        {featureList.map((f, i) => (
          <motion.div
            key={i}
            variants={staggerItem}
            className={`group relative overflow-hidden rounded-3xl border border-white/7 bg-white/[0.03] backdrop-blur-sm p-8 transition-all duration-300 hover:border-[#50C878]/20 hover:bg-[#50C878]/4 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#50C878]/6 ${
              f.large ? "md:col-span-2 lg:col-span-2 p-10 lg:p-12" : ""
            }`}
          >
            <div className="absolute -right-8 -top-8 w-36 h-36 bg-[#50C878]/4 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="relative">
              <div className={`mb-6 inline-flex rounded-2xl p-3.5 transition-transform duration-300 group-hover:scale-110 ${accentStyles[f.accent]}`}>
                {f.icon}
              </div>
              <h3 className={`font-black text-white mb-3 ${f.large ? "text-xl lg:text-2xl" : "text-base"}`}>{f.title}</h3>
              <p className={`text-white/45 leading-relaxed ${f.large ? "text-base max-w-xl" : "text-sm"}`}>{f.desc}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

// ─────────────────────────────────────────────────────────────
// TOP TRADERS
// ─────────────────────────────────────────────────────────────

interface TraderData {
  id: number;
  name: string;
  username: string;
  badge: string;
  gain: string;
  copiers: number;
  risk: number;
}

const gradients = [
  "from-[#000080] to-[#0000c8]",
  "from-[#006642] to-[#50C878]",
  "from-[#3d0066] to-[#8b00cc]",
];

const TopTraders = () => {
  const [traders, setTraders] = useState<TraderData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`${process.env.NEXT_PUBLIC_APP_BACKEND_ORIGIN}/traders/`, {
          headers: { "Content-Type": "application/json" },
        });
        if (r.ok) setTraders((await r.json()).slice(0, 3));
      } catch {}
      finally { setLoading(false); }
    })();
  }, []);

  return (
    <section className="py-24 lg:py-36">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16 lg:mb-20"
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={vp}
        >
          <p className="text-sm font-black uppercase tracking-widest text-[#000080] dark:text-[#50C878] mb-3">Top Performers</p>
          <h2 className="text-4xl lg:text-6xl font-black">Copy from the best</h2>
          <p className="mt-5 text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Our top-performing traders consistently deliver exceptional results across diverse strategies.
          </p>
        </motion.div>

        {!loading && traders.length > 0 && (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerWrap} initial="hidden" whileInView="visible" viewport={vp}
          >
            {traders.map((trader, i) => {
              const gain = parseFloat(trader.gain);
              const role = trader.badge === "gold" ? "Expert" : trader.badge === "silver" ? "Advanced" : "Trader";
              const riskLabel = trader.risk <= 3 ? "Low" : trader.risk <= 6 ? "Balanced" : "High";
              const riskColor = trader.risk <= 3 ? "#50C878" : trader.risk <= 6 ? "#f59e0b" : "#ef4444";

              return (
                <motion.div key={i} variants={staggerItem} className="group relative overflow-hidden rounded-3xl border border-[#000080]/10 dark:border-white/8 bg-white/60 dark:bg-white/[0.03] backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#000080]/10 dark:hover:shadow-[#50C878]/10 hover:border-[#000080]/20 dark:hover:border-[#50C878]/20">
                  {/* Gradient header */}
                  <div className={`bg-gradient-to-br ${gradients[i % gradients.length]} p-6 pb-12`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-12 w-12 rounded-2xl bg-white/15 flex items-center justify-center text-lg font-black text-white">
                        {trader.name.charAt(0)}
                      </div>
                      <span className="rounded-full bg-white/15 border border-white/20 px-3 py-1 text-xs font-black text-white uppercase tracking-wider">
                        {role}
                      </span>
                    </div>
                    <p className="text-xl font-black text-white">{trader.name}</p>
                    <p className="text-sm text-white/55">@{trader.username}</p>
                  </div>

                  {/* Pull-up stats panel */}
                  <div className="relative -mt-7 mx-4 rounded-2xl border border-[#000080]/10 dark:border-white/8 bg-white dark:bg-[#00001a] p-5 shadow-lg">
                    <div className="grid grid-cols-3 gap-2 text-center mb-5">
                      <div>
                        <p className="text-xl font-black">{trader.copiers}</p>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">Copiers</p>
                      </div>
                      <div>
                        <p className={`text-xl font-black ${gain >= 0 ? "text-[#50C878]" : "text-red-500"}`}>
                          {gain >= 0 ? "+" : ""}{gain.toFixed(1)}%
                        </p>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">1M Profit</p>
                      </div>
                      <div>
                        <p className="text-xl font-black" style={{ color: riskColor }}>{riskLabel}</p>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">Risk</p>
                      </div>
                    </div>

                    {/* Risk bar */}
                    <div className="mb-5 h-1.5 rounded-full bg-gray-100 dark:bg-white/8 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${(trader.risk / 10) * 100}%`, background: riskColor }}
                      />
                    </div>

                    <Link
                      href="/login"
                      className="flex items-center justify-center w-full rounded-xl bg-[#000080] dark:bg-[#50C878] py-3 text-sm font-black text-white dark:text-[#000025] transition-all hover:bg-[#0000b3] dark:hover:bg-[#3ab060] hover:shadow-lg hover:shadow-[#000080]/20 dark:hover:shadow-[#50C878]/25 hover:-translate-y-0.5"
                    >
                      Copy Trader
                    </Link>
                  </div>
                  <div className="pb-4" />
                </motion.div>
              );
            })}
          </motion.div>
        )}

        <div className="mt-12 flex justify-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-2.5 rounded-2xl border border-[#000080]/25 dark:border-[#50C878]/25 bg-transparent px-9 py-4 text-sm font-black text-[#000080] dark:text-[#50C878] transition-all hover:border-[#000080] dark:hover:border-[#50C878] hover:bg-[#000080]/5 dark:hover:bg-[#50C878]/8 hover:-translate-y-0.5"
          >
            View All Traders
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────────────────────
// TRUST
// ─────────────────────────────────────────────────────────────

const Trust = () => {
  const items = [
    {
      title: "Social",
      desc: "More than 35 million users globally",
      stat: "35M+",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      accent: "navy",
    },
    {
      title: "Reliable",
      desc: "A leader in fintech since 2007",
      stat: "17yrs",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      accent: "emerald",
    },
    {
      title: "Secured",
      desc: "Bank-level encryption for client safety",
      stat: "256-bit",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      accent: "navy",
    },
    {
      title: "Global",
      desc: "Providing services around the world",
      stat: "150+ Countries",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      accent: "emerald",
    },
  ];

  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-5"
          variants={staggerWrap} initial="hidden" whileInView="visible" viewport={vp}
        >
          {items.map((item, i) => (
            <motion.div key={i} variants={staggerItem} className="group relative overflow-hidden rounded-3xl border border-[#000080]/8 dark:border-[#50C878]/8 bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm p-7 lg:p-9 text-center transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-[#000080]/20 dark:hover:border-[#50C878]/20">
              <div className={`mb-4 mx-auto h-13 w-13 h-12 w-12 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${
                item.accent === "navy"
                  ? "bg-[#000080]/8 dark:bg-[#000080]/20 text-[#000080] dark:text-[#a0a0ff]"
                  : "bg-[#50C878]/12 dark:bg-[#50C878]/15 text-[#3ab060] dark:text-[#50C878]"
              }`}>
                {item.icon}
              </div>
              <div
                className="text-2xl font-black mb-1"
                style={{
                  background: "linear-gradient(135deg, #000080, #50C878)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {item.stat}
              </div>
              <p className="font-black text-sm mb-1">{item.title}</p>
              <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────────────────────
// FAQ
// ─────────────────────────────────────────────────────────────

const faqData = [
  { q: "Do I need trading experience?", a: "No experience required. Our platform is designed for beginners and experts alike. Start copying immediately and learn as you go." },
  { q: "Can I stop copying anytime?", a: "Yes—start or stop copying any trader with one click. No lock-in periods or penalties for stopping." },
  { q: "Is my money safe?", a: "Your funds stay in your own brokerage account. We use bank-level encryption. We never have direct access to your funds." },
  { q: "What is the minimum investment?", a: "You can start with as little as $500, but we recommend $1,000+ for better diversification across strategies." },
];

const FAQ = () => {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-24 lg:py-36">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-start">

          {/* Left — sticky header */}
          <motion.div
            className="lg:col-span-2 lg:sticky lg:top-32"
            variants={slideLeft} initial="hidden" whileInView="visible" viewport={vp}
          >
            <p className="text-sm font-black uppercase tracking-widest text-[#000080] dark:text-[#50C878] mb-3">FAQ</p>
            <h2 className="text-4xl lg:text-5xl font-black mb-6 leading-tight">Your Questions,<br />Answered</h2>
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-10 leading-relaxed">
              Everything you need to know about copy trading with FusionVest Capital.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-2xl bg-[#000080] dark:bg-[#50C878] px-8 py-4 text-sm font-black text-white dark:text-[#000025] transition-all hover:bg-[#0000b3] dark:hover:bg-[#3ab060] hover:shadow-xl hover:shadow-[#000080]/25 dark:hover:shadow-[#50C878]/25 hover:-translate-y-0.5"
            >
              Get started free
            </Link>
          </motion.div>

          {/* Right — accordion */}
          <motion.div
            className="lg:col-span-3 space-y-3"
            variants={staggerWrap} initial="hidden" whileInView="visible" viewport={vp}
          >
            {faqData.map((faq, i) => (
              <motion.div key={i} variants={staggerItem} className="group rounded-3xl border border-[#000080]/8 dark:border-[#50C878]/8 bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-[#000080]/18 dark:hover:border-[#50C878]/18">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="flex w-full items-center justify-between p-6 text-left gap-4"
                >
                  <span className={`font-black text-base leading-snug transition-colors ${open === i ? "text-[#000080] dark:text-[#50C878]" : ""}`}>
                    {faq.q}
                  </span>
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                    open === i
                      ? "bg-[#000080] dark:bg-[#50C878] text-white dark:text-[#000025] rotate-45 scale-110"
                      : "bg-[#000080]/7 dark:bg-[#50C878]/10 text-gray-400"
                  }`}>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </span>
                </button>
                <div className={`overflow-hidden transition-all duration-500 ${open === i ? "max-h-64 opacity-100" : "max-h-0 opacity-0"}`}>
                  <p className="px-6 pb-6 text-base text-gray-500 dark:text-gray-400 leading-relaxed">{faq.a}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────────────────────
// TEAM
// ─────────────────────────────────────────────────────────────

const Team = () => {
  const [idx, setIdx] = useState(0);
  const members = [
    { name: "Troy Johnson", role: "Chief Executive Officer", image: "/team/troy.jpg" },
    { name: "Sarah Chen", role: "Chief Technology Officer", image: "/team/sarah.jpg" },
    { name: "Michael Roberts", role: "Chief Financial Officer", image: "/team/michael.jpg" },
    { name: "Emily Davis", role: "Head of Operations", image: "/team/emily.jpg" },
    { name: "David Kim", role: "Head of Security", image: "/team/david.jpg" },
  ];
  const m = members[idx];

  return (
    <section className="relative overflow-hidden py-24 lg:py-36 bg-gradient-to-br from-[#00002e] via-[#000020] to-[#000035]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#000080]/18 rounded-full blur-[200px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[350px] h-[350px] bg-[#50C878]/7 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#50C878]/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">

          {/* Left */}
          <motion.div
            variants={slideLeft} initial="hidden" whileInView="visible" viewport={vp}
          >
            <p className="text-sm font-black uppercase tracking-widest text-[#50C878] mb-3">Our People</p>
            <h2 className="text-4xl lg:text-6xl font-black text-white mb-6">Meet Our Team</h2>
            <p className="text-lg text-white/45 leading-relaxed mb-10">
              Industry veterans with deep expertise in fintech, stock trading, financial management,
              and cybersecurity—united by a shared commitment to innovation.
            </p>
            {/* Pill indicators */}
            <div className="flex gap-3">
              {members.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === idx ? "w-10 h-2.5 bg-[#50C878]" : "w-2.5 h-2.5 bg-white/20 hover:bg-[#50C878]/50"
                  }`}
                />
              ))}
            </div>
          </motion.div>

          {/* Right — carousel */}
          <motion.div
            className="relative flex items-center justify-center"
            variants={slideRight} initial="hidden" whileInView="visible" viewport={vp}
          >
            <button
              onClick={() => setIdx((i) => (i - 1 + members.length) % members.length)}
              className="absolute left-0 z-10 h-12 w-12 flex items-center justify-center rounded-2xl border border-[#50C878]/20 text-[#50C878]/60 transition-all hover:bg-[#50C878]/10 hover:border-[#50C878]/50 hover:text-[#50C878]"
              aria-label="Previous"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div key={idx} className="flex flex-col items-center text-center" style={{ animation: "fadeUp 0.4s ease" }}>
              <div className="relative mb-7">
                <div className="h-52 w-52 lg:h-60 lg:w-60 rounded-3xl border border-[#50C878]/20 overflow-hidden bg-[#000040]">
                  <Image src={m.image} alt={m.name} width={240} height={240} className="h-full w-full object-cover" />
                </div>
                <div className="absolute -inset-4 rounded-3xl bg-[#50C878]/5 blur-2xl -z-10" />
              </div>
              <h3 className="text-2xl font-black text-white mb-1">{m.name}</h3>
              <p className="text-[#50C878] font-semibold">{m.role}</p>
            </div>

            <button
              onClick={() => setIdx((i) => (i + 1) % members.length)}
              className="absolute right-0 z-10 h-12 w-12 flex items-center justify-center rounded-2xl border border-[#50C878]/20 text-[#50C878]/60 transition-all hover:bg-[#50C878]/10 hover:border-[#50C878]/50 hover:text-[#50C878]"
              aria-label="Next"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────────────────────
// FINAL CTA
// ─────────────────────────────────────────────────────────────

const FinalCTA = () => (
  <section className="relative overflow-hidden py-28 lg:py-40">
    <div className="absolute inset-0 bg-gradient-to-br from-[#000080] via-[#00009a] to-[#000060]" />
    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#50C878]/10 rounded-full blur-[180px] pointer-events-none" />
    <div className="absolute bottom-0 left-0 w-[500px] h-[400px] bg-[#000040]/60 rounded-full blur-[150px] pointer-events-none" />
    <div
      className="absolute inset-0 opacity-[0.03] pointer-events-none"
      style={{
        backgroundImage: "linear-gradient(rgba(80,200,120,1) 1px, transparent 1px), linear-gradient(90deg, rgba(80,200,120,1) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
      }}
    />

    <motion.div
      className="relative mx-auto max-w-4xl px-4 text-center"
      variants={staggerWrap} initial="hidden" whileInView="visible" viewport={vp}
    >
      <motion.p variants={fadeUp} className="text-sm font-black uppercase tracking-widest text-[#50C878] mb-6">Get Started</motion.p>
      <motion.h2 variants={fadeUp} className="text-5xl lg:text-7xl font-black text-white leading-[0.95] mb-8">
        Ready to Invest<br />
        <span
          style={{
            background: "linear-gradient(135deg, #50C878, #6de496, #50C878)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Smarter?
        </span>
      </motion.h2>
      <motion.p variants={fadeUp} className="text-xl text-white/50 mb-14 max-w-2xl mx-auto leading-relaxed">
        Join over 1 million investors already copying the world's best traders. Start in minutes, no experience needed.
      </motion.p>

      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-5 justify-center mb-16">
        <Link
          href="/register"
          className="group inline-flex items-center justify-center gap-2.5 rounded-2xl bg-[#50C878] px-12 py-5 text-base font-black text-white transition-all duration-300 hover:bg-[#3ab060] hover:shadow-2xl hover:shadow-[#50C878]/40 hover:-translate-y-1.5"
        >
          Get started free
          <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
        <Link
          href="/login"
          className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/8 backdrop-blur-sm px-12 py-5 text-base font-bold text-white transition-all hover:border-white/35 hover:bg-white/12 hover:-translate-y-1.5"
        >
          View Expert Traders
        </Link>
      </motion.div>

      {/* 3-step mini grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        variants={staggerWrap}
      >
        {[
          { step: "01", title: "Create Account", desc: "Join now to unlock copy trading" },
          { step: "02", title: "Find Your Match", desc: "Explore leaders known for success in options" },
          { step: "03", title: "Copy & Grow", desc: "Replicate trades, stay in control" },
        ].map((s, i) => (
          <motion.div key={i} variants={staggerItem} className="rounded-2xl border border-white/10 bg-white/6 backdrop-blur-sm p-6 text-left">
            <p className="text-[10px] font-black text-[#50C878]/50 uppercase tracking-widest mb-3">Step {s.step}</p>
            <p className="text-white font-black text-base mb-1.5">{s.title}</p>
            <p className="text-white/40 text-sm leading-relaxed">{s.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  </section>
);

// ─────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────

export default function HomeClient() {
  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <Navbar />
      <main className="pt-16 lg:pt-20">
        <Hero />
        <StatBar />
        <ProblemSolution />
        <HowItWorks />
        <WhatYouCanCopy />
        <Features />
        <TopTraders />
        <Trust />
        <FAQ />
        <Team />
        <LiquidityProvidersSection />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
