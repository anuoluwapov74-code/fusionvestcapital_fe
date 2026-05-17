"use client";

import React from "react";

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Create Your Account",
      description: "Sign up in minutes and verify your identity to get started with our secure platform.",
    },
    {
      number: "02",
      title: "Set Your Investment Amount",
      description: "Choose how much you want to invest and set your risk management preferences.",
    },
    {
      number: "03",
      title: "Choose Strategy",
      description: "Browse through successful traders and select strategies that match your goals.",
    },
    {
      number: "04",
      title: "Track & Grow Your Profits",
      description: "Monitor your investments in real-time and watch your portfolio grow automatically.",
    },
  ];

  return (
    <section id="how-it-works" className="relative py-8 lg:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-[#000080] dark:text-[#50C878] mb-3">
            Simple Process
          </p>
          <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">
            How it works
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-gray-500 dark:text-gray-400 lg:text-base">
            Getting started with copy trading is simple. Follow these four easy
            steps to begin your investment journey today.
          </p>
        </div>

        {/* Steps */}
        <div className="relative mt-6 lg:mt-10">
          {/* Connecting line — desktop */}
          <div className="absolute top-12 left-0 right-0 hidden lg:block">
            <div className="mx-auto max-w-3xl h-px bg-gradient-to-r from-transparent via-[#50C878]/40 dark:via-[#50C878]/30 to-transparent" />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
            {steps.map((step, index) => (
              <StepCard key={index} {...step} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const StepCard = ({ number, title, description }: { number: string; title: string; description: string }) => (
  <div className="group relative rounded-2xl border border-[#000080]/[0.08] dark:border-[#50C878]/[0.08] bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm p-6 lg:p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#000080]/[0.08] dark:hover:shadow-[#50C878]/[0.06] hover:border-[#000080]/25 dark:hover:border-[#50C878]/25">
    {/* Step badge */}
    <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-[#000080] dark:bg-[#50C878] text-sm font-bold text-white dark:text-[#000025] shadow-lg shadow-[#000080]/25 dark:shadow-[#50C878]/25 transition-transform duration-300 group-hover:scale-110">
      {number}
    </div>
    <h3 className="text-base font-bold lg:text-lg mb-2">{title}</h3>
    <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">{description}</p>
  </div>
);

export default HowItWorks;
