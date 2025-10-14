import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kaito Rank Tracker V2 | Find Your Crypto Rankings",
  description: "Search your Twitter rankings across 50+ top crypto projects with multi-timeframe support",
  keywords: ["kaito", "crypto", "rankings", "twitter", "web3", "leaderboard"],
  authors: [{ name: "@Over9725" }],
  openGraph: {
    title: "Kaito Rank Tracker V2",
    description: "Find your rankings across top crypto projects",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kaito Rank Tracker V2",
    description: "Find your rankings across top crypto projects",
    creator: "@Over9725",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
