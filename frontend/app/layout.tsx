import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";
import Providers from "./providers";
import OfflineBanner from "@/app/components/offlineBanner";
import LayoutWrapper from "./layoutWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kharcha-mate.vercel.app"),
  title: {
    default: "KharchaMate | Split rent, bills and trips with friends",
    template: "%s | KharchaMate",
  },
  description:
    "One shared ledger for flatmates, couples and trips. Add expenses, see who owes whom, scan bills and settle up over UPI.",
  manifest: "/manifest.json",
  icons: {
    icon: "/kms.svg",
  },
  openGraph: {
    title: "KharchaMate | Split rent, bills and trips with friends",
    description:
      "One shared ledger for flatmates, couples and trips. Settle up over UPI.",
    url: "/",
    siteName: "KharchaMate",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KharchaMate",
    description: "Split rent, bills and trips with friends. Settle over UPI.",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
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
          <OfflineBanner />
          <LayoutWrapper>{children}</LayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
