"use client";

import React, { useState } from "react";

const FAQSection = () => {
  const faqs = [
    {
      question: "Do I need trading experience?",
      answer:
        "No trading experience is required. Our platform is designed for both beginners and experienced traders. You can start copying expert traders immediately and learn as you go.",
    },
    {
      question: "Can I stop copying anytime?",
      answer:
        "Yes, you have complete control. You can start or stop copying any trader at any time with just one click. There are no lock-in periods or penalties for stopping.",
    },
    {
      question: "Is my money safe?",
      answer:
        "Your funds are held in top-tier institutions and are completely secure. We use bank-level encryption and security measures. Your money remains in your own brokerage account, and we never have direct access to your funds.",
    },
    {
      question: "What is the minimum investment?",
      answer:
        "The minimum investment varies depending on the trader you want to copy and your broker's requirements. Generally, you can start with as little as $500, but we recommend starting with at least $1,000 for better diversification.",
    },
  ];

  return (
    <section className="relative py-8 lg:py-14">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center lg:mb-16">
          <p className="text-sm font-bold uppercase tracking-widest text-[#000080] dark:text-[#50C878] mb-3">
            FAQ
          </p>
          <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">
            Your Questions, Answered
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-gray-500 dark:text-gray-400 lg:text-base">
            Got questions about how copy trading works? We&apos;ve compiled answers
            to the most frequently asked questions.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
          {faqs.map((faq, index) => (
            <FAQItem key={index} {...faq} />
          ))}
        </div>
      </div>
    </section>
  );
};

const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="group rounded-2xl border border-[#000080]/8 dark:border-[#50C878]/8 bg-white/70 dark:bg-white/[0.02] backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-[#000080]/5 dark:hover:shadow-[#50C878]/5 hover:border-[#000080]/20 dark:hover:border-[#50C878]/20">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-5 text-left transition-all"
      >
        <span className={`pr-4 text-sm font-semibold transition-colors lg:text-base ${isOpen ? "text-[#000080] dark:text-[#50C878]" : ""}`}>
          {question}
        </span>
        <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
          isOpen
            ? "bg-[#000080] dark:bg-[#50C878] text-white dark:text-[#000025] rotate-45 scale-110"
            : "bg-[#000080]/6 dark:bg-[#50C878]/8 text-gray-500 dark:text-gray-400 group-hover:bg-[#000080]/10 dark:group-hover:bg-[#50C878]/12"
        }`}>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </span>
      </button>

      <div className={`overflow-hidden transition-all duration-500 ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="border-t border-[#000080]/6 dark:border-[#50C878]/6 px-5 pb-5 pt-4">
          <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">{answer}</p>
        </div>
      </div>
    </div>
  );
};

export default FAQSection;
