"use client";

import React, { useState } from "react";
import Link from "next/link";

interface FooterLink {
  label: string;
  href: string;
}

const Footer = () => {
  return (
    <footer className="border-t border-[#000080]/10 dark:border-[#50C878]/10 bg-white/80 dark:bg-[#00001a]/90 backdrop-blur-sm py-8 lg:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Top Section */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">

          {/* Brand */}
          <div className="lg:col-span-3">
            <div className="mb-4">
              <span className="text-2xl font-bold tracking-tight">
                FusionVest<span className="text-[#000080] dark:text-[#50C878]">Capital</span>
              </span>
            </div>
            <p className="mb-4 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Copy trade with FusionVest Capitals
            </p>
            {/* Social links */}
            <div className="flex gap-3">
              {[
                { label: "Twitter/X", path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" },
                { label: "LinkedIn", path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" },
              ].map(({ label, path }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-[#000080]/15 dark:border-[#50C878]/15 text-gray-500 dark:text-gray-400 transition-all hover:border-[#000080]/40 dark:hover:border-[#50C878]/40 hover:text-[#000080] dark:hover:text-[#50C878] hover:bg-[#000080]/5 dark:hover:bg-[#50C878]/8"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d={path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          <div className="lg:col-span-9">
            <div className="space-y-4">
              <FooterSection
                title="LEGALS"
                links={[
                  { label: "Terms Of Service", href: "/terms-of-service" },
                  { label: "Privacy Policy", href: "/privacy-policy" },
                  { label: "Cookies Policy", href: "/cookies-policy" },
                  { label: "Risk Disclaimer", href: "/risk-disclaimer" },
                  { label: "Conflict of Interest Policy", href: "/conflict-of-interest" },
                  { label: "Declaration of Consent", href: "/declaration-of-consent" },
                  { label: "End-User License Agreement", href: "/end-user-license-agreement" },
                ]}
              />
              <FooterSection
                title="FEATURES"
                links={[{ label: "AutoGuard TM", href: "/autoguard" }]}
              />
              <FooterSection
                title="RESOURCES"
                links={[
                  { label: "Affiliate Guide", href: "/affiliate-guide" },
                  { label: "Leader Guide", href: "/leader-guide" },
                  { label: "User Guide", href: "/user-guide" },
                ]}
              />
              <FooterSection
                title="ABOUT US"
                links={[{ label: "Company", href: "/about" }]}
              />
              <FooterSection
                title="PARTNERSHIPS"
                links={[
                  { label: "Leader", href: "/leader" },
                  { label: "Affiliate", href: "/affiliate" },
                  { label: "Broker", href: "/broker" },
                ]}
              />
              <FooterSection
                title="CONTACT"
                links={[
                  { label: "+1 (929) 512-0241", href: "#" },
                  { label: "support@fusionvestcapital.com", href: "mailto:support@fusionvestcapital.com" },
                ]}
              />
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 border-t border-[#000080]/8 dark:border-[#50C878]/8 pt-8">
          <div className="space-y-4 text-xs leading-relaxed text-gray-400 dark:text-gray-500">
            <p>
              Disclaimer: SCOP VENTURES, LLC ( CRD # 331287/SEC#:802-130592 ), a
              Financial Services Company authorised and regulated by the
              Securities and Exchange Commission (SEC) and registered with the
              Financial Industry Regulatory Authority (FINRA) under the above
              referenced registration numbers. SCOP VENTURES, LLC is a duly
              incorporated limited liability company operating as a licensed
              investment and social trading platform, providing access to global
              financial markets including equities, commodities, currencies,
              indices, and digital assets. SCOP VENTURES, LLC operates across
              multiple jurisdictions in accordance with applicable securities
              laws and financial services regulations, offering its products and
              services to eligible clients in jurisdictions where such services
              are permitted by law. The company maintains its principal place of
              business in the United States and operates internationally through
              its affiliates and correspondent entities, all of which are
              subject to the oversight and regulatory framework established by
              the relevant authorities in their respective regions. SCOP
              VENTURES, LLC is committed to full regulatory compliance and the
              protection of its clients&apos; interests at all times. Clients who
              are tax residents of certain jurisdictions may be subject to local
              income taxes on income (profits) and assets in accordance with
              applicable tax laws in their country of residence.
            </p>
            <p>
              Past performance is not an indication of future results. You
              should seek advice from an independent and suitably licensed
              financial advisor and ensure that you have the risk appetite,
              relevant experience and knowledge before you decide to trade.
              Under no circumstances shall SCOP VENTURES, LLC have any liability to any
              person or entity for any loss or damage in whole or part caused
              by, resulting from, or relating to any transactions related to
              Stock and options investments are risky and do not benefit from
              the protections available to clients receiving MiFID regulated
              investment services for dispute resolution. Trading with
              SCOP VENTURES, LLC by following and/or copying or replicating the trades
              of other traders involves a high level of risks, even when
              following and/or copying or replicating the top-performing
              traders. Such risks include the risk that you may be
              following/copying the trading decisions of possibly inexperienced
              or unprofessional traders, or traders whose ultimate purpose or
              intention, or financial status may differ from yours. Past
              performance of a SCOP VENTURES, LLC Community Member is not a reliable
              indicator of his future performance. Content on SCOP VENTURES, LLC&apos;s
              social trading platform is generated by members of its community
              and does not contain advice or recommendations by or on behalf of
              SCOP VENTURES, LLC- Your Social Investment Network.
            </p>
            <p className="pt-2 text-gray-500 dark:text-gray-400">
              Copyright &copy; 2006-2026 SCOP VENTURES, LLC — Your Social Investment Network.
              All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

interface FooterSectionProps {
  title: string;
  links: FooterLink[];
}

const FooterSection = ({ title, links }: FooterSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-[#000080]/6 dark:border-[#50C878]/6 pb-3 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-2 text-left"
      >
        <span className="text-xs font-bold uppercase tracking-wider">
          {title}
        </span>
        <span
          className={`flex h-5 w-5 items-center justify-center rounded border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="mt-2 space-y-2 pb-1">
          {links.map((link, index) => (
            <li key={index}>
              <Link
                href={link.href}
                className="text-sm text-gray-500 dark:text-gray-400 transition-colors hover:text-[#000080] dark:hover:text-[#50C878]"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Footer;
