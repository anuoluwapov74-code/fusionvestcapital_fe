"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  TrendingUp,
  TrendingDown,
  Loader2,
  ArrowLeft,
  Globe,
  BarChart2,
  Info,
} from "lucide-react";
import { apiFetch } from "@/lib/api";

interface StockDetail {
  symbol: string;
  name: string;
  category: string;
  logo_url: string;
  price: string;
  change: string;
  change_percent: string;
  is_positive_change: boolean;
  open: number;
  previous_close: number;
  day_high: number;
  day_low: number;
  year_high: number;
  year_low: number;
  market_cap: number | null;
  volume: number | null;
  avg_volume: number | null;
  eps: number | null;
  pe: number | null;
  exchange: string | null;
  sector: string | null;
  industry: string | null;
  description: string | null;
  website: string | null;
  ceo: string | null;
}

function fmt(n: number | string | null | undefined, decimals = 2): string {
  const v = parseFloat(String(n ?? 0));
  if (!v) return "—";
  return v.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function fmtLarge(n: number | null | undefined): string {
  if (!n) return "—";
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  return `$${n.toLocaleString()}`;
}

function fmtVol(n: number | null | undefined): string {
  if (!n) return "—";
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(0)}K`;
  return String(n);
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-white/10 last:border-0">
      <span className="text-gray-500 dark:text-gray-400 text-sm">{label}</span>
      <span className="text-gray-900 dark:text-white text-sm font-medium">{value}</span>
    </div>
  );
}

export default function StockDetailPage() {
  const { symbol } = useParams<{ symbol: string }>();
  const router = useRouter();
  const [stock, setStock] = useState<StockDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (!symbol) return;
    setLoading(true);
    setError("");
    apiFetch(`/stocks/${symbol.toUpperCase()}/`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setStock(data.stock);
        } else {
          setError(data.error || "Symbol not found");
        }
      })
      .catch(() => setError("Failed to load data"))
      .finally(() => setLoading(false));
  }, [symbol]);

  const price = stock ? parseFloat(stock.price) : 0;
  const change = stock ? parseFloat(stock.change) : 0;
  const changePct = stock ? parseFloat(stock.change_percent) : 0;

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-6 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Markets
        </button>

        {loading && (
          <div className="flex justify-center items-center py-40">
            <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
          </div>
        )}

        {!loading && error && (
          <div className="text-center py-40">
            <p className="text-red-400 text-lg">{error}</p>
          </div>
        )}

        {!loading && stock && (
          <div className="space-y-6">
            {/* Hero */}
            <div className="bg-white dark:bg-[#1a2744] rounded-xl border border-gray-200 dark:border-white/10 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-16 h-16 relative rounded-full overflow-hidden bg-gray-100 dark:bg-white/10 flex-shrink-0 flex items-center justify-center">
                  {stock.logo_url && !imgError ? (
                    <Image
                      src={stock.logo_url}
                      alt={stock.name}
                      fill
                      className="object-contain p-1.5"
                      unoptimized
                      onError={() => setImgError(true)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white font-bold text-sm rounded-full">
                      {stock.symbol.slice(0, 3)}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stock.symbol}
                    </h1>
                    <span className="px-2 py-0.5 bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400 text-xs rounded capitalize">
                      {stock.category}
                    </span>
                    {stock.exchange && (
                      <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs rounded">
                        {stock.exchange}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm truncate">
                    {stock.name}
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    {price > 0 ? (
                      `$${fmt(price)}`
                    ) : (
                      <span className="text-gray-400 text-xl">Price unavailable</span>
                    )}
                  </div>
                  {price > 0 && (
                    <div
                      className={`flex items-center justify-end gap-1 mt-1 ${
                        stock.is_positive_change ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {stock.is_positive_change ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      <span className="text-sm font-medium">
                        {stock.is_positive_change ? "+" : ""}
                        {fmt(change)} ({stock.is_positive_change ? "+" : ""}
                        {fmt(changePct)}%)
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Market Data */}
              <div className="bg-white dark:bg-[#1a2744] rounded-xl border border-gray-200 dark:border-white/10 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart2 className="w-4 h-4 text-emerald-500" />
                  <h2 className="text-gray-900 dark:text-white font-semibold text-sm">
                    Market Data
                  </h2>
                </div>
                <StatRow label="Open" value={stock.open > 0 ? `$${fmt(stock.open)}` : "—"} />
                <StatRow label="Previous Close" value={stock.previous_close > 0 ? `$${fmt(stock.previous_close)}` : "—"} />
                <StatRow label="Day High" value={stock.day_high > 0 ? `$${fmt(stock.day_high)}` : "—"} />
                <StatRow label="Day Low" value={stock.day_low > 0 ? `$${fmt(stock.day_low)}` : "—"} />
                <StatRow label="52-Week High" value={stock.year_high > 0 ? `$${fmt(stock.year_high)}` : "—"} />
                <StatRow label="52-Week Low" value={stock.year_low > 0 ? `$${fmt(stock.year_low)}` : "—"} />
              </div>

              {/* Key Statistics */}
              <div className="bg-white dark:bg-[#1a2744] rounded-xl border border-gray-200 dark:border-white/10 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Info className="w-4 h-4 text-emerald-500" />
                  <h2 className="text-gray-900 dark:text-white font-semibold text-sm">
                    Key Statistics
                  </h2>
                </div>
                <StatRow label="Market Cap" value={fmtLarge(stock.market_cap)} />
                <StatRow label="Volume" value={fmtVol(stock.volume)} />
                <StatRow label="Avg Volume" value={fmtVol(stock.avg_volume)} />
                <StatRow label="EPS" value={stock.eps != null ? `$${fmt(stock.eps)}` : "—"} />
                <StatRow label="P/E Ratio" value={stock.pe != null ? fmt(stock.pe) : "—"} />
                {stock.sector && <StatRow label="Sector" value={stock.sector} />}
                {stock.industry && <StatRow label="Industry" value={stock.industry} />}
              </div>
            </div>

            {/* About */}
            {stock.description && (
              <div className="bg-white dark:bg-[#1a2744] rounded-xl border border-gray-200 dark:border-white/10 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-gray-900 dark:text-white font-semibold text-sm">
                    About
                  </h2>
                  {stock.website && (
                    <a
                      href={stock.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-emerald-500 text-xs hover:text-emerald-400 transition-colors"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      Website
                    </a>
                  )}
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-6">
                  {stock.description}
                </p>
                {stock.ceo && (
                  <p className="text-gray-500 dark:text-gray-500 text-xs mt-3">
                    CEO: {stock.ceo}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
