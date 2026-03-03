"use client";

import { useEffect, useState } from "react";
import { getAdminStats } from "@/app/services/admin.service";
import StatsGrid from "./components/StatsGrid";
import toast from "react-hot-toast";

type Stats = {
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

      if (
        typeof data.totalUsers !== "number" ||
        typeof data.totalGroups !== "number"
      ) {
        throw new Error("INVALID_DATA");
      }

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

  // Loading State (realistic skeleton)
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="h-8 w-64 bg-gray-200 animate-pulse mb-8" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-28 bg-white border border-gray-200 animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-red-600 mb-4 font-medium">{error}</p>
          <button
            onClick={fetchStats}
            className="px-5 py-2 bg-black text-white hover:opacity-90 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  //  Success State
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 md:p-8">
        {/* Header */}
        <div className="mb-8 border-b border-gray-200 pb-4">
          <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Platform overview and system metrics
          </p>
        </div>

        {/* Stats */}
        <StatsGrid stats={stats} />
      </div>
    </div>
  );
}