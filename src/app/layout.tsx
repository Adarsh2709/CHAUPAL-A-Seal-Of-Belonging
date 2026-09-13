import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "Chaupal — A Seal of Belonging",
  description:
    "Prove you belong to your community without revealing the membership list. Privacy-preserving membership verification for Indian communities, built on Ethereum.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <Providers>
          <div className="min-h-screen flex flex-col relative z-10">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}