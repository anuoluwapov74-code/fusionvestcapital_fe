"use client";

import React from "react";
import Link from "next/link";

const CTASection = () => {
  const steps = [
    {
      icon: <AccountIcon />,
      title: "Create Your Account",
      description: "Join now to unlock options-focused copy trading.",
      iconBg: "bg-[#000080]/8 dark:bg-[#50C878]/10",
      iconColor: "text-[#000080] dark:text-[#50C878]",
    },
    {
      icon: <SearchIcon />,
      title: "Find Your Match",
      description:
        "Explore leaders known for success in options—contracts, spreads, tickers—you name it.",
      iconBg: "bg-[#50C878]/10 dark:bg-[#50C878]/10",
      iconColor: "text-[#3ab060] dark:text-[#50C878]",
    },
    {
      icon: <CopyIcon />,
      title: "Copy and Grow",
      description:
        "Replicate trades, refine strategies, and learn—all while staying in control.",
      iconBg: "bg-[#000080]/8 dark:bg-[#50C878]/10",
      iconColor: "text-[#000080] dark:text-[#50C878]",
    },
  ];

  return (
    <section className="relative py-8 lg:py-14">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#000080]/4 dark:bg-[#50C878]/6 rounded-full blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center lg:mb-16">
          <p className="text-sm font-bold uppercase tracking-widest text-[#000080] dark:text-[#50C878] mb-3">
            Get Started
          </p>
          <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">
            Ready to Invest Smarter?
          </h2>
        </div>

        <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {steps.map((step, index) => (
            <StepCard key={index} {...step} index={index} />
          ))}
        </div>

        <div className="flex justify-center">
          <Link
            href="/register"
            className="group inline-flex items-center gap-2 rounded-full bg-[#000080] dark:bg-[#50C878] px-10 py-3.5 text-sm font-semibold text-white dark:text-[#000025] transition-all hover:bg-[#0000b3] dark:hover:bg-[#3ab060] hover:shadow-xl hover:shadow-[#000080]/25 dark:hover:shadow-[#50C878]/25 hover:-translate-y-0.5"
          >
            Get started now
            <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

interface StepCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
  iconBg: string;
  iconColor: string;
}

const StepCard = ({ icon, title, description, index, iconBg, iconColor }: StepCardProps) => (
  <div className="group flex flex-col items-center rounded-2xl border border-[#000080]/8 dark:border-[#50C878]/8 bg-white/70 dark:bg-white/[0.02] backdrop-blur-sm p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#000080]/6 dark:hover:shadow-[#50C878]/6 hover:border-[#000080]/20 dark:hover:border-[#50C878]/20 lg:p-10">
    <div className="mb-2 text-xs font-bold uppercase tracking-widest text-[#000080]/50 dark:text-[#50C878]/50">
      Step {index + 1}
    </div>
    <div className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 ${iconBg} ${iconColor}`}>
      {icon}
    </div>
    <h3 className="mb-3 text-base font-bold lg:text-lg">{title}</h3>
    <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">{description}</p>
  </div>
);

const AccountIcon = () => (
  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
  </svg>
);

const SearchIcon = () => (
  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const CopyIcon = () => (
  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

export default CTASection;
