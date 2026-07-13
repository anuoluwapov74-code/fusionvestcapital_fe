"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  AlertCircle,
  ChevronDown,
  Loader2,
  CheckCircle,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import { UserProfile, Transaction } from "./types";

const WALLET_OPTIONS = [
  { value: "BTC",        label: "Bitcoin (BTC)" },
  { value: "ETH",        label: "Ethereum (ETH)" },
  { value: "USDT_ERC20", label: "USDT (ERC20)" },
  { value: "USDT_TRC20", label: "USDT (TRC20)" },
  { value: "USDC",       label: "USD Coin (USDC)" },
  { value: "SOL",        label: "Solana (SOL)" },
  { value: "BNB",        label: "BNB (BEP20)" },
  { value: "XRP",        label: "XRP (Ripple)" },
  { value: "LTC",        label: "Litecoin (LTC)" },
  { value: "DOGE",       label: "Dogecoin (DOGE)" },
  { value: "ADA",        label: "Cardano (ADA)" },
  { value: "AVAX",       label: "Avalanche (AVAX)" },
  { value: "LINK",       label: "Chainlink (LINK)" },
  { value: "TRX",        label: "TRON (TRX)" },
  { value: "MATIC",      label: "Polygon (MATIC)" },
];

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type WithdrawStep = "form" | "success";

