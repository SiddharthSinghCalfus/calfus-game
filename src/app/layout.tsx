import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GameProvider } from "@/components/GameProvider";
import { AuthProvider } from "@/components/AuthProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Neural Arena — Humans vs. AI • Live",
  description: "Neural Arena — Humans vs. AI • Live leaderboard",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`dark ${inter.variable} font-sans`}>
      <body className="antialiased">
        <GameProvider>
          <AuthProvider>{children}</AuthProvider>
        </GameProvider>
      </body>
    </html>
  );
}
