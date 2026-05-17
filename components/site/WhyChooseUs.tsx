"use client";

import React from "react";
import Link from "next/link";

const WhyChooseUs = () => {
  return (
    <section className="relative py-8 lg:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="mb-12 text-center lg:mb-16">
          <p className="text-sm font-bold uppercase tracking-widest text-[#000080] dark:text-[#50C878] mb-3">
            The Problem & Solution
          </p>
          <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">
            You should know...
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">

          {/* The Challenge */}
          <div className="group relative overflow-hidden rounded-2xl border border-[#000080]/[0.08] dark:border-[#50C878]/[0.08] bg-white/70 dark:bg-white/[0.02] backdrop-blur-sm p-8 lg:p-10 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/5">
            <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-red-500/[0.06] dark:bg-red-500/[0.08] blur-3xl" />
            <div className="relative">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-red-50 dark:bg-red-500/10 px-3 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                <span className="text-xs font-medium text-red-600 dark:text-red-400">The Challenge</span>
              </div>
              <h3 className="text-xl font-bold lg:text-2xl mb-4">
                Studying the market takes time
              </h3>
              <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400 lg:text-base">
                Building and maintaining a trading strategy is hard. Options
                require timing, strategy, and discipline. Only 11-26% of manual
                investors succeed on their own. With FUSIONVEST CAPITAL, you can replicate
                successful trades from seasoned options traders to tilt the odds
                in your favor.
              </p>
            </div>
          </div>

          {/* The Solution */}
          <div className="group relative overflow-hidden rounded-2xl border border-[#000080]/[0.08] dark:border-[#50C878]/[0.08] bg-white/70 dark:bg-white/[0.02] backdrop-blur-sm p-8 lg:p-10 transition-all duration-300 hover:shadow-xl hover:shadow-[#50C878]/[0.06]">
            <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-[#50C878]/[0.08] dark:bg-[#50C878]/[0.10] blur-3xl" />
            <div className="relative">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#50C878]/10 dark:bg-[#50C878]/10 px-3 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[#50C878]" />
                <span className="text-xs font-medium text-[#50C878]">The Solution</span>
              </div>
              <h3 className="text-xl font-bold lg:text-2xl mb-4">
                Beat the odds with Copy Trading
              </h3>
              <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400 lg:text-base mb-6">
                Proven Success Rate. Over 73% of investors generate profits by
                copying top leaders—especially in dynamic options markets.
              </p>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-full bg-[#000080] dark:bg-[#50C878] px-6 py-2.5 text-sm font-semibold text-white dark:text-[#000025] transition-all hover:bg-[#0000b3] dark:hover:bg-[#3ab060] hover:shadow-lg hover:shadow-[#000080]/25 dark:hover:shadow-[#50C878]/25 hover:-translate-y-0.5"
              >
                Start copy trading
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
