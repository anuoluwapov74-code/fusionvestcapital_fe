"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Info, Loader2, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { Transaction } from "@/components/dashboard/modals/types";

export default function TransactionHistoryPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "deposit" | "withdrawal">("all");

  useEffect(() => {
    fetchTransactions();
  }, [filter]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await apiFetch(`/transactions/history/?limit=50&type=${filter}`);
      const data = await res.json();
      if (data.success) setTransactions(data.transactions);
    } catch {
      toast.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed": return "bg-green-500/20 text-green-400";
      case "failed":    return "bg-red-500/20 text-red-400";
      default:          return "bg-yellow-500/20 text-yellow-400";
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });

  const FILTERS = [
    { key: "all",        label: "All" },
    { key: "deposit",    label: "Deposits" },
    { key: "withdrawal", label: "Withdrawals" },
  ] as const;

  return (
    <div className="max-w-3xl mx-auto space-y-5 px-0 sm:px-2">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-1">
          Transaction History
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          View all your deposits and withdrawals
        </p>
      </motion.div>

      {/* Filter Tabs — grid so all 3 share equal width on every screen */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-3 gap-2"
      >
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors truncate ${
              filter === key
                ? "bg-emerald-500 text-white shadow-sm"
                : "bg-white/90 dark:bg-[#1a2744]/80 border border-gray-200/50 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5"
            }`}
          >
            {label}
          </button>
        ))}
      </motion.div>

      {/* Transactions List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="bg-white/90 dark:bg-[#1a2744]/80 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden"
      >
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-16 px-4">
            <Info className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
            <p className="text-sm text-gray-500 dark:text-gray-400">No transactions found</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {filter !== "all"
                ? `No ${filter}s to display. Try switching filters.`
                : "Your transaction history will appear here."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-white/5">
            {transactions.map((tx) => {
              const isDeposit = tx.transaction_type === "deposit";
              return (
                <div
                  key={tx.id}
                  className="flex items-start gap-3 p-3.5 sm:p-4 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
                >
                  {/* Icon */}
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    isDeposit ? "bg-green-500/15" : "bg-red-500/15"
                  }`}>
                    {isDeposit
                      ? <ArrowDownRight className="w-4 h-4 text-green-400" />
                      : <ArrowUpRight className="w-4 h-4 text-red-400" />
                    }
                  </div>

                  {/* Body */}
                  <div className="flex-1 min-w-0">
                    {/* Top row: type label + amount */}
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">
                        {tx.transaction_type_display}
                      </p>
                      <p className={`text-sm font-bold shrink-0 ${
                        isDeposit
                          ? "text-green-500 dark:text-green-400"
                          : "text-red-500 dark:text-red-400"
                      }`}>
                        {isDeposit ? "+" : "-"}${parseFloat(tx.amount).toFixed(2)}
                      </p>
                    </div>

                    {/* Bottom row: reference + currency + status + date */}
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1.5">
                      <p className="text-[10px] text-gray-500 dark:text-gray-500 font-mono tracking-tight truncate max-w-[120px] sm:max-w-none">
                        {tx.reference}
                      </p>

                      {tx.currency && (
                        <span className="text-[9px] px-1.5 py-0.5 bg-gray-200 dark:bg-white/5 rounded text-gray-600 dark:text-gray-400 shrink-0">
                          {tx.currency}
                        </span>
                      )}

                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium shrink-0 ${getStatusColor(tx.status)}`}>
                        {tx.status_display}
                      </span>

                      <span className="text-[10px] text-gray-400 dark:text-gray-500 ml-auto shrink-0">
                        {formatDate(tx.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}
