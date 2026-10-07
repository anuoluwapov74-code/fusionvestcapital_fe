import type { Metadata } from "next";
import { Poppins, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import Script from "next/script";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://fusionsvest.com"),
  title: {
    default: "FUSION VEST - Copy Futures, Options & Contracts with Precision",
    template: "%s | FUSION VEST",
  },
  description:
    "Mirror real-time stock and options trades from top-performing traders. Precision, flexibility, and transparency straight to your fingertips.",
  keywords: [
    "copy trading",
    "futures trading",
    "options trading",
    "stock trading",
    "trade copying",
    "FUSION VEST",
  ],
  openGraph: {
    type: "website",
    url: "https://fusionsvest.com",
    siteName: "FUSION VEST",
    title: "FUSION VEST - Copy Futures, Options & Contracts with Precision",
    description:
      "Mirror real-time stock and options trades from top-performing traders. Precision, flexibility, and transparency straight to your fingertips.",
    images: [
      {
        url: "https://fusionsvest.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "FUSION VEST - Social Copy Trading Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FUSION VEST - Copy Futures, Options & Contracts with Precision",
    description:
      "Mirror real-time stock and options trades from top-performing traders. Precision, flexibility, and transparency straight to your fingertips.",
    images: ["https://fusionsvest.com/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      
      <body
        className={`${poppins.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>

        {/* LiveChat - Jovo */}

        <Script
          src="//code.jivosite.com/widget/Vfcat1fGzM"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}



