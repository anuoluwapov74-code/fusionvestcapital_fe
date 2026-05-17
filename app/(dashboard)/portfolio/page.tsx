"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { apiFetch } from "@/lib/api";
import BalanceCard from "@/components/dashboard/portfolio/BalanceCard";
import {
  AssetAllocationCard,
  LiveTradingCard,
} from "@/components/dashboard/portfolio/DashboardCards";
import {
  FollowingSection,
  TradeCopiedSection,
} from "@/components/dashboard/portfolio/TradingSections";
import DepositModal from "@/components/dashboard/modals/DepositModal";
import WithdrawModal from "@/components/dashboard/modals/WithdrawModal";
import TransactionHistoryModal from "@/components/dashboard/modals/TransactionHistoryModal";

interface DashboardData {
  balance: number;
  availableBalance: number;
  totalDeposits: number;
  totalWithdrawals: number;
  totalProfits: number;
  isVerified: boolean;
  firstName: string;
}

export default function PortfolioPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    balance: 0,
    availableBalance: 0,
    totalDeposits: 0,
    totalWithdrawals: 0,
    totalProfits: 0,
    isVerified: false,
    firstName: "",
  });

  // Modal states
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Re-fetch when modals close (to update balance display)
  const handleDepositClose = () => {
    setShowDeposit(false);
    fetchDashboardData();
  };

  const handleWithdrawClose = () => {
    setShowWithdraw(false);
    fetchDashboardData();
  };

  const handleHistoryClose = () => {
    setShowHistory(false);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const fetchDashboardData = async () => {
    try {
      // Fetch user profile for balance info
      const profileRes = await apiFetch("/profile/");
      const profileData = await profileRes.json();

      if (profileData.success) {
        const user = profileData.user;
        setDashboardData((prev) => ({
          ...prev,
          balance: parseFloat(user.balance) || 0,
          availableBalance: parseFloat(user.balance) || 0,
          totalProfits: parseFloat(user.profit) || 0,
          isVerified: user.is_verified || false,
          firstName: user.first_name || "",
        }));
      }

      // Fetch transaction totals
      const [depositRes, withdrawalRes] = await Promise.all([
        apiFetch("/deposits/history/?limit=100"),
        apiFetch("/withdrawals/history/?limit=100"),
      ]);

      const depositData = await depositRes.json();
      const withdrawalData = await withdrawalRes.json();

      let totalDeposits = 0;
      let totalWithdrawals = 0;

      if (depositData.success) {
        totalDeposits = depositData.transactions
          .filter((t: { status: string }) => t.status === "completed")
          .reduce((sum: number, t: { amount: string }) => sum + parseFloat(t.amount), 0);
      }

      if (withdrawalData.success) {
        totalWithdrawals = withdrawalData.transactions
          .filter((t: { status: string }) => t.status === "completed")
          .reduce((sum: number, t: { amount: string }) => sum + parseFloat(t.amount), 0);
      }

      setDashboardData((prev) => ({
        ...prev,
        totalDeposits,
        totalWithdrawals,
      }));
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    }
  };

  return (
    <div className="space-y-4">
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          {getGreeting()}, {dashboardData.firstName || "Trader"}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          Here&apos;s an overview of your portfolio and trading activity
        </p>
      </motion.div>

      {/* ROW 1: Balance Card (2/3) + Right Sidebar (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <BalanceCard
            balance={dashboardData.balance}
            availableBalance={dashboardData.availableBalance}
            totalDeposits={dashboardData.totalDeposits}
            totalWithdrawals={dashboardData.totalWithdrawals}
            totalProfits={dashboardData.totalProfits}
            isVerified={dashboardData.isVerified}
            onDeposit={() => setShowDeposit(true)}
            onWithdraw={() => setShowWithdraw(true)}
            onHistory={() => setShowHistory(true)}
          />
        </div>

        <div className="flex flex-col gap-4">
          <LiveTradingCard />
          <AssetAllocationCard
            balance={dashboardData.balance}
            totalDeposits={dashboardData.totalDeposits}
            totalWithdrawals={dashboardData.totalWithdrawals}
            totalProfits={dashboardData.totalProfits}
          />
        </div>
      </div>

      {/* ROW 2: Trade Copied (2/3) + Following (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <TradeCopiedSection />
        </div>
        <div>
          <FollowingSection />
        </div>
      </div>

      {/* Modals */}
      <DepositModal isOpen={showDeposit} onClose={handleDepositClose} />
      <WithdrawModal isOpen={showWithdraw} onClose={handleWithdrawClose} />
      <TransactionHistoryModal isOpen={showHistory} onClose={handleHistoryClose} />
    </div>
  );
}
