"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMe } from "@/app/services/auth.service";
import toast from "react-hot-toast";

import Sidebar from "./components/Sidebar";
import RouteLoader from "../components/RouteLoader";
import { AdminNotificationProvider } from "@/app/context/AdminNotificationContext";
import { UserCog, LayoutDashboard } from "lucide-react";
import AdminNotificationBell from "./components/AdminNotificationBell";

type Props = {
  children: ReactNode;
};

export default function AdminLayout({ children }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string>("Admin");

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

        setUserName(user.name || "Admin");
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
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-300">
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 shadow-xl backdrop-blur">
          <LayoutDashboard className="h-5 w-5 text-sky-400" />
          <span className="text-sm font-medium">Checking admin access...</span>
        </div>
      </div>
    );
  }

  return (
    <AdminNotificationProvider>
      <div className="flex h-screen overflow-hidden bg-slate-100 text-slate-900">
        <aside className="hidden h-full w-72 shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
          <div className="flex h-full flex-col">
            <div className="flex-1 overflow-y-auto px-4 py-5">
              <Sidebar />
            </div>

            <div className="mt-auto border-t border-slate-200 p-4">
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Signed in as
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <UserCog className="h-4 w-4 text-slate-500" />
                  <p className="text-sm font-semibold text-slate-800">
                    {userName}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 shrink-0 border-b border-slate-200 bg-white/95 backdrop-blur">
            <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Administrative workspace
                </p>
                <h2 className="truncate text-base font-bold text-slate-950 sm:text-lg">
                  Admin Panel
                </h2>
              </div>

              <div className="hidden items-center gap-2 md:flex">
                <div className="rounded-full px-3 py-1 text-xs font-semibold text-emerald-700">
                  <AdminNotificationBell/>
                </div>
                <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  System healthy
                </div>
                <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  Role: Admin
                </div>
              </div>
            </div>
          </header>

          <RouteLoader />

          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
              <div className="mb-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm lg:hidden">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Admin Panel
                    </p>
                    <p className="text-sm font-semibold text-slate-900">
                      {userName}
                    </p>
                  </div>
                  <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                    Mobile layout
                  </div>
                </div>
              </div>

              {children}
            </div>
          </main>
        </div>
      </div>
    </AdminNotificationProvider>
  );
}