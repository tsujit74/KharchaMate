"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function RouteLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      <div className="w-10 h-10 border-4 border-gray-300 border-t-indigo-600 rounded-full animate-spin shadow-lg bg-white" />
    </div>
  );
}