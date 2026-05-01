import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });

export const metadata: Metadata = {
  title: "DJ Sambat | The Ultimate Hypeman & Party Viber",
  description: "Experience the energy with DJ Sambat. Bookings for clubs, weddings, and premium events.",
  keywords: ["DJ Sambat", "Hypeman", "Party Viber", "Event DJ", "Booking DJ"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${montserrat.variable}`}>
        {children}
      </body>
    </html>
  );
}
