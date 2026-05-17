"use client";

import { useEffect, useRef } from "react";

const LiquidityProvidersSection = () => {
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  const row3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const animateRow = (
      rowElement: HTMLDivElement,
      speed: number,
      direction: "ltr" | "rtl",
    ) => {
      let x = 0;
      let startTime: number;

      const move = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const time = timestamp - startTime;
        const distance = (speed / 1000) * time || 0;
        startTime = timestamp;

        const firstChild = rowElement.children[0] as HTMLElement;
        if (!firstChild) return;

        const firstChildRect = firstChild.getBoundingClientRect();

        if (x > firstChildRect.width) {
          if (direction === "ltr") {
            rowElement.appendChild(firstChild);
          } else {
            rowElement.insertBefore(
              rowElement.lastElementChild!,
              rowElement.firstElementChild,
            );
          }
          x = 0;
        } else {
          x += distance;
        }

        rowElement.style.transform = `translateX(${direction === "rtl" ? x : -x}px)`;
        requestAnimationFrame(move);
      };

      requestAnimationFrame(move);
    };

    if (row1Ref.current) animateRow(row1Ref.current, 50, "ltr");
    if (row2Ref.current) animateRow(row2Ref.current, 45, "rtl");
    if (row3Ref.current) animateRow(row3Ref.current, 40, "ltr");
  }, []);

  const row1Logos = [
    "Alfa_bank", "Banco_de_brazil", "Bank_of_ireland", "Bank_of_montreal",
    "Bank_of_america", "Bank_of_china", "Bank_of_scotland", "Bawag",
    "Bayern_LB", "BBVA", "BCV", "BNP_Paribas", "Citibank", "Barclays",
    "HSBC", "JP_morgan", "Basler_kantonalbank", "The_royal_bank_of_scotland",
    "UBS", "Westpac_australia_first_bank", "merrill", "Abbey", "ABN_mro", "ADCB",
  ];

  const row2Logos = [
    "DNB_asa", "DZ_bank", "Eco_bank", "Erste_bank", "Fifth_third_bank",
    "Fortis", "Goldman_sachs", "Handelsbanken", "Helaba", "Berenberg",
    "BHF_bank", "CIBC", "Citizens_bank_logo", "Commerzbank", "Credit_agricole",
    "Credit_europe_bank", "Credit_suisse", "Danske_bank", "DBS_bank", "Dexia_banque",
  ];

  const row3Logos = [
    "Societe_generale", "HSH_nordbank", "ING", "Intesa_san_paolo", "Investec",
    "Itau", "LGT", "Mizuho", "MUFG", "Nedbank", "Nomura", "Nordea",
    "Oberbank", "Post_finance", "Postbank", "Rabobank", "Raiffeisen_bank_russia",
    "RBC", "Scotia_bank", "SEB",
  ];

  const logoPositions: Record<string, string> = {
    Abbey: "0 0", ABN_mro: "0 -2.5625rem", ADCB: "0 -5.125rem",
    Alfa_bank: "0 -7.6875rem", Banco_de_brazil: "-13.1875rem 0",
    Bank_of_america: "-13.1875rem -2.5625rem", Bank_of_china: "-13.1875rem -5.125rem",
    Bank_of_ireland: "-13.1875rem -7.6875rem", Bank_of_montreal: "-13.1875rem -10.25rem",
    Bank_of_scotland: "0 -12.8125rem", Barclays: "-13.1875rem -12.8125rem",
    Basler_kantonalbank: "0 -15.375rem", Bawag: "-13.1875rem -15.375rem",
    Bayern_LB: "0 -17.9375rem", BBVA: "-13.1875rem -17.9375rem",
    BCV: "0 -20.5rem", Berenberg: "-13.1875rem -20.5rem",
    BHF_bank: "0 -23.0625rem", BNP_Paribas: "-13.1875rem -23.0625rem",
    CIBC: "-26.375rem 0", Citibank: "-26.375rem -2.5625rem",
    Citizens_bank_logo: "-26.375rem -5.125rem", Commerzbank: "-26.375rem -7.6875rem",
    Credit_agricole: "-26.375rem -10.25rem", Credit_europe_bank: "-26.375rem -12.8125rem",
    Credit_suisse: "-26.375rem -15.375rem", Danske_bank: "-26.375rem -17.9375rem",
    DBS_bank: "-26.375rem -20.5rem", Dexia_banque: "-26.375rem -23.0625rem",
    DNB_asa: "0 -25.625rem", DZ_bank: "-13.1875rem -25.625rem",
    Eco_bank: "-26.375rem -25.625rem", Erste_bank: "0 -28.1875rem",
    Fifth_third_bank: "-13.1875rem -28.1875rem", Fortis: "-26.375rem -28.1875rem",
    Goldman_sachs: "0 -30.75rem", Handelsbanken: "-13.1875rem -30.75rem",
    Helaba: "-26.375rem -30.75rem", HSBC: "0 -33.3125rem",
    HSH_nordbank: "-13.1875rem -33.3125rem", ING: "-26.375rem -33.3125rem",
    Intesa_san_paolo: "0 -35.875rem", Investec: "-13.1875rem -35.875rem",
    Itau: "-26.375rem -35.875rem", JP_morgan: "-39.5625rem 0",
    LGT: "-39.5625rem -2.5625rem", merrill: "-39.5625rem -5.125rem",
    Mizuho: "-39.5625rem -7.6875rem", MUFG: "-39.5625rem -10.25rem",
    Nedbank: "-39.5625rem -12.8125rem", Nomura: "-39.5625rem -15.375rem",
    Nordea: "-39.5625rem -17.9375rem", Oberbank: "-39.5625rem -20.5rem",
    Post_finance: "-39.5625rem -25.625rem", Postbank: "-39.5625rem -28.1875rem",
    Rabobank: "-39.5625rem -30.75rem", Raiffeisen_bank_russia: "-39.5625rem -33.3125rem",
    RBC: "-39.5625rem -35.875rem", Scotia_bank: "0 -38.4375rem",
    SEB: "-13.1875rem -38.4375rem", Societe_generale: "-26.375rem -38.4375rem",
    The_royal_bank_of_scotland: "-39.5625rem -38.4375rem",
    UBS: "0 -41rem", Westpac_australia_first_bank: "-13.1875rem -41rem",
  };

  const LogoItem = ({ name }: { name: string }) => (
    <div className="flex-shrink-0 px-3 py-5 md:px-[15px]">
      <div className="w-[170px] md:w-[250px] h-[50px] md:h-[80px] bg-white rounded-[10px] flex items-center justify-center transition-all duration-300 hover:shadow-lg hover:shadow-[#000080]/10 relative overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 w-[210px] h-[40px] -translate-x-1/2 -translate-y-1/2 md:scale-100 scale-[0.62]"
          style={{
            backgroundImage: "url(/logos_au.png)",
            backgroundSize: "52.75rem 43.5625rem",
            backgroundPosition: logoPositions[name] || "0 0",
            backgroundRepeat: "no-repeat",
          }}
        />
      </div>
    </div>
  );

  return (
    <section id="liquidity-providers" className="relative py-8 md:py-14 overflow-hidden">
      {/* Deep navy background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#00002e] via-[#000020] to-[#000035]" />

      {/* Glow accents */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[300px] bg-[#000080]/25 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[350px] h-[250px] bg-[#50C878]/8 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative container mx-auto px-4">
        <div className="text-center mb-6 md:mb-10">
          <p className="text-sm font-bold uppercase tracking-widest text-[#50C878] mb-3">
            Partners
          </p>
          <h2 className="text-3xl md:text-5xl lg:text-[52px] font-bold mb-4 bg-gradient-to-r from-[#a0a0ff] via-white to-[#50C878] bg-clip-text text-transparent inline-block">
            LIQUIDITY PROVIDERS
          </h2>
          <p className="text-white/80 text-base md:text-lg lg:text-xl">
            FUSIONVEST CAPITAL currently has a variety of liquidity providers, including
            but not limited to:
          </p>
        </div>

        <div
          className="overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(90deg, rgba(255,255,255,0.15) 0%, rgb(255,255,255) 20%, rgb(255,255,255) 80%, rgba(255,255,255,0.15) 100%)",
            WebkitMaskImage:
              "linear-gradient(90deg, rgba(255,255,255,0.15) 0%, rgb(255,255,255) 20%, rgb(255,255,255) 80%, rgba(255,255,255,0.15) 100%)",
          }}
        >
          <div className="overflow-hidden mb-0">
            <div ref={row1Ref} className="flex">
              {[...row1Logos, ...row1Logos].map((logo, index) => (
                <LogoItem key={`row1-${index}`} name={logo} />
              ))}
            </div>
          </div>
          <div className="overflow-hidden mb-0">
            <div ref={row2Ref} className="flex flex-row-reverse">
              {[...row2Logos, ...row2Logos].map((logo, index) => (
                <LogoItem key={`row2-${index}`} name={logo} />
              ))}
            </div>
          </div>
          <div className="overflow-hidden">
            <div ref={row3Ref} className="flex">
              {[...row3Logos, ...row3Logos].map((logo, index) => (
                <LogoItem key={`row3-${index}`} name={logo} />
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 md:mt-14 text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-3">
            Instant account opening &amp; funding
          </h2>
          <p className="text-lg md:text-xl text-white/70 mb-8">
            Trade within minutes!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="/register"
              className="px-8 py-3 bg-[#50C878] text-white rounded-full font-semibold hover:bg-[#3ab060] hover:shadow-xl hover:shadow-[#50C878]/25 transition-all duration-300 hover:-translate-y-0.5 text-sm"
            >
              Get Started
            </a>
            <a
              href="/login"
              className="px-8 py-3 border border-[#50C878]/30 text-[#50C878] rounded-full font-semibold hover:bg-[#50C878]/10 hover:border-[#50C878]/60 transition-all duration-300 text-sm"
            >
              Trade Now
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiquidityProvidersSection;
