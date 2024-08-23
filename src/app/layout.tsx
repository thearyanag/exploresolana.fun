import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Explore Solana",
  description: "Explore Solana with just a link",
  openGraph : {
    type: "website",
    url: "https://exploresolana.fun",
    title: "Explore Solana",
    description: "Explore Solana with just a link",
    images: [
      {
        url: "https://exploresolana.fun/banner.png",
        width: 1200,
        height: 630,
        alt: "Og Image Alt",
      },
    ],
    
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
