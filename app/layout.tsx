import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Syne, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });
const syne = Syne({ subsets: ["latin"], variable: "--font-syne" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "DJ Sambat | The Ultimate Hypeman & Party Viber",
  description: "Experience the energy with DJ Sambat. Bookings for clubs, weddings, and premium events.",
  keywords: ["DJ Sambat", "Hypeman", "Party Viber", "Event DJ", "Booking DJ"],
};

import Preloader from "@/components/Preloader";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jakarta.variable} ${syne.variable} ${mono.variable}`}>
        <Preloader />
        {children}
      </body>
    </html>
  );
}
