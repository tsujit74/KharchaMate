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

      // Validate response structure
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

  // 🔄 Loading State
  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">Loading dashboard...</div>
    );
  }

  // ❌ Error State
  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={fetchStats}
          className="px-4 py-2 bg-black text-white rounded-lg hover:opacity-90"
        >
          Retry
        </button>
      </div>
    );
  }

  // ✅ Success State
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <StatsGrid stats={stats} />
    </div>
  );
}
