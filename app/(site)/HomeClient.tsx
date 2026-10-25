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

/** Small reusable "eyebrow" label — accent line + uppercase tracking */
const Eyebrow = ({ children, dark = true }: { children: React.ReactNode; dark?: boolean }) => (
  <p className={`inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest mb-4 ${dark ? "text-[#50C878]" : "text-[#000080] dark:text-[#50C878]"}`}>
    <span className={`w-5 h-px ${dark ? "bg-[#50C878]" : "bg-[#000080] dark:bg-[#50C878]"}`} />
    {children}
  </p>
);

// ─────────────────────────────────────────────────────────────
// PARTICLES BACKGROUND
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

// ─────────────────────────────────────────────────────────────
// HERO
// ─────────────────────────────────────────────────────────────

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

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-[#000080]/30 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute -top-20 right-1/4 w-[500px] h-[400px] bg-[#50C878]/8 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-[#50C878]/6 rounded-full blur-[110px] pointer-events-none" />

      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(80,200,120,1) 1px, transparent 1px), linear-gradient(90deg, rgba(80,200,120,1) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <motion.div
        className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 pb-16 lg:pt-16 lg:pb-20"
        variants={staggerWrap}
        initial="hidden"
        animate="visible"
      >
        <div className="mx-auto max-w-4xl text-center">
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

          <motion.h1
            variants={fadeUp}
            className="text-[2.2rem] sm:text-[3rem] lg:text-[4rem] font-black leading-[1.08] tracking-tight text-white mb-6"
          >
            Your edge isn&apos;t a
            <br />
            better guess.{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #a0a0ff 0%, #c8c8ff 40%, #50C878 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              It&apos;s a better copy.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-sm sm:text-base lg:text-lg text-white/55 leading-relaxed mx-auto max-w-2xl mb-8"
          >
            Mirror futures, options, and equity trades from vetted leaders the instant they
            execute — full position detail, zero guesswork, your capital never leaves your account.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
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

          {/* Social proof strip */}
          <motion.div variants={fadeUp} className="flex items-center justify-center gap-x-8 gap-y-3 flex-wrap">
            {[
              { v: "118+", l: "Active Traders" },
              { v: "1M+", l: "Investors" },
              { v: "4.8★", l: "Rating" },
            ].map(({ v, l }, i) => (
              <React.Fragment key={l}>
                <div className="text-center">
                  <p className="text-xl font-black text-white leading-none mb-1">{v}</p>
                  <p className="text-[10px] text-white/40 uppercase tracking-wide">{l}</p>
                </div>
                {i < 2 && <div className="hidden sm:block w-px h-7 bg-white/10" />}
              </React.Fragment>
            ))}
          </motion.div>
        </div>
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
// MARQUEE TICKER
// ─────────────────────────────────────────────────────────────

const TICKER_DATA = [
  { s: "AAPL", p: "$213.49", c: "+0.9%", up: true },
  { s: "TSLA", p: "$412.23", c: "+3.2%", up: true },
  { s: "MSFT", p: "$421.80", c: "+1.1%", up: true },
  { s: "NVDA", p: "$875.40", c: "+4.7%", up: true },
  { s: "AMZN", p: "$185.62", c: "+1.4%", up: true },
  { s: "GOOGL", p: "$174.30", c: "−0.3%", up: false },
  { s: "SPX", p: "$5,842.10", c: "+0.6%", up: true },
  { s: "ES=F", p: "$5,851.25", c: "+0.5%", up: true },
  { s: "CL=F", p: "$78.92", c: "−0.8%", up: false },
  { s: "BTC-USD", p: "$67,412", c: "+2.3%", up: true },
  { s: "ETH-USD", p: "$3,281", c: "+1.9%", up: true },
  { s: "EUR/USD", p: "1.0847", c: "+0.2%", up: true },
  { s: "GOLD", p: "$2,614.80", c: "+0.4%", up: true },
  { s: "JPM", p: "$198.34", c: "+0.3%", up: true },
];

const MarqueeTicker = () => (
  <div className="relative overflow-hidden bg-[#00001a] border-y border-white/8 py-3">
    <div className="absolute left-0 inset-y-0 w-16 bg-gradient-to-r from-[#00001a] to-transparent z-10 pointer-events-none" />
    <div className="absolute right-0 inset-y-0 w-16 bg-gradient-to-l from-[#00001a] to-transparent z-10 pointer-events-none" />
    <div className="flex w-max animate-[marqueeScroll_38s_linear_infinite] hover:[animation-play-state:paused]">
      {[...TICKER_DATA, ...TICKER_DATA].map(({ s, p, c, up }, i) => (
        <div key={i} className="flex items-center gap-2.5 shrink-0 px-6">
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${up ? "bg-[#50C878]" : "bg-red-500"}`} />
          <span className="text-[12px] font-semibold text-white/45 tracking-wide">{s}</span>
          <span className="text-[12px] font-black text-white">{p}</span>
          <span className={`text-[11px] font-bold ${up ? "text-[#50C878]" : "text-red-400"}`}>{c}</span>
          <span className="w-px h-3.5 bg-white/15 ml-3" />
        </div>
      ))}
    </div>
    <style>{`
      @keyframes marqueeScroll {
        from { transform: translateX(0); }
        to { transform: translateX(-50%); }
      }
    `}</style>
  </div>
);

// ─────────────────────────────────────────────────────────────
// STAT BAR — asymmetric: one hero stat + 3 supporting
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
  const hero = { value: 10, suffix: "M+", label: "Total Volume Copied", sub: "USD processed through the platform" };
  const supporting = [
    { value: 118, suffix: "+", label: "Verified Leaders" },
    { value: 1, suffix: "M+", label: "Investors Onboard" },
    { value: 73, suffix: "%", label: "Avg. Copy Success Rate" },
  ];
  const heroCount = useCountUp(hero.value);

  return (
    <motion.section
      className="bg-[#00001e] py-16 lg:py-20"
      variants={fadeIn} initial="hidden" whileInView="visible" viewport={vp}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-[1.2fr_1px_1fr] gap-8 lg:gap-0 items-center"
          variants={staggerWrap} initial="hidden" whileInView="visible" viewport={vp}
        >
          {/* Hero stat */}
          <motion.div ref={heroCount.ref} variants={staggerItem} className="text-center lg:text-left lg:pr-14">
            <div className="text-6xl lg:text-8xl font-black text-white leading-none mb-3">
              {heroCount.count}{hero.suffix}
            </div>
            <p className="text-base font-black text-[#50C878] mb-1">{hero.label}</p>
            <p className="text-sm text-white/35">{hero.sub}</p>
          </motion.div>

          <div className="hidden lg:block h-28 bg-white/10" />

          {/* Supporting stats */}
          <motion.div className="grid grid-cols-3 lg:grid-cols-1 gap-6 lg:gap-7 lg:pl-14" variants={staggerWrap}>
            {supporting.map((s, i) => {
              const { count, ref } = useCountUp(s.value);
              return (
                <motion.div key={i} ref={ref} variants={staggerItem} className="text-center lg:text-left">
                  <div className="text-2xl lg:text-3xl font-black text-white leading-none mb-1">
                    {count}{s.suffix}
                  </div>
                  <p className="text-xs text-white/40 uppercase tracking-wide">{s.label}</p>
                </motion.div>
              );
            })}
          </motion.div>
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
        <Eyebrow dark={false}>The Reality Check</Eyebrow>
        <h2 className="text-4xl lg:text-6xl font-black tracking-tight">
          The odds aren&apos;t in your favor. <span className="text-[#50C878]">Yet.</span>
        </h2>
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
              <span className="text-xs font-black text-red-600 dark:text-red-400 uppercase tracking-wide">Trading Solo</span>
            </div>
            <div className="text-[6rem] font-black leading-none text-red-500/10 dark:text-red-400/10 select-none -mt-4 mb-2">
              89%
            </div>
            <h3 className="text-2xl lg:text-3xl font-black mb-5">Most self-directed traders lose money</h3>
            <p className="text-base leading-relaxed text-gray-600 dark:text-gray-400">
              Reading charts isn&apos;t a strategy. Options demand timing, sizing, and discipline most
              people never get the reps to build — so 89% of manual, self-taught traders finish behind
              where they started.
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
              <span className="text-xs font-black text-[#3ab060] dark:text-[#50C878] uppercase tracking-wide">Copying Leaders</span>
            </div>
            <div className="text-[6rem] font-black leading-none text-[#50C878]/15 select-none -mt-4 mb-2">
              73%
            </div>
            <h3 className="text-2xl lg:text-3xl font-black mb-5">Borrow the discipline, keep the upside</h3>
            <p className="text-base leading-relaxed text-gray-600 dark:text-gray-400 mb-10">
              73% of investors who copy a vetted leader land in the green — the strategy, sizing, and
              timing are already proven. You bring the capital and the decision to follow; Uphold
              Capitals handles the mirroring in real time.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-2xl bg-[#000080] dark:bg-[#50C878] px-8 py-3.5 text-sm font-black text-white dark:text-[#000025] transition-all hover:bg-[#0000b3] dark:hover:bg-[#3ab060] hover:shadow-xl hover:shadow-[#000080]/25 dark:hover:shadow-[#50C878]/25 hover:-translate-y-0.5"
            >
              Flip the odds
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
// WHAT YOU CAN COPY — BENTO
// ─────────────────────────────────────────────────────────────

const WhatYouCanCopy = () => (
  <section className="py-24 lg:py-36">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <motion.div
        className="text-center mb-16 lg:mb-20"
        variants={fadeUp} initial="hidden" whileInView="visible" viewport={vp}
      >
        <Eyebrow dark={false}>Instruments</Eyebrow>
        <h2 className="text-4xl lg:text-6xl font-black">Every position, down to the leg</h2>
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
            <h3 className="text-2xl lg:text-3xl font-black mb-4">Multi-leg strategies, copied as one unit</h3>
            <p className="text-base leading-relaxed text-gray-600 dark:text-gray-400 max-w-lg mb-8">
              Iron condors, calendars, verticals, ratio spreads — we sync every leg&apos;s ratio and
              timing so the structure you&apos;re copying arrives intact, not fragmented across fills.
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
              desc: "Full-share or fractional allocations, instant entry/exit mirroring, price-based T/P and S/L.",
              icon: (
                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              ),
              accent: "emerald",
            },
            {
              title: "Single-Leg Options",
              desc: "Ticker, strike, expiry, premium, quantity, and timestamp — replicated trade for trade.",
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
                className={`mb-5 h-12 w-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${
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
// FEATURES — BENTO GRID WITH STAT CALLOUTS
// ─────────────────────────────────────────────────────────────

const featureList = [
  {
    title: "Nothing hidden, nothing delayed",
    desc: "Ticker, strategy, side, strike, expiry, premium, size, timestamp — plus the leader's full drawdown history. If it's in their book, it's in yours.",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    accent: "navy",
    large: true,
    stat: "100%",
    statLabel: "position transparency",
  },
  {
    title: "Risk you set, not risk you inherit",
    desc: "Per-trade caps, %-of-equity limits, max contracts, slippage guards, auto-hedge toggles.",
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
    desc: "Verticals, condors, butterflies synced leg-for-leg with best-effort routing.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    accent: "navy",
    large: false,
  },
  {
    title: "Real humans, not a ticket queue",
    desc: "Chat, phone, and email with people who actually understand account linking and contract mechanics.",
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
    desc: "Leaders attach notes and rationale to every trade — sharpen your own playbook as you go.",
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
    desc: "Auto TP/SL by premium, % move, or delta — protection built into every copied trade.",
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
        <Eyebrow>Platform Features</Eyebrow>
        <h2 className="text-4xl lg:text-6xl font-black text-white">Built to earn your trust first</h2>
        <p className="mt-5 text-lg text-white/40 max-w-2xl mx-auto">
          Every feature here exists because a trader asked for it after getting burned somewhere else.
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
              f.large ? "md:col-span-2 lg:col-span-2 p-10 lg:p-12 flex flex-col justify-between" : ""
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
            {f.large && f.stat && (
              <div className="relative mt-8 pt-6 border-t border-white/8 flex items-baseline gap-3">
                <span className="text-4xl font-black text-[#50C878]">{f.stat}</span>
                <span className="text-xs text-white/35 uppercase tracking-wide">{f.statLabel}</span>
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

// ─────────────────────────────────────────────────────────────
// HOW IT WORKS — connected horizontal timeline
// ─────────────────────────────────────────────────────────────

const HowItWorks = () => {
  const steps = [
    { number: "01", title: "Create your account", description: "Sign up in minutes and verify your identity on a platform built for compliance from day one." },
    { number: "02", title: "Set your boundaries", description: "Pick an investment amount and dial in risk limits before a single trade gets copied." },
    { number: "03", title: "Choose who to follow", description: "Browse verified leaders by strategy, risk score, and track record — not just a headline return." },
    { number: "04", title: "Let it run, stay in control", description: "Watch positions mirror in real time. Pause, resize, or stop copying any leader in one tap." },
  ];

  return (
    <section id="how-it-works" className="relative py-24 lg:py-36 bg-[#00001a] overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] bg-[#000080]/18 rounded-full blur-[180px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16 lg:mb-20"
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={vp}
        >
          <Eyebrow>Simple Process</Eyebrow>
          <h2 className="text-4xl lg:text-6xl font-black text-white">From sign-up to your first copy</h2>
          <p className="mt-5 text-lg text-white/40 max-w-2xl mx-auto">
            No prior trading experience required — just a decision about who to trust.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative"
          variants={staggerWrap} initial="hidden" whileInView="visible" viewport={vp}
        >
          <div className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-[#50C878]/25 to-transparent z-0" />
          {steps.map((step, i) => (
            <motion.div key={i} variants={staggerItem} className="group relative z-10">
              <div className="rounded-3xl border border-white/7 bg-white/[0.03] backdrop-blur-sm p-8 h-full transition-all duration-300 hover:border-[#50C878]/25 hover:bg-[#50C878]/5 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-[#50C878]/8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-11 w-11 rounded-2xl bg-[#50C878] flex items-center justify-center text-[#000025] text-sm font-black shrink-0">
                    {step.number}
                  </div>
                  {i < steps.length - 1 && <div className="hidden lg:block flex-1 h-px bg-white/10" />}
                </div>
                <h3 className="text-base font-black text-white mb-3">{step.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={vp} className="mt-14 text-center">
          <Link
            href="/register"
            className="inline-flex items-center gap-2.5 rounded-full bg-[#50C878] px-10 py-4 text-sm font-black text-white hover:bg-[#3ab060] hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#50C878]/30 transition-all duration-300"
          >
            Start the first step
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────────────────────
// TOP TRADERS — live data from the backend
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
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16 lg:mb-20 gap-6"
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={vp}
        >
          <div>
            <Eyebrow dark={false}>Top Performers</Eyebrow>
            <h2 className="text-4xl lg:text-6xl font-black">Follow the track record, not the hype</h2>
          </div>
          <p className="text-base text-gray-500 dark:text-gray-400 max-w-sm">
            Every leader below is ranked on verified, audited performance — not self-reported screenshots.
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
// TRUST — stat band + regulatory badges
// ─────────────────────────────────────────────────────────────

const Trust = () => {
  const items = [
    { title: "Social", desc: "Investors trading alongside you right now", stat: "35M+" },
    { title: "Reliable", desc: "A leader in fintech infrastructure since 2007", stat: "17yrs" },
    { title: "Secured", desc: "Bank-level encryption on every connection", stat: "256-bit" },
    { title: "Global", desc: "Available to investors across the world", stat: "150+" },
  ];
  const badges = ["Regulated Entity", "Segregated Client Funds", "256-bit SSL", "SOC 2 Aligned"];

  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-14"
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={vp}
        >
          <Eyebrow dark={false}>Why Investors Stay</Eyebrow>
          <h2 className="text-4xl lg:text-5xl font-black">Trust isn&apos;t a tagline here</h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10"
          variants={staggerWrap} initial="hidden" whileInView="visible" viewport={vp}
        >
          {items.map((item, i) => (
            <motion.div key={i} variants={staggerItem} className="group relative overflow-hidden rounded-3xl border border-[#000080]/8 dark:border-[#50C878]/8 bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm p-7 lg:p-9 text-center transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-[#000080]/20 dark:hover:border-[#50C878]/20">
              <div
                className="text-3xl font-black mb-2"
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

        <motion.div
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={vp}
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3"
        >
          {badges.map((b, i) => (
            <React.Fragment key={b}>
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-1.5 whitespace-nowrap">
                <svg className="w-3.5 h-3.5 text-[#50C878]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                {b}
              </span>
              {i < badges.length - 1 && <span className="hidden sm:block w-px h-3 bg-gray-300 dark:bg-white/15" />}
            </React.Fragment>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────────────────────
// TESTIMONIALS — one featured + two stacked
// ─────────────────────────────────────────────────────────────

const FEATURED_REVIEW = {
  initials: "MV",
  grad: "from-[#000080] to-[#0000c8]",
  name: "Marcus Villanueva",
  handle: "Copying since 2024 · Multi-leg options",
  stars: 5,
  text: "Three months into copy trading with UpholdTrades and my returns have already beaten a full year of trading on my own. The transparency on every leg is what sold me — I can see exactly what I'm mirroring, every single time, down to the strike and the timestamp.",
};

const SIDE_REVIEWS = [
  {
    initials: "SK",
    grad: "from-[#006642] to-[#50C878]",
    name: "Sarah Kim",
    handle: "Copying since 2023",
    stars: 5,
    text: "AutoGuard is the feature I didn't know I needed. I set a max drawdown once and never think about it again.",
  },
  {
    initials: "DO",
    grad: "from-[#3d0066] to-[#8b00cc]",
    name: "Daniel Osei",
    handle: "Copying since 2024",
    stars: 5,
    text: "Three strategies running at once, and the dashboard makes it dead simple to see which leader is actually earning their keep.",
  },
];

const Stars = ({ count }: { count: number }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: count }).map((_, j) => (
      <svg key={j} className="w-3.5 h-3.5 fill-amber-400" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ))}
  </div>
);

const Testimonials = () => (
  <section className="py-24 lg:py-36 bg-[#00001a] overflow-hidden">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <motion.div
        className="flex flex-col lg:flex-row lg:items-end justify-between mb-14 lg:mb-20 gap-6"
        variants={fadeUp} initial="hidden" whileInView="visible" viewport={vp}
      >
        <div>
          <Eyebrow>Testimonials</Eyebrow>
          <h2 className="text-4xl lg:text-6xl font-black text-white leading-[1.08]">Loved by investors worldwide.</h2>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 shrink-0">
          <p className="text-xs text-white/40 mb-0.5">Trustpilot</p>
          <div className="flex items-center gap-1.5">
            <Stars count={5} />
            <span className="text-sm font-bold text-white ml-1">4.8</span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Featured — large */}
        <motion.div
          variants={slideLeft} initial="hidden" whileInView="visible" viewport={vp}
          className="lg:col-span-3 relative rounded-3xl bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 p-10 lg:p-12 flex flex-col justify-between"
        >
          <span className="absolute top-6 right-8 text-[7rem] font-black leading-none text-white/[0.04] select-none">
            &ldquo;
          </span>
          <div className="relative">
            <Stars count={FEATURED_REVIEW.stars} />
            <p className="mt-6 text-xl lg:text-2xl text-white/80 leading-relaxed font-medium">
              &ldquo;{FEATURED_REVIEW.text}&rdquo;
            </p>
          </div>
          <div className="relative flex items-center gap-3 mt-10">
            <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${FEATURED_REVIEW.grad} flex items-center justify-center text-white text-sm font-black shrink-0`}>
              {FEATURED_REVIEW.initials}
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-none mb-1">{FEATURED_REVIEW.name}</p>
              <p className="text-[11px] text-white/35">{FEATURED_REVIEW.handle}</p>
            </div>
          </div>
        </motion.div>

        {/* Side — stacked smaller */}
        <motion.div className="lg:col-span-2 flex flex-col gap-5" variants={staggerWrap} initial="hidden" whileInView="visible" viewport={vp}>
          {SIDE_REVIEWS.map(({ initials, grad, name, handle, stars, text }) => (
            <motion.div
              key={name}
              variants={staggerItem}
              className="relative rounded-3xl bg-white/[0.03] border border-white/8 p-7 flex-1 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:border-[#50C878]/20"
            >
              <Stars count={stars} />
              <p className="mt-4 text-sm text-white/55 leading-relaxed flex-1">&ldquo;{text}&rdquo;</p>
              <div className="flex items-center gap-3 mt-5">
                <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${grad} flex items-center justify-center text-white text-xs font-black shrink-0`}>
                  {initials}
                </div>
                <div>
                  <p className="text-sm font-bold text-white leading-none mb-0.5">{name}</p>
                  <p className="text-[11px] text-white/35">{handle}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  </section>
);

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
            <Eyebrow>Our People</Eyebrow>
            <h2 className="text-4xl lg:text-6xl font-black text-white mb-6">The team behind the mirror</h2>
            <p className="text-lg text-white/45 leading-relaxed mb-10">
              Fintech operators, risk engineers, and security veterans who&apos;ve shipped trading
              infrastructure at scale before — now building the copy-trading layer they wished existed.
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
// FAQ
// ─────────────────────────────────────────────────────────────

const faqData = [
  { q: "Do I need trading experience to start?", a: "None at all. The platform is built so a first-time investor and a seasoned trader get the same clarity. Pick a leader, set your limits, and start copying — you learn by watching the positions arrive." },
  { q: "Can I stop copying whenever I want?", a: "Yes — start or stop copying any leader with one tap. There are no lock-in periods, no penalties, and no cooldowns for changing your mind." },
  { q: "Where does my money actually sit?", a: "In your own account, under your own name, the entire time. We mirror trade instructions — we never take custody of your funds, and every connection is bank-level encrypted." },
  { q: "What's the minimum to get started?", a: "You can open a position with as little as $500, though $1,000+ gives you more room to diversify across more than one leader at once." },
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
            <Eyebrow dark={false}>FAQ</Eyebrow>
            <h2 className="text-4xl lg:text-5xl font-black mb-6 leading-tight">Before you ask,<br />we answered</h2>
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-10 leading-relaxed">
              The questions every new investor has before copying their first trade.
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
// FINAL CTA
// ─────────────────────────────────────────────────────────────

const FinalCTA = () => (
  <section className="relative overflow-hidden py-28 lg:py-40">
    <div className="absolute inset-0 bg-gradient-to-br from-[#00001e] via-[#000028] to-[#000018]" />
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
      <motion.p variants={fadeUp} className="text-sm font-black uppercase tracking-widest text-[#50C878] mb-6">Ready When You Are</motion.p>
      <motion.h2 variants={fadeUp} className="text-5xl lg:text-7xl font-black text-white leading-[0.95] mb-8">
        Stop guessing.
        <br />
        <span
          style={{
            background: "linear-gradient(135deg, #50C878, #6de496, #50C878)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Start copying.
        </span>
      </motion.h2>
      <motion.p variants={fadeUp} className="text-xl text-white/50 mb-14 max-w-2xl mx-auto leading-relaxed">
        Join over a million investors who decided the fastest way to get better at trading
        was to stand next to someone who already is. No card required to look around.
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
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10"
        variants={staggerWrap}
      >
        {[
          { step: "01", title: "Create Account", desc: "Verify your identity, takes minutes" },
          { step: "02", title: "Pick a Leader", desc: "Match by strategy and risk score" },
          { step: "03", title: "Copy & Grow", desc: "Stay in control the entire time" },
        ].map((s, i) => (
          <motion.div key={i} variants={staggerItem} className="rounded-2xl border border-white/10 bg-white/6 backdrop-blur-sm p-6 text-left">
            <p className="text-[10px] font-black text-[#50C878]/50 uppercase tracking-widest mb-3">Step {s.step}</p>
            <p className="text-white font-black text-base mb-1.5">{s.title}</p>
            <p className="text-white/40 text-sm leading-relaxed">{s.desc}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Trust line */}
      <motion.div variants={fadeUp} className="flex items-center justify-center gap-x-4 gap-y-3 flex-wrap">
        {["Regulated Entity", "Segregated Funds", "256-bit SSL", "24/5 Support"].map((t, i) => (
          <React.Fragment key={t}>
            <span className="text-[11px] text-white/40 font-medium flex items-center gap-1.5 whitespace-nowrap">
              <svg className="w-3 h-3 fill-[#50C878] shrink-0" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              {t}
            </span>
            {i < 3 && <span className="hidden sm:block w-px h-3 bg-[#50C878]/30" />}
          </React.Fragment>
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
        <MarqueeTicker />
        <StatBar />
        <ProblemSolution />
        <WhatYouCanCopy />
        <Features />
        <HowItWorks />
        <TopTraders />
        <Trust />
        <Testimonials />
        <Team />
        <LiquidityProvidersSection />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
