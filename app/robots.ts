import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/portfolio",
          "/onboarding",
          "/kyc",
          "/settings",
          "/profile",
          "/notifications",
          "/transfer",
          "/withdraw",
          "/trade-history",
          "/transactions",
          "/referral",
          "/connect-wallet",
          "/live-trading",
          "/signals",
          "/news",
          "/stock",
          "/explore-traders",
        ],
      },
    ],
    sitemap: "https://fusionvestcapital.com/sitemap.xml",
  };
}
