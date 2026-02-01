import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KharchaMate",
  description: "Smart expense splitting for groups",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        
        <meta name="color-scheme" content="light" />
      </head>

      <body
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          antialiased
          bg-[#FCFCFD]
          text-gray-900
        `}
      >
        <Providers>
          <Navbar />

          <main className="min-h-screen pt-14">
            {children}
          </main>

          <Footer />
        </Providers>
      </body>
    </html>
  );
}
