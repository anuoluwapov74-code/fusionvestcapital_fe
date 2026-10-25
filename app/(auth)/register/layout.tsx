import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Sign up for UPHOLDTRADES and start copy trading futures, options, and contracts.",
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
