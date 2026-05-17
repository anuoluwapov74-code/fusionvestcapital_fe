"use client";

export default function Preloader() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f5f5ff] dark:bg-gradient-to-br dark:from-[#00002e] dark:via-[#000020] dark:to-[#000012]">
      <div className="mb-12">
        <span className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white select-none">
          FusionVest<span className="text-[#000080] dark:text-[#50C878]">Capital</span>
        </span>
      </div>

      {/* Spinner */}
      <div className="relative w-16 h-16 mb-8">
        <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-white/10"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#000080] dark:border-t-[#50C878] animate-spin"></div>
      </div>

      <p className="text-lg font-medium text-gray-500 dark:text-gray-400 animate-pulse">
        Loading...
      </p>
    </div>
  );
}
