"use client";

import React from "react";
import Link from "next/link";
import { useTheme } from "next-themes";

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/90 dark:bg-[#00002e]/90 backdrop-blur-xl shadow-lg shadow-[#000080]/[0.06] dark:shadow-black/30 border-b border-[#000080]/[0.08] dark:border-[#50C878]/[0.08]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between lg:h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <span className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white transition-opacity group-hover:opacity-80">
              FusionVest<span className="text-[#000080] dark:text-[#50C878]">Capital</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 lg:flex">
            {["Features", "How it works", "Pricing"].map((label, i) => (
              <Link
                key={i}
                href={`#${label.toLowerCase().replace(/\s+/g, "-")}`}
                className="relative text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors hover:text-[#000080] dark:hover:text-[#50C878] group"
              >
                {label}
                <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-[#000080] dark:bg-[#50C878] transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-3 lg:flex">
            <Link
              href="/login"
              className="rounded-full border border-[#000080]/25 dark:border-[#50C878]/25 bg-transparent px-5 py-2 text-sm font-medium text-[#000080] dark:text-[#50C878] transition-all hover:border-[#000080] dark:hover:border-[#50C878] hover:bg-[#000080]/5 dark:hover:bg-[#50C878]/8"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-[#000080] dark:bg-[#50C878] px-6 py-2.5 text-sm font-semibold text-white dark:text-[#000025] transition-all hover:bg-[#0000b3] dark:hover:bg-[#3ab060] hover:shadow-lg hover:shadow-[#000080]/25 dark:hover:shadow-[#50C878]/25 hover:-translate-y-0.5"
            >
              Get Started
            </Link>

            <button
              onClick={toggleTheme}
              className="ml-1 flex h-9 w-9 items-center justify-center rounded-full border border-[#000080]/15 dark:border-[#50C878]/15 text-gray-500 dark:text-gray-400 transition-all hover:border-[#000080]/40 dark:hover:border-[#50C878]/40 hover:text-[#000080] dark:hover:text-[#50C878] hover:bg-[#000080]/5 dark:hover:bg-[#50C878]/8"
              aria-label="Toggle theme"
            >
              {mounted && (
                theme === "dark"
                  ? <SunIcon className="h-4 w-4" />
                  : <MoonIcon className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              href="/register"
              className="rounded-full bg-[#000080] dark:bg-[#50C878] px-4 py-2 text-[11px] font-semibold text-white dark:text-[#000025] transition-all hover:bg-[#0000b3] dark:hover:bg-[#3ab060] whitespace-nowrap"
            >
              Get Started
            </Link>

            <button
              onClick={toggleTheme}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[#000080]/15 dark:border-[#50C878]/15 text-gray-500 dark:text-gray-400 shrink-0"
              aria-label="Toggle theme"
            >
              {mounted && (
                theme === "dark"
                  ? <SunIcon className="h-3.5 w-3.5" />
                  : <MoonIcon className="h-3.5 w-3.5" />
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-8 w-8 flex-col items-center justify-center gap-1.5 shrink-0"
              aria-label="Toggle menu"
            >
              <span className={`h-0.5 w-5 bg-[#000080] dark:bg-[#50C878] transition-all duration-300 ${mobileMenuOpen ? "translate-y-2 rotate-45" : ""}`} />
              <span className={`h-0.5 w-5 bg-[#000080] dark:bg-[#50C878] transition-all duration-300 ${mobileMenuOpen ? "opacity-0" : ""}`} />
              <span className={`h-0.5 w-5 bg-[#000080] dark:bg-[#50C878] transition-all duration-300 ${mobileMenuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`absolute left-0 right-0 top-full overflow-hidden transition-all duration-300 lg:hidden ${
          mobileMenuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-white/97 dark:bg-[#00002e]/97 backdrop-blur-xl px-4 py-5 shadow-xl shadow-[#000080]/[0.08] dark:shadow-black/40 border-b border-[#000080]/[0.08] dark:border-[#50C878]/[0.08]">
          <div className="flex flex-col gap-1">
            {[
              { label: "Features", href: "#features" },
              { label: "How it works", href: "#how-it-works" },
              { label: "Pricing", href: "#pricing" },
            ].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 transition-colors hover:bg-[#000080]/5 dark:hover:bg-[#50C878]/8 hover:text-[#000080] dark:hover:text-[#50C878]"
                onClick={() => setMobileMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
            <div className="mt-2 border-t border-[#000080]/[0.08] dark:border-[#50C878]/[0.08] pt-3">
              <Link
                href="/login"
                className="block rounded-xl px-3 py-2.5 text-sm font-medium text-[#000080] dark:text-[#50C878] transition-colors hover:bg-[#000080]/5 dark:hover:bg-[#50C878]/8"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

const MoonIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);

const SunIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

export default Navbar;
