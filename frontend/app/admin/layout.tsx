"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMe } from "@/app/services/auth.service";
import toast from "react-hot-toast";
import Sidebar from "./components/Sidebar";
import RouteLoader from "../components/RouteLoader";

type Props = {
  children: ReactNode;
};

export default function AdminLayout({ children }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await getMe();
        const user = res.data?.user;

        if (!user || user.role !== "admin") {
          toast.error("Access denied. Admin only.");
          router.replace("/dashboard");
          return;
        }
      } catch {
        toast.error("Please login to continue.");
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Checking access...
      </div>
    );
  }

  return (
  <div className="h-screen bg-gray-50 flex overflow-hidden">
    
    {/* Sidebar */}
    <aside className="w-64 border-r border-gray-200 bg-white flex-shrink-0">
      <Sidebar />
    </aside>

    {/* Right side */}
    <div className="flex-1 flex flex-col min-w-0">
      
      {/* Top Header — MATCHES sidebar header */}
      <div className="h-16 border-b border-gray-200 bg-white flex items-center px-6">
        <h2 className="text-lg font-semibold text-gray-900 tracking-tight">
          Admin Panel
        </h2>
      </div>

      <RouteLoader/>

      {/* Scrollable content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
          {children}
        </div>
      </main>

    </div>
  </div>
);
}
