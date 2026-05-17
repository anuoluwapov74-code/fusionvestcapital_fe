import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import Link from "next/link";
import PagePreloader from "@/components/PagePreloader";
import Image from "next/image";

export default function AboutPage() {
  return (
    <PagePreloader>
      <Navbar />
      <main className="pt-16 lg:pt-20">
        <div className="max-w-4xl mx-auto px-6 py-12 lg:py-20">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              About FUSIONVEST CAPITAL
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Democratizing copy trading for everyone
            </p>
          </div>

          {/* Content */}
          <div className="space-y-12">
            {/* Our Story */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Our Story
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                FUSIONVEST CAPITAL was founded with a clear mission: to make
                professional-grade copy trading accessible to everyone. We
                believe that every investor, regardless of experience level,
                should have the ability to mirror the strategies of
                top-performing traders with precision, flexibility, and
                transparency.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                From our early days, we set out to build a platform that bridges
                the gap between experienced traders and those looking to learn
                and grow their portfolios. Today, FUSIONVEST CAPITAL serves a global
                community of traders across futures, options, and contracts.
              </p>
            </section>

            {/* Story images */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="aspect-video rounded-2xl overflow-hidden">
                <Image
                  src="/images/about_1.jpg"
                  alt="FUSIONVEST CAPITAL team in discussion"
                  width={600}
                  height={340}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-video rounded-2xl overflow-hidden">
                <Image
                  src="/images/about_2.jpg"
                  alt="FUSIONVEST CAPITAL annual report presentation"
                  width={600}
                  height={340}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Our Mission */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Our Mission
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Our mission is to empower individuals worldwide to participate
                in financial markets by providing intuitive copy trading tools,
                real-time trade mirroring, and a transparent community of
                traders. We are committed to removing barriers to entry and
                ensuring that every user has the resources they need to make
                informed investment decisions.
              </p>
            </section>

            {/* Our Values */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Our Values
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Transparency
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    We believe in full visibility. Every trader&apos;s
                    performance, fees, and risk metrics are openly available so
                    you can make informed decisions.
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Innovation
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    From AutoGuard&trade; risk protection to real-time trade
                    mirroring, we continuously build cutting-edge tools that keep
                    you ahead.
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Security
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    Your funds and data are protected with enterprise-grade
                    encryption, segregated accounts, and multi-layered security
                    protocols.
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Community
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    We foster a global network of traders who learn from each
                    other, share strategies, and grow together.
                  </p>
                </div>
              </div>
            </section>

            {/* Our Team */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Our Team
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Behind FUSIONVEST CAPITAL is a diverse team of financial professionals,
                technologists, and compliance experts united by a shared passion
                for making copy trading better. Our team brings decades of
                combined experience in financial services, fintech development,
                and regulatory compliance.
              </p>
            </section>

            {/* Team images */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="aspect-video rounded-2xl overflow-hidden">
                <Image
                  src="/images/about_3.jpg"
                  alt="FUSIONVEST CAPITAL team collaborating"
                  width={600}
                  height={340}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-video rounded-2xl overflow-hidden">
                <Image
                  src="/images/about_4.jpg"
                  alt="FUSIONVEST CAPITAL team meeting"
                  width={600}
                  height={340}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Global Presence */}
            <section>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Global Presence
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                FUSIONVEST CAPITAL operates under strict regulatory oversight across
                multiple jurisdictions, ensuring the highest standards of
                compliance and client protection:
              </p>
              <ul className="space-y-4 ml-6">
                <li className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    Europe
                  </span>{" "}
                  &mdash; FUSIONVEST CAPITAL (Europe) Ltd., authorised and regulated by
                  the Cyprus Securities Exchange Commission (CySEC) under
                  license #109/10.
                </li>
                <li className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    United Kingdom
                  </span>{" "}
                  &mdash; FUSIONVEST CAPITAL (UK) Ltd., authorised and regulated by the
                  Financial Conduct Authority (FCA) under FRN 583263.
                </li>
                <li className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    United States
                  </span>{" "}
                  &mdash; FUSIONVEST CAPITAL (USA) Ltd., authorised and regulated by
                  SEC; CRD 298461.
                </li>
                <li className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    Middle East
                  </span>{" "}
                  &mdash; FUSIONVEST CAPITAL (ME) Limited, licensed by ADGM&apos;s
                  Financial Services Regulatory Authority (FSRA) under
                  Permission Number 220073.
                </li>
              </ul>
            </section>

            {/* Contact CTA */}
            <section className="bg-gray-100 dark:bg-gray-900 rounded-2xl p-8 border-2 border-gray-200 dark:border-gray-800">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Get in Touch
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Have questions about FUSIONVEST CAPITAL? We&apos;d love to hear from
                you. Reach out to our team at{" "}
                <a
                  href="mailto:support@fusionvestcapital.com"
                  className="text-[#000080] dark:text-[#50C878] hover:text-[#0000b3] dark:hover:text-[#6de496] underline"
                >
                  support@fusionvestcapital.com
                </a>{" "}
                or start a conversation through our live chat.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/register"
                  className="inline-block bg-[#000080] hover:bg-[#0000b3] dark:bg-[#50C878] dark:hover:bg-[#3ab060] text-white dark:text-[#000025] px-8 py-3 rounded-full font-semibold transition-all duration-300 shadow-lg shadow-[#000080]/30 dark:shadow-[#50C878]/30 hover:shadow-[#000080]/50 dark:hover:shadow-[#50C878]/50"
                >
                  Get Started
                </Link>
                <Link
                  href="/"
                  className="inline-block bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-900 dark:text-white px-8 py-3 rounded-full font-semibold transition-all duration-300"
                >
                  Go Back Home
                </Link>
              </div>
            </section>
          </div>
        </div>
        <Footer />
      </main>
    </PagePreloader>
  );
}
