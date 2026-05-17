"use client";

import React from "react";

const WhatYouCanCopy = () => {
  const copyOptions = [
    {
      icon: <StocksIcon />,
      title: "Stocks & ETFs",
      description:
        "Full-share orders or fractional allocations, instantaneous entry/exit mirroring, price-based T/P and S/L.",
      accentColor: "navy",
    },
    {
      icon: <OptionsIcon />,
      title: "Single-Leg Options (Calls & Puts)",
      description:
        "Replicate trade by trade: ticker, strike, expiry, premium, quantity, and timestamp.",
      accentColor: "emerald",
    },
    {
      icon: <MultiLegIcon />,
      title: "Multi-Leg Options Strategies",
      description:
        "Copy complex structures as a single unit: verticals, iron condors, butterflies, calendars, ratio spreads. We preserve leg ratios and timing.",
      accentColor: "both",
    },
  ];

  return (
    <section className="relative py-8 lg:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center lg:mb-16">
          <p className="text-sm font-bold uppercase tracking-widest text-[#000080] dark:text-[#50C878] mb-3">
            Instruments
          </p>
          <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">
            What you can copy
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {copyOptions.map((option, index) => (
            <CopyCard key={index} {...option} />
          ))}
        </div>
      </div>
    </section>
  );
};

interface CopyCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  accentColor: string;
}

const CopyCard = ({ icon, title, description, accentColor }: CopyCardProps) => {
  const styles = {
    navy: {
      iconBg: "bg-[#000080]/8 dark:bg-[#000080]/20",
      iconColor: "text-[#000080] dark:text-[#a0a0ff]",
      border: "group-hover:border-[#000080]/25 dark:group-hover:border-[#50C878]/25",
      glow: "group-hover:shadow-[#000080]/6 dark:group-hover:shadow-[#50C878]/6",
    },
    emerald: {
      iconBg: "bg-[#50C878]/10 dark:bg-[#50C878]/10",
      iconColor: "text-[#3ab060] dark:text-[#50C878]",
      border: "group-hover:border-[#50C878]/30 dark:group-hover:border-[#50C878]/30",
      glow: "group-hover:shadow-[#50C878]/6 dark:group-hover:shadow-[#50C878]/8",
    },
    both: {
      iconBg: "bg-gradient-to-br from-[#000080]/8 to-[#50C878]/8 dark:from-[#000080]/20 dark:to-[#50C878]/10",
      iconColor: "text-[#000080] dark:text-[#50C878]",
      border: "group-hover:border-[#000080]/20 dark:group-hover:border-[#50C878]/25",
      glow: "group-hover:shadow-[#000080]/5 dark:group-hover:shadow-[#50C878]/6",
    },
  };

  const s = styles[accentColor as keyof typeof styles] || styles.navy;

  return (
    <div className={`group flex flex-col items-center rounded-2xl border border-[#000080]/8 dark:border-[#50C878]/8 bg-white/70 dark:bg-white/[0.02] backdrop-blur-sm p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${s.border} ${s.glow} lg:p-10`}>
      <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${s.iconBg} transition-transform duration-300 group-hover:scale-110`}>
        <div className={s.iconColor}>{icon}</div>
      </div>
      <h3 className="mb-3 text-base font-bold lg:text-lg">{title}</h3>
      <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">{description}</p>
    </div>
  );
};

const StocksIcon = () => (
  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
  </svg>
);
const OptionsIcon = () => (
  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);
const MultiLegIcon = () => (
  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="12" r="3" fill="currentColor" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v4m0 12v4M2 12h4m12 0h4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
  </svg>
);

export default WhatYouCanCopy;
