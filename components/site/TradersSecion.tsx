"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface TraderData {
  id: number;
  name: string;
  username: string;
  badge: string;
  gain: string;
  copiers: number;
  risk: number;
}

const TradersSection = () => {
  const [traders, setTraders] = useState<TraderData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTraders = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_APP_BACKEND_ORIGIN}/traders/`,
          { method: "GET", headers: { "Content-Type": "application/json" } },
        );
        if (response.ok) {
          const data = await response.json();
          setTraders(data.slice(0, 3));
        }
      } catch (error) {
        console.error("Error fetching traders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTraders();
  }, []);

  const SectionHeader = () => (
    <div className="text-center">
      <p className="text-sm font-bold uppercase tracking-widest text-[#000080] dark:text-[#50C878] mb-3">
        Top Performers
      </p>
      <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">
        Copy from the best traders
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-gray-500 dark:text-gray-400 lg:text-base">
        Our top-performing traders have consistently delivered exceptional
        results. Choose from a diverse range of trading strategies.
      </p>
    </div>
  );

  if (loading) {
    return (
      <section className="relative py-8 lg:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader />
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-8 lg:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader />

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:mt-10 lg:grid-cols-3 lg:gap-8">
          {traders.map((trader, index) => (
            <TraderCard
              key={index}
              name={trader.name}
              username={trader.username}
              role={trader.badge === "gold" ? "Expert" : trader.badge === "silver" ? "Advanced" : "Trader"}
              copiers={trader.copiers}
              profit={`${parseFloat(trader.gain).toFixed(2)}%`}
              profitPeriod="1M"
              totalCopiers={trader.copiers}
              riskLevel={trader.risk <= 3 ? "Low Risk" : trader.risk <= 6 ? "Balanced Risk" : "High Risk"}
            />
          ))}
        </div>

        <div className="mt-6 flex justify-center lg:mt-10">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-full border border-[#000080]/25 dark:border-[#50C878]/25 bg-transparent px-8 py-3 text-sm font-semibold text-[#000080] dark:text-[#50C878] transition-all hover:border-[#000080] dark:hover:border-[#50C878] hover:bg-[#000080]/5 dark:hover:bg-[#50C878]/8 hover:-translate-y-0.5"
          >
            View All Traders
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

interface TraderCardProps {
  name: string;
  username: string;
  role: string;
  copiers: number;
  profit: string;
  profitPeriod: string;
  totalCopiers: number;
  riskLevel: string;
}

const TraderCard = ({ name, role, copiers, profit, profitPeriod, totalCopiers, riskLevel }: TraderCardProps) => (
  <div className="group flex flex-col overflow-hidden rounded-2xl border border-[#000080]/8 dark:border-[#50C878]/8 bg-white/70 dark:bg-white/[0.02] backdrop-blur-sm shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#000080]/6 dark:hover:shadow-[#50C878]/6 hover:border-[#000080]/20 dark:hover:border-[#50C878]/20">

    {/* Header */}
    <div className="border-b border-[#000080]/6 dark:border-[#50C878]/6 p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#000080] to-[#1a1aff] text-base font-bold text-white shadow-md shadow-[#000080]/20">
          {name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="truncate text-sm font-bold">{name}</div>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#50C878]" />
            <span className="truncate text-xs text-gray-500 dark:text-gray-400">{role}</span>
          </div>
        </div>
      </div>
    </div>

    {/* Stats */}
    <div className="p-6">
      <div className="mb-6 grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="mb-1 flex items-center justify-center gap-1">
            <span className="text-lg font-bold">{copiers.toLocaleString()}</span>
            <svg className="h-3.5 w-3.5 text-[#50C878]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </div>
          <div className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500">Copiers</div>
        </div>
        <div>
          <div className="mb-1 flex items-center justify-center gap-1">
            <span className="text-lg font-bold text-[#50C878]">{profit}</span>
          </div>
          <div className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500">Profit ({profitPeriod})</div>
        </div>
        <div>
          <div className="mb-1 flex items-center justify-center gap-1">
            <span className="text-lg font-bold">{totalCopiers.toLocaleString()}</span>
            <svg className="h-3.5 w-3.5 text-[#50C878]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </div>
          <div className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500">Total</div>
        </div>
      </div>

      {/* Risk */}
      <div className="mb-4 flex items-center justify-between rounded-xl bg-[#000080]/4 dark:bg-[#50C878]/5 px-4 py-2.5">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Risk level</span>
        <span className="rounded-full bg-[#000080]/10 dark:bg-[#50C878]/15 px-3 py-0.5 text-xs font-semibold text-[#000080] dark:text-[#50C878]">
          {riskLevel}
        </span>
      </div>

      {/* Copy Button — emerald for dashboard action */}
      <Link
        href="/login"
        className="flex items-center justify-center w-full rounded-xl bg-[#50C878] py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#3ab060] hover:shadow-lg hover:shadow-[#50C878]/25 hover:-translate-y-0.5"
      >
        Copy Trader
      </Link>
    </div>
  </div>
);

export default TradersSection;
