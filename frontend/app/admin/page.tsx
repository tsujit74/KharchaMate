"use client";

import { useEffect, useState } from "react";
import { getAdminStats } from "@/app/services/admin.service";
import StatsGrid from "./components/StatsGrid";
import DashboardHeader from "./components/DashobardHeader";
import toast from "react-hot-toast";
import RefreshButton from "./components/RefreshButton";
import SystemHealthCard from "./components/SystemHealthCard";

type Stats = {
  blockedGroups: number;
  blockedUsers: number;
  totalUsers: number;
  totalGroups: number;
  totalExpenses: number;
  totalMoney: number;
  newUsersThisMonth: number;
  loggedInThisMonth: number;
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  resolvedTickets: number;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAdminStats();
      setStats(data);
    } catch (err: any) {
      let message = "Failed to load dashboard statistics.";

      if (err.message === "UNAUTHORIZED") {
        message = "Session expired. Please login again.";
      } else if (err.message === "FORBIDDEN") {
        message = "Admin access required.";
      } else if (err.message === "NETWORK_ERROR") {
        message = "Network error. Please check connection.";
      }

      toast.error(message);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-20 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm animate-pulse">
          <div className="h-6 w-56 rounded bg-slate-200" />
          <div className="mt-3 h-4 w-80 rounded bg-slate-100" />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-28 rounded-2xl border border-slate-200 bg-white shadow-sm animate-pulse"
            />
          ))}
        </div>

        <div className="h-64 rounded-2xl border border-slate-200 bg-white shadow-sm animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="mb-4 text-red-600">{error}</p>
          <button
            onClick={fetchStats}
            className="rounded-xl bg-slate-950 px-5 py-2 text-white transition hover:bg-slate-800"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <DashboardHeader
          title="Admin Dashboard"
          subtitle="Platform analytics and system overview"
        />
        <RefreshButton onRefresh={fetchStats} loading={loading} />
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-6">
        <StatsGrid stats={stats} />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-6">
        <SystemHealthCard />
      </section>
    </div>
  );
}