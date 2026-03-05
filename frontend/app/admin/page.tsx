"use client";

import { useEffect, useState } from "react";
import { getAdminStats } from "@/app/services/admin.service";
import StatsGrid from "./components/StatsGrid";
import DashboardHeader from "./components/DashobardHeader";
import toast from "react-hot-toast";

type Stats = {
  blockedGroups: number;
  blockedUsers: number;
  totalUsers: number;
  totalGroups: number;
  totalExpenses: number;
  totalMoney: number;
  newUsersThisMonth: number;
  loggedInThisMonth: number;
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

  // Loading
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-gray-200 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-28 bg-white border animate-pulse rounded-lg"
            />
          ))}
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchStats}
            className="px-5 py-2 bg-black text-white rounded hover:opacity-90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <DashboardHeader
        title="Admin Dashboard"
        subtitle="Platform analytics and system overview"
      />

      <div className="bg-white border border-slate-200 rounded p-8">
        <StatsGrid stats={stats} />
      </div>
    </div>
  );
}