export default function WithdrawModal({ isOpen, onClose }: WithdrawModalProps) {
  const [step, setStep] = useState<WithdrawStep>("form");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedWallet, setSelectedWallet] = useState("");
  const [withdrawSource, setWithdrawSource] = useState<"balance" | "profit">("balance");
  const [amount, setAmount] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [isWalletDropdownOpen, setIsWalletDropdownOpen] = useState(false);
  const [isSourceDropdownOpen, setIsSourceDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [withdrawRef, setWithdrawRef] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  useEffect(() => {
    if (isOpen) fetchData();
  }, [isOpen]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [profileRes, historyRes] = await Promise.all([
        apiFetch("/withdrawals/profile/"),
        apiFetch("/withdrawals/history/?limit=5"),
      ]);
      const profileData = await profileRes.json();
      const historyData = await historyRes.json();
      if (profileData.success) {
        setProfile(profileData.user);
        if (profileData.user.withdrawal_suspended) {
          toast.error("Withdrawals Suspended.", {
            description: "Your withdrawal access is currently suspended. You have not reached the minimum account threshold.",
            duration: 6000,
          });
        }
      }
      if (historyData.success) setTransactions(historyData.transactions);
    } catch {
      toast.error("Failed to load withdrawal data");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmWithdrawal = async () => {
    if (profile?.withdrawal_suspended) {
      toast.error("Withdrawals Suspended.", {
        description: "Your withdrawal access is currently suspended. You have not reached the minimum account threshold.",
        duration: 6000,
      });
      return;
    }
    if (!selectedWallet) {
      toast.error("Please select a wallet.");
      return;
    }
    if (!walletAddress.trim()) {
      toast.error("Please enter your wallet address.");
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }
    if (profile) {
      const limit = parseFloat(profile.withdrawal_limit);
      if (parseFloat(amount) > limit) {
        toast.error(
          `Withdrawal exceeds your limit of $${limit.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}.`,
          { duration: 7000 }
        );
        return;
      }
      const available = withdrawSource === "profit"
        ? parseFloat(profile.profit)
        : parseFloat(profile.balance);
      if (parseFloat(amount) > available) {
        toast.error(
          `Insufficient ${withdrawSource === "profit" ? "profit" : "balance"}. Available: ${
            withdrawSource === "profit" ? profile.formatted_profit : profile.formatted_balance
          }`
        );
        return;
      }
    }

    setSubmitting(true);
    try {
      const res = await apiFetch("/withdrawals/create/", {
        method: "POST",
        body: JSON.stringify({
          method_type: selectedWallet,
          amount,
          withdrawal_address: walletAddress.trim(),
          source: withdrawSource,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setWithdrawRef(data.transaction.reference);
        setWithdrawAmount(amount);
        if (profile) {
          setProfile({
            ...profile,
            balance: data.transaction.new_balance,
            formatted_balance: data.transaction.formatted_new_balance,
          });
        }
        setStep("success");
        toast.success("Withdrawal request submitted!");
      } else {
        toast.error(data.error || "Failed to submit withdrawal request", { duration: 6000 });
      }
    } catch {
      toast.error("Failed to submit withdrawal request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setStep("form");
    setSelectedWallet("");
    setWithdrawSource("balance");
    setAmount("");
    setWalletAddress("");
    setIsWalletDropdownOpen(false);
    setIsSourceDropdownOpen(false);
    setWithdrawRef("");
    setWithdrawAmount("");
    onClose();
  };

  const selectedWalletLabel = WALLET_OPTIONS.find((w) => w.value === selectedWallet)?.label ?? "";

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

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={handleClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-[#0f1a2e] border border-gray-200 dark:border-white/10 shadow-2xl"
        >
          {/* ==================== FORM STEP ==================== */}
          {step === "form" && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Withdrawal</h3>
                <button onClick={handleClose} className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-[#000080] dark:text-[#50C878] animate-spin" />
                </div>
              ) : (
                <div className="space-y-5">
                  {/* Balance Display */}
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Main Balance</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {profile ? profile.formatted_balance : "$0.00"}
                      </p>
                    </div>
                    <div className="w-px bg-gray-200 dark:bg-white/10" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Profit</p>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {profile ? profile.formatted_profit : "$0.00"}
                      </p>
                    </div>
                  </div>

                  <hr className="border-gray-200 dark:border-white/10" />

                  {/* Suspension Banner */}
                  {profile?.withdrawal_suspended && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-red-600 dark:text-red-400">Withdrawals Suspended.</p>
                        <p className="text-xs text-red-500 dark:text-red-300 mt-0.5">
                          Your withdrawal access is currently suspended. You have not reached the minimum account threshold.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Withdraw From */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Withdraw From:
                    </label>
                    <div className="relative">
                      <button
                        onClick={() => setIsSourceDropdownOpen(!isSourceDropdownOpen)}
                        className={`w-full px-4 py-3 rounded-lg text-left flex items-center justify-between transition-all bg-gray-100 dark:bg-[#1a2744] border ${
                          isSourceDropdownOpen ? "border-[#000080] dark:border-[#50C878]" : "border-gray-300 dark:border-white/10"
                        } text-gray-900 dark:text-white`}
                      >
                        <span>{withdrawSource === "profit" ? "Profit" : "Main Balance"}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${isSourceDropdownOpen ? "rotate-180" : ""}`} />
                      </button>
                      {isSourceDropdownOpen && (
                        <div className="absolute z-10 w-full mt-1.5 bg-white dark:bg-[#1a2744] border border-gray-200 dark:border-white/10 rounded-lg shadow-lg overflow-hidden">
                          {(["balance", "profit"] as const).map((src) => (
                            <button
                              key={src}
                              onClick={() => { setWithdrawSource(src); setIsSourceDropdownOpen(false); setAmount(""); }}
                              className={`w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-gray-100 dark:hover:bg-white/5 ${
                                withdrawSource === src ? "text-[#000080] dark:text-[#50C878] font-semibold" : "text-gray-900 dark:text-white"
                              }`}
                            >
                              {src === "profit" ? "Profit" : "Main Balance"}
                              {profile && (
                                <span className="ml-2 text-xs text-gray-500">
                                  ({src === "profit" ? profile.formatted_profit : profile.formatted_balance})
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Wallet Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Wallet:
                    </label>
                    <div className="relative">
                      <button
                        onClick={() => setIsWalletDropdownOpen(!isWalletDropdownOpen)}
                        className={`w-full px-4 py-3 rounded-lg text-left flex items-center justify-between transition-all bg-gray-100 dark:bg-[#1a2744] border ${
                          isWalletDropdownOpen ? "border-[#000080] dark:border-[#50C878]" : "border-gray-300 dark:border-white/10"
                        } ${selectedWallet ? "text-gray-900 dark:text-white" : "text-gray-500"}`}
                      >
                        <span>{selectedWallet ? selectedWalletLabel : "Select wallet"}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${isWalletDropdownOpen ? "rotate-180" : ""}`} />
                      </button>

                      {isWalletDropdownOpen && (
                        <div className="absolute z-10 w-full mt-1.5 bg-white dark:bg-[#1a2744] border border-gray-200 dark:border-white/10 rounded-lg shadow-lg overflow-hidden">
                          <div className="px-3 py-2 bg-[#000080] dark:bg-[#50C878] text-white dark:text-[#000025] text-xs font-semibold">
                            Select wallet
                          </div>
                          <div className="max-h-52 overflow-y-auto">
                            {WALLET_OPTIONS.map((opt) => (
                              <button
                                key={opt.value}
                                onClick={() => { setSelectedWallet(opt.value); setIsWalletDropdownOpen(false); }}
                                className={`w-full px-3 py-2.5 text-left text-sm transition-colors hover:bg-gray-100 dark:hover:bg-white/5 ${
                                  selectedWallet === opt.value
                                    ? "text-[#000080] dark:text-[#50C878] font-semibold"
                                    : "text-gray-900 dark:text-white"
                                }`}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Wallet Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Wallet Address:
                    </label>
                    <input
                      type="text"
                      value={walletAddress}
                      onChange={(e) => setWalletAddress(e.target.value)}
                      placeholder="Enter your wallet address"
                      className="w-full px-4 py-3 bg-gray-100 dark:bg-[#1a2744] border border-gray-300 dark:border-white/10 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-[#000080] dark:focus:border-[#50C878] transition-all"
                    />
                  </div>

                  {/* Amount */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Amount (USD):
                    </label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 bg-gray-100 dark:bg-[#1a2744] border border-gray-300 dark:border-white/10 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-[#000080] dark:focus:border-[#50C878] transition-all"
                    />
                    {/* Live inline hint for amount vs available */}
                    {profile && amount && parseFloat(amount) > parseFloat(withdrawSource === "profit" ? profile.profit : profile.balance) && (
                      <p className="mt-1.5 text-xs text-red-400">
                        Exceeds your {withdrawSource === "profit" ? "profit" : "balance"} of{" "}
                        {withdrawSource === "profit" ? profile.formatted_profit : profile.formatted_balance}
                      </p>
                    )}
                    {/* Live inline hint for amount vs limit */}
                    {profile && amount && parseFloat(amount) > parseFloat(profile.withdrawal_limit) && (
                      <p className="mt-1 text-xs text-amber-500">
                        Exceeds your withdrawal limit of $
                        {parseFloat(profile.withdrawal_limit).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-2 border-t border-gray-200 dark:border-white/10">
                    <button
                      onClick={handleClose}
                      disabled={submitting}
                      className="flex-1 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg font-semibold transition-colors disabled:opacity-50 text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmWithdrawal}
                      disabled={submitting || !selectedWallet || !walletAddress.trim() || !amount}
                      className="flex-1 py-3 bg-[#50C878] hover:bg-[#3ab060] text-white rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                    >
                      {submitting ? (
                        <><Loader2 className="w-4 h-4 animate-spin" />Processing...</>
                      ) : (
                        "Confirm Withdrawal"
                      )}
                    </button>
                  </div>

                  {/* Note */}
                  <div className="p-3 bg-[#000080]/6 dark:bg-[#50C878]/8 border border-[#000080]/15 dark:border-[#50C878]/15 rounded-lg">
                    <p className="text-[10px] text-[#000080] dark:text-[#50C878]">
                      <strong>Note:</strong> Withdrawals are processed within 24–48 hours. You will be notified once approved.
                    </p>
                  </div>

                  {/* Recent Withdrawals */}
                  {transactions.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Recent Withdrawals
                      </h4>
                      <div className="space-y-2">
                        {transactions.map((tx) => (
                          <div key={tx.id} className="bg-gray-50 dark:bg-[#1a2744]/80 border border-gray-200 dark:border-white/5 rounded-lg p-3">
                            <div className="flex justify-between items-start mb-1">
                              <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{tx.reference}</p>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${getStatusColor(tx.status)}`}>
                                {tx.status_display}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <p className="text-[10px] text-gray-500">{formatDate(tx.created_at)}</p>
                              <p className="text-sm font-bold text-red-400">-${parseFloat(tx.amount).toFixed(2)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ==================== SUCCESS STEP ==================== */}
          {step === "success" && (
            <div className="p-6">
              <div className="text-center mb-6">
                <CheckCircle className="w-14 h-14 text-[#50C878] mx-auto mb-3" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  Withdrawal Submitted!
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Your withdrawal is being processed</p>
              </div>

              <div className="bg-[#000080]/6 dark:bg-[#50C878]/8 border border-[#000080]/15 dark:border-[#50C878]/15 rounded-xl p-4 mb-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Amount:</span>
                  <span className="text-gray-900 dark:text-white font-semibold">${parseFloat(withdrawAmount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Source:</span>
                  <span className="text-gray-900 dark:text-white font-semibold">{withdrawSource === "profit" ? "Profit" : "Main Balance"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Wallet:</span>
                  <span className="text-gray-900 dark:text-white font-semibold">{selectedWalletLabel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Address:</span>
                  <span className="text-gray-900 dark:text-white font-semibold font-mono text-xs truncate max-w-[180px]">{walletAddress}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#000080]/15 dark:border-[#50C878]/15">
                  <span className="text-gray-500 dark:text-gray-400">Reference:</span>
                  <span className="text-[#000080] dark:text-[#50C878] font-semibold font-mono text-xs">{withdrawRef}</span>
                </div>
              </div>

              <div className="bg-[#000080]/6 dark:bg-[#50C878]/8 border border-[#000080]/15 dark:border-[#50C878]/15 rounded-xl p-4 mb-4">
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-[#000080] dark:text-[#50C878] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-700 dark:text-gray-300 font-medium">Processing Time</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                      Withdrawals are processed within 24–48 hours after admin approval.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="w-full py-3 bg-[#50C878] hover:bg-[#3ab060] text-white rounded-lg font-semibold transition-colors text-sm"
              >
                Got It!
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
