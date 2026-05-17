"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Loader2, X, TrendingUp, TrendingDown } from "lucide-react";
import { apiFetch } from "@/lib/api";

interface StockData {
  id: number;
  name: string;
  symbol: string;
  logo_url: string;
  price: string;
  change: string;
  change_percent: string;
  volume: number;
  market_cap: number;
  formatted_market_cap: string;
  sector: string;
  is_positive_change: boolean;
}

interface UserPosition {
  id: number;
  shares: string;
  average_buy_price: string;
  total_invested: string;
  current_value: string;
  profit_loss: string;
  profit_loss_percent: string;
}

export default function StockDetailPage() {
  const router = useRouter();
  const params = useParams();
  const symbol = params?.symbol as string;

  const [stock, setStock] = useState<StockData | null>(null);
  const [userPosition, setUserPosition] = useState<UserPosition | null>(null);
  const [userBalance, setUserBalance] = useState<string>("0.00");
  const [loading, setLoading] = useState(true);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [shares, setShares] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch stock data
  useEffect(() => {
    if (symbol) {
      fetchStockData();
      fetchUserProfile();
    }
  }, [symbol]);

  const fetchStockData = async () => {
    try {
      setLoading(true);
      const response = await apiFetch(`/stocks/${symbol}/`);
      const data = await response.json();

      if (data.success) {
        setStock(data.stock);
        setUserPosition(data.user_position);
      } else {
        console.error("Failed to fetch stock:", data.error);
      }
    } catch (error) {
      console.error("Error fetching stock:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await apiFetch("/profile/");
      const data = await response.json();
      if (data.success) {
        setUserBalance(data.user.balance);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const handleBuyClick = async () => {
    if (!stock || parseFloat(shares) <= 0) {
      setError("Please enter a valid number of shares");
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const response = await apiFetch("/stocks/buy/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          symbol: stock.symbol,
          shares: shares,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(data.message);
        fetchStockData();
        fetchUserProfile();
        setShares("");
        setTimeout(() => {
          setIsBuyModalOpen(false);
          setSuccess(null);
        }, 2000);
      } else {
        setError(data.error || "Failed to buy stock");
      }
    } catch (error) {
      console.error("Error buying stock:", error);
      setError("An error occurred while buying stock");
    } finally {
      setProcessing(false);
    }
  };

  const handleSellClick = async () => {
    if (!stock || parseFloat(shares) <= 0) {
      setError("Please enter a valid number of shares");
      return;
    }

    if (!userPosition) {
      setError("You don't own any shares of this stock");
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const response = await apiFetch("/stocks/sell/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          symbol: stock.symbol,
          shares: shares,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(data.message);
        fetchStockData();
        fetchUserProfile();
        setShares("");
        setTimeout(() => {
          setIsSellModalOpen(false);
          setSuccess(null);
        }, 2000);
      } else {
        setError(data.error || "Failed to sell stock");
      }
    } catch (error) {
      console.error("Error selling stock:", error);
      setError("An error occurred while selling stock");
    } finally {
      setProcessing(false);
    }
  };

  const openBuyModal = () => {
    setIsBuyModalOpen(true);
    setShares("");
    setError(null);
    setSuccess(null);
  };

  const openSellModal = () => {
    setIsSellModalOpen(true);
    setShares("");
    setError(null);
    setSuccess(null);
  };

  const closeBuyModal = () => {
    setIsBuyModalOpen(false);
    setShares("");
    setError(null);
    setSuccess(null);
  };

  const closeSellModal = () => {
    setIsSellModalOpen(false);
    setShares("");
    setError(null);
    setSuccess(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!stock) {
    return (
      <div className="min-h-screen">
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-500 dark:text-gray-400">Stock not found</p>
        </div>
      </div>
    );
  }

  const estimatedCost = parseFloat(shares || "0") * parseFloat(stock.price);
  const availableShares = userPosition ? parseFloat(userPosition.shares) : 0;
  const estimatedProceeds = parseFloat(shares || "0") * parseFloat(stock.price);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-6 px-4 py-2 flex items-center gap-2 bg-white dark:bg-[#1a2744] text-gray-900 dark:text-white rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-[#1e3a5f]/50 transition-colors border border-gray-200 dark:border-white/10"
        >
          <ArrowLeft className="w-5 h-5" />
          Go Back
        </button>

        {/* Stock Header */}
        <div className="bg-white dark:bg-[#1a2744] rounded-2xl p-6 mb-6 border border-gray-200 dark:border-white/10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 relative rounded-full overflow-hidden bg-white">
                {stock.logo_url ? (
                  <Image
                    src={stock.logo_url}
                    alt={stock.name}
                    fill
                    className="object-contain p-2"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-600 font-bold text-2xl">
                    {stock.symbol.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                  {stock.symbol}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">{stock.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                  {stock.sector}
                </p>
              </div>
            </div>

            <div className="text-left md:text-right">
              <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                $
                {parseFloat(stock.price).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
              <div className="flex items-center gap-2 justify-start md:justify-end">
                {stock.is_positive_change ? (
                  <TrendingUp className="w-5 h-5 text-green-500" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-500" />
                )}
                <span
                  className={`text-lg font-medium ${
                    stock.is_positive_change ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {stock.is_positive_change ? "+" : ""}
                  {parseFloat(stock.change).toFixed(2)} (
                  {parseFloat(stock.change_percent).toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Market Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-[#1a2744] rounded-xl p-4 border border-gray-200 dark:border-white/10">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Market Cap
            </p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {stock.formatted_market_cap}
            </p>
          </div>
          <div className="bg-white dark:bg-[#1a2744] rounded-xl p-4 border border-gray-200 dark:border-white/10">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Volume</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {stock.volume.toLocaleString()}
            </p>
          </div>
          <div className="bg-white dark:bg-[#1a2744] rounded-xl p-4 border border-gray-200 dark:border-white/10">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Your Balance
            </p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              $
              {parseFloat(userBalance).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
          <div className="bg-white dark:bg-[#1a2744] rounded-xl p-4 border border-gray-200 dark:border-white/10">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Your Shares
            </p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {userPosition ? parseFloat(userPosition.shares).toFixed(4) : "0.0000"}
            </p>
          </div>
        </div>

        {/* Position Details */}
        {userPosition && (
          <div className="bg-white dark:bg-[#1a2744] rounded-2xl p-6 mb-6 border border-gray-200 dark:border-white/10">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Your Position
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Total Invested
                </p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  $
                  {parseFloat(userPosition.total_invested).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Current Value
                </p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  $
                  {parseFloat(userPosition.current_value).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Avg. Buy Price
                </p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  $
                  {parseFloat(userPosition.average_buy_price).toLocaleString(
                    undefined,
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Profit/Loss
                </p>
                <p
                  className={`text-lg font-semibold ${
                    parseFloat(userPosition.profit_loss) >= 0
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {parseFloat(userPosition.profit_loss) >= 0 ? "+" : ""}$
                  {parseFloat(userPosition.profit_loss).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  ({parseFloat(userPosition.profit_loss_percent).toFixed(2)}%)
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={openBuyModal}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 rounded-lg transition-colors"
          >
            Buy {stock.symbol}
          </button>
          <button
            onClick={openSellModal}
            disabled={!userPosition || availableShares <= 0}
            className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-lg transition-colors"
          >
            Sell {stock.symbol}
          </button>
        </div>
      </div>

      {/* Buy Modal */}
      <AnimatePresence>
        {isBuyModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeBuyModal}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={closeBuyModal}
            >
              <div
                className="bg-white dark:bg-[#1a2744] rounded-2xl max-w-md w-full p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                    Buy {stock.symbol}
                  </h2>
                  <button
                    onClick={closeBuyModal}
                    className="w-10 h-10 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 rounded-full flex items-center justify-center"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-900 dark:text-white mb-2 block">
                      Number of Shares
                    </label>
                    <input
                      type="number"
                      value={shares}
                      onChange={(e) => setShares(e.target.value)}
                      placeholder="Enter shares"
                      className="w-full p-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500"
                    />
                  </div>

                  <div className="bg-gray-50 dark:bg-white/5 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Price per share
                      </span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        ${parseFloat(stock.price).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Estimated Cost
                      </span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        ${estimatedCost.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm pt-2 border-t border-gray-200 dark:border-white/10">
                      <span className="text-gray-600 dark:text-gray-400">
                        Your Balance
                      </span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        ${parseFloat(userBalance).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                      <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    </div>
                  )}

                  {success && (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                      <p className="text-sm text-green-600 dark:text-green-400">
                        {success}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleBuyClick}
                      disabled={processing || !shares || parseFloat(shares) <= 0}
                      className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {processing ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Confirm Buy"
                      )}
                    </button>
                    <button
                      onClick={closeBuyModal}
                      disabled={processing}
                      className="flex-1 py-3 bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 text-gray-900 dark:text-white font-semibold rounded-lg transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Sell Modal */}
      <AnimatePresence>
        {isSellModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeSellModal}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={closeSellModal}
            >
              <div
                className="bg-white dark:bg-[#1a2744] rounded-2xl max-w-md w-full p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                    Sell {stock.symbol}
                  </h2>
                  <button
                    onClick={closeSellModal}
                    className="w-10 h-10 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 rounded-full flex items-center justify-center"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-900 dark:text-white mb-2 block">
                      Number of Shares
                    </label>
                    <input
                      type="number"
                      value={shares}
                      onChange={(e) => setShares(e.target.value)}
                      max={availableShares}
                      placeholder="Enter shares"
                      className="w-full p-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-500 focus:outline-none focus:border-red-500 dark:focus:border-red-500"
                    />
                  </div>

                  <div className="bg-gray-50 dark:bg-white/5 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Available shares
                      </span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {availableShares.toFixed(4)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Price per share
                      </span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        ${parseFloat(stock.price).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm pt-2 border-t border-gray-200 dark:border-white/10">
                      <span className="text-gray-600 dark:text-gray-400">
                        Estimated Proceeds
                      </span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        ${estimatedProceeds.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                      <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    </div>
                  )}

                  {success && (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                      <p className="text-sm text-green-600 dark:text-green-400">
                        {success}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleSellClick}
                      disabled={
                        processing ||
                        !shares ||
                        parseFloat(shares) <= 0 ||
                        parseFloat(shares) > availableShares
                      }
                      className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {processing ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Confirm Sell"
                      )}
                    </button>
                    <button
                      onClick={closeSellModal}
                      disabled={processing}
                      className="flex-1 py-3 bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 text-gray-900 dark:text-white font-semibold rounded-lg transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
