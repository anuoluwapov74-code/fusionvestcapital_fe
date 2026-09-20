"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, AlertCircle, Copy, Check, Upload, CheckCircle,
  Loader2, ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { apiFetch } from "@/lib/api";
import { AdminWallet } from "./types";
import { getCryptoIcon, getNetworkName } from "./crypto-icons";

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DepositOptionsResponse {
  success: boolean;
  wallets: AdminWallet[];
  error?: string;
}

const EMERALD = "#50C878";

/* ── Shared close button ── */
function CloseBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 bg-gray-100 dark:bg-white/8 hover:opacity-80 transition-opacity"
    >
      <X className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
    </button>
  );
}

export default function DepositModal({ isOpen, onClose }: DepositModalProps) {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme !== "light";

  const [selectedWallet, setSelectedWallet] = useState<AdminWallet | null>(null);
  const [dollarAmount, setDollarAmount] = useState("");
  const [currencyAmount, setCurrencyAmount] = useState("");
  const [checked, setChecked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [receipt, setReceipt] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [depositReference, setDepositReference] = useState("");

  const intentSentForRef = useRef<string>("");

  const [wallets, setWallets] = useState<AdminWallet[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch the admin's active deposit wallets whenever the modal opens.
  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    setLoading(true);
    apiFetch("/deposits/options/")
      .then((res) => res.json())
      .then((data: DepositOptionsResponse) => {
        if (cancelled) return;
        if (data.success) {
          setWallets(data.wallets);
        } else {
          setWallets([]);
          toast.error(data.error || "Failed to load deposit options");
        }
      })
      .catch(() => {
        if (!cancelled) toast.error("Failed to load deposit options");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [isOpen]);

  // Default to the first wallet once options load, without clobbering a
  // selection the user already made (e.g. on a background revalidation).
  useEffect(() => {
    if (wallets.length > 0 && !selectedWallet) setSelectedWallet(wallets[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallets]);

  // Live crypto-amount conversion as the user types the dollar amount.
  useEffect(() => {
    if (dollarAmount && selectedWallet) {
      const dollars = parseFloat(dollarAmount);
      const rate = parseFloat(selectedWallet.amount);
      if (!isNaN(dollars) && !isNaN(rate) && rate > 0) {
        setCurrencyAmount((dollars / rate).toFixed(8));
      } else setCurrencyAmount("");
    } else setCurrencyAmount("");
  }, [dollarAmount, selectedWallet]);

  // Fire a non-blocking "payment intent" notification to the admin once the
  // user has a valid amount + wallet — this is what lets an admin follow up
  // with someone who pays but never comes back to submit the receipt below.
  useEffect(() => {
    if (!isOpen || !selectedWallet || !dollarAmount) return;
    const amountNum = parseFloat(dollarAmount);
    if (isNaN(amountNum) || amountNum <= 0) return;
    const key = `${selectedWallet.currency}:${dollarAmount}`;
    if (intentSentForRef.current === key) return;
    const timer = setTimeout(() => {
      intentSentForRef.current = key;
      apiFetch("/deposits/payment-intent/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currency: selectedWallet.currency,
          dollar_amount: dollarAmount,
          currency_unit: currencyAmount,
        }),
      }).catch(() => { /* non-blocking */ });
    }, 1500);
    return () => clearTimeout(timer);
  }, [isOpen, selectedWallet, dollarAmount, currencyAmount]);

  const handleCopy = () => {
    if (!selectedWallet) return;
    navigator.clipboard.writeText(selectedWallet.wallet_address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const validateFile = (file: File): boolean => {
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return false;
    }
    return true;
  };

  const handleDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); }, []);
  const handleDragLeave = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); }, []);
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (!validateFile(file)) return;
    setReceipt(file); setError("");
  }, []);
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!validateFile(file)) return;
    setReceipt(file); setError("");
  };

  const handleSubmit = async () => {
    if (!selectedWallet) return;
    if (!dollarAmount || parseFloat(dollarAmount) <= 0) { setError("Please enter a valid amount."); return; }
    if (!checked) { setError("Please confirm that you have sent the payment."); return; }
    if (!receipt) { setError("Please upload your payment receipt or screenshot."); return; }

    setSubmitting(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("currency", selectedWallet.currency);
      formData.append("dollar_amount", dollarAmount);
      formData.append("currency_unit", currencyAmount);
      formData.append("receipt", receipt);
      const res = await apiFetch("/deposits/create/", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        setDepositReference(data.transaction.reference);
        setSubmitted(true);
        toast.success("Deposit request submitted successfully!");
      } else {
        setError(data.error || "Failed to submit deposit");
        toast.error(data.error || "Failed to submit deposit");
      }
    } catch {
      setError("Failed to submit deposit request. Please try again.");
      toast.error("Failed to submit deposit request");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedWallet(null);
    setDollarAmount(""); setCurrencyAmount("");
    setReceipt(null); setError(""); setCopied(false); setChecked(false);
    setSubmitted(false); setDepositReference("");
    intentSentForRef.current = "";
    onClose();
  };

  const canSubmit = !!selectedWallet && !!dollarAmount && parseFloat(dollarAmount) > 0 && checked && !!receipt && !submitting;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
        />

        {/* Modal — everything on one scrollable page, no wizard steps */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full sm:max-w-[420px] max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-white dark:bg-[#0f1a2e]"
        >
          {submitted ? (
            /* ══════════════ SUCCESS ══════════════ */
            <div className="p-6 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mb-3" style={{ background: "rgba(80,200,120,0.14)" }}>
                <CheckCircle className="w-7 h-7" style={{ color: EMERALD }} />
              </div>
              <h3 className="text-[18px] font-bold text-gray-900 dark:text-white mb-1.5">Deposit Submitted!</h3>
              <p className="text-[13px] leading-relaxed mb-1.5 text-gray-500 dark:text-white/40">
                Your deposit is pending confirmation.
              </p>
              {depositReference && (
                <p className="text-[11px] font-mono mb-3" style={{ color: EMERALD }}>Ref: {depositReference}</p>
              )}
              <p className="text-[12px] mb-4 text-gray-500 dark:text-white/40">
                Funds will be credited within 30 minutes to 24 hours after verification.
              </p>
              <button
                onClick={() => { handleClose(); router.push("/transactions"); }}
                className="w-full h-10 rounded-lg text-[13px] font-bold transition-opacity hover:opacity-90"
                style={{ background: EMERALD, color: "#00170d" }}
              >
                Done
              </button>
            </div>
          ) : (
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[18px] font-bold text-gray-900 dark:text-white">Deposit Funds</h3>
                <CloseBtn onClick={handleClose} />
              </div>

              {/* ── The core instruction: don't pay without submitting this form ── */}
              <div
                className="flex items-start gap-2.5 rounded-xl p-3 mb-4"
                style={{ background: "rgba(80,200,120,0.08)", border: `1px solid rgba(80,200,120,0.25)` }}
              >
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" style={{ color: EMERALD }} />
                <p className="text-[11.5px] leading-snug text-gray-700 dark:text-gray-300">
                  <span className="font-bold text-gray-900 dark:text-white">Sending payment is not enough.</span>{" "}
                  We only know you paid once you upload your receipt and press Submit below. Skip this step and your deposit will not be credited.
                </p>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="w-6 h-6 animate-spin" style={{ color: EMERALD }} />
                </div>
              ) : wallets.length === 0 ? (
                <div className="text-center py-10">
                  <AlertCircle className="w-8 h-8 text-gray-400 dark:text-white/30 mx-auto mb-3" />
                  <p className="text-[13px] text-gray-500 dark:text-white/40">No deposit options available right now.</p>
                </div>
              ) : (
                <>
                  {/* ── Step 1: pick a currency ── */}
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 dark:text-white/30 mb-2">
                    1. Choose a currency
                  </p>
                  <div className="flex gap-2 overflow-x-auto pb-1 mb-4 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: "none" }}>
                    {wallets.map((wallet) => {
                      const active = selectedWallet?.id === wallet.id;
                      return (
                        <button
                          key={wallet.id}
                          onClick={() => setSelectedWallet(wallet)}
                          className="flex items-center gap-1.5 shrink-0 rounded-full pl-1.5 pr-3 py-1.5 text-[12px] font-semibold transition-colors"
                          style={{
                            background: active ? "rgba(80,200,120,0.14)" : isDark ? "rgba(255,255,255,0.05)" : "#F3F4F6",
                            border: active ? `1.5px solid ${EMERALD}` : "1.5px solid transparent",
                            color: active ? EMERALD : isDark ? "rgba(255,255,255,0.7)" : "#374151",
                          }}
                        >
                          <span className="w-5 h-5 rounded-full overflow-hidden shrink-0 [&_svg]:!w-5 [&_svg]:!h-5">
                            {getCryptoIcon(wallet.currency)}
                          </span>
                          {wallet.currency_display}
                        </button>
                      );
                    })}
                  </div>

                  {selectedWallet && (
                    <>
                      {/* ── Step 2: amount ── */}
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 dark:text-white/30 mb-2">
                        2. Enter amount
                      </p>
                      <div
                        className="rounded-xl p-4 mb-4"
                        style={{ background: isDark ? "rgba(255,255,255,0.03)" : "#F9FAFB", border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#E5E7EB"}` }}
                      >
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <span className="text-[28px] font-bold text-gray-400 dark:text-white/30">$</span>
                          <input
                            type="text"
                            inputMode="decimal"
                            placeholder="0.00"
                            value={dollarAmount}
                            onChange={(e) => {
                              const val = e.target.value.replace(/[^0-9.]/g, "");
                              const parts = val.split(".");
                              if (parts.length > 2 || (parts[1] && parts[1].length > 2)) return;
                              setDollarAmount(val); setError("");
                            }}
                            className={`text-[36px] font-bold bg-transparent border-none outline-none text-center w-40 ${
                              dollarAmount ? "text-gray-900 dark:text-white" : "text-gray-300 dark:text-white/25"
                            }`}
                          />
                        </div>
                        <p className="text-[12px] text-center text-gray-500 dark:text-white/40">
                          {currencyAmount ? `≈ ${currencyAmount} ${selectedWallet.currency}` : `Rate: $${selectedWallet.amount} per unit`}
                        </p>
                      </div>

                      {/* ── Step 3: send payment ── */}
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 dark:text-white/30 mb-2">
                        3. Send payment to this address
                      </p>
                      <div
                        className="rounded-xl p-4 mb-4 flex gap-4"
                        style={{ background: isDark ? "rgba(255,255,255,0.03)" : "#F9FAFB", border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#E5E7EB"}` }}
                      >
                        {selectedWallet.qr_code_url && (
                          <div className="shrink-0">
                            <div className="p-1.5 rounded-lg bg-white">
                              <Image
                                src={selectedWallet.qr_code_url}
                                alt="Wallet QR code"
                                width={80}
                                height={80}
                                className="rounded"
                                unoptimized
                              />
                            </div>
                            <p className="text-center text-[9px] text-gray-500 mt-1 font-medium">Scan to pay</p>
                          </div>
                        )}
                        <div className="min-w-0 flex-1 flex flex-col justify-center">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="w-6 h-6 rounded-full overflow-hidden shrink-0 [&_svg]:!w-6 [&_svg]:!h-6">
                              {getCryptoIcon(selectedWallet.currency)}
                            </span>
                            <p className="text-[13px] font-bold text-gray-900 dark:text-white truncate">
                              {selectedWallet.currency}
                              {selectedWallet.currency !== getNetworkName(selectedWallet.currency) && ` (${getNetworkName(selectedWallet.currency)})`}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-mono truncate" style={{ color: EMERALD }}>
                              {selectedWallet.wallet_address}
                            </span>
                            <button
                              onClick={handleCopy}
                              title={copied ? "Copied!" : "Copy address"}
                              className="shrink-0 transition-colors"
                              style={{ color: copied ? EMERALD : isDark ? "rgba(255,255,255,0.4)" : "#9CA3AF" }}
                            >
                              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                          {copied && <p className="text-[10px] mt-1" style={{ color: EMERALD }}>Address copied!</p>}
                        </div>
                      </div>

                      {/* ── Step 4: confirm + upload receipt ── */}
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 dark:text-white/30 mb-2">
                        4. Confirm &amp; upload proof
                      </p>

                      <div
                        className="flex items-center gap-3 mb-3 cursor-pointer select-none rounded-lg p-2.5"
                        style={{ background: checked ? "rgba(80,200,120,0.08)" : "transparent" }}
                        onClick={() => setChecked((v) => !v)}
                      >
                        <div
                          className="w-5 h-5 rounded flex items-center justify-center shrink-0 transition-colors"
                          style={{
                            background: checked ? EMERALD : "transparent",
                            border: checked ? `2px solid ${EMERALD}` : isDark ? "2px solid rgba(255,255,255,0.25)" : "2px solid #D1D5DB",
                          }}
                        >
                          {checked && <Check className="w-3 h-3 text-[#00170d]" strokeWidth={3} />}
                        </div>
                        <span className="text-[13px] text-gray-700 dark:text-white/70">
                          I have sent this payment to the address above
                        </span>
                      </div>

                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className="rounded-xl p-3 transition-all mb-3"
                        style={{
                          border: `1.5px dashed ${isDragging ? EMERALD : isDark ? "rgba(255,255,255,0.15)" : "#D1D5DB"}`,
                          background: isDragging ? "rgba(80,200,120,0.06)" : isDark ? "rgba(255,255,255,0.03)" : "#F9FAFB",
                        }}
                      >
                        <input type="file" id="deposit-proof" accept="image/*,.pdf" onChange={handleFileInput} className="hidden" />
                        {receipt ? (
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg flex items-center justify-center overflow-hidden shrink-0 bg-gray-100 dark:bg-white/8">
                              {receipt.type.startsWith("image/") ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={URL.createObjectURL(receipt)} alt="preview" className="w-full h-full object-cover rounded-lg" />
                              ) : (
                                <Upload className="w-4 h-4 text-gray-400" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[12px] text-gray-900 dark:text-white font-medium truncate">{receipt.name}</p>
                              <p className="text-[11px] text-gray-500 dark:text-white/40">{(receipt.size / 1024).toFixed(0)} KB</p>
                            </div>
                            <button
                              onClick={() => setReceipt(null)}
                              className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                              style={{ background: "rgba(239,68,68,0.15)" }}
                            >
                              <X className="w-3 h-3 text-red-400" />
                            </button>
                          </div>
                        ) : (
                          <label htmlFor="deposit-proof" className="flex items-center gap-3 cursor-pointer">
                            <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(80,200,120,0.14)" }}>
                              <Upload className="w-4 h-4" style={{ color: EMERALD }} />
                            </div>
                            <div>
                              <p className="text-[12px] font-bold text-gray-900 dark:text-white">Upload payment receipt</p>
                              <p className="text-[10px] text-gray-500 dark:text-white/40">Screenshot, PNG, JPG or PDF (max. 5MB)</p>
                            </div>
                          </label>
                        )}
                      </div>

                      {error && (
                        <div className="flex items-center gap-2 mb-3 rounded-xl p-3" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
                          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                          <p className="text-[12px] text-red-400">{error}</p>
                        </div>
                      )}

                      <button
                        onClick={handleSubmit}
                        disabled={!canSubmit}
                        className="w-full h-11 rounded-xl text-[13px] font-bold transition-all flex items-center justify-center gap-2"
                        style={{
                          background: canSubmit ? EMERALD : "rgba(80,200,120,0.2)",
                          color: canSubmit ? "#00170d" : "rgba(80,200,120,0.5)",
                          cursor: canSubmit ? "pointer" : "not-allowed",
                        }}
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Submitting…
                          </>
                        ) : (
                          "Submit Deposit"
                        )}
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
