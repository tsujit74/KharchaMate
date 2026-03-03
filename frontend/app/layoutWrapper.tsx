"use client";

import { usePathname } from "next/navigation";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Navbar />}

      <main className={!isAdminRoute ? "min-h-screen pt-16" : "min-h-screen"}>
        {children}
      </main>

      {!isAdminRoute && <Footer />}
    </>
  );
}