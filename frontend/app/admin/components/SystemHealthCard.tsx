"use client";

import { useEffect, useMemo, useState } from "react";
import { getSystemHealth } from "@/app/services/admin.service";
import { CheckCircle2, Database, Cpu, HardDrive, RefreshCw, Activity } from "lucide-react";

type HealthData = {
  status?: string;
  database?: string;
  uptime?: number;
  memory?: {
    rss?: string;
    heapUsed?: string;
    heapTotal?: string;
  };
};

export default function SystemHealthCard() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setError(null);
      const data = await getSystemHealth();
      setHealth(data);
    } catch (err) {
      console.error("Health fetch failed", err);
      setError("Failed to load system health.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const uptimeLabel = useMemo(() => {
    const uptime = health?.uptime ?? 0;
    const minutes = Math.floor(uptime / 60);
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours < 24) return `${hours}h ${remainingMinutes}m`;
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
  }, [health?.uptime]);

  if (loading && !health) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="h-6 w-40 animate-pulse rounded bg-slate-200" />
        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-slate-100" />
          ))}
        </div>
      </div>
    );
  }

  if (error && !health) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-red-600">{error}</p>
        <button
          onClick={fetchData}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          <RefreshCw className="h-4 w-4" />
          Retry
        </button>
      </div>
    );
  }

  const isDatabaseConnected = (health?.database || "").toLowerCase() === "connected";
  const isServerHealthy = (health?.status || "").toLowerCase() === "ok" || (health?.status || "").toLowerCase() === "healthy";

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
            System Health
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Live server and database monitoring.
          </p>
        </div>

        <button
          onClick={fetchData}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {error} Showing last known data.
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Server
          </p>
          <div className="mt-3 flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${isServerHealthy ? "bg-emerald-500" : "bg-red-500"}`} />
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${isServerHealthy ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
              {health?.status || "unknown"}
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Database
          </p>
          <div className="mt-3 flex items-center gap-2">
            <Database className="h-4 w-4 text-slate-500" />
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${isDatabaseConnected ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
              {health?.database || "unknown"}
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Uptime
          </p>
          <div className="mt-3 flex items-center gap-2">
            <Activity className="h-4 w-4 text-slate-500" />
            <p className="text-lg font-bold text-slate-950">{uptimeLabel}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Memory
          </p>
          <div className="mt-3 flex items-center gap-2">
            <Cpu className="h-4 w-4 text-slate-500" />
            <p className="text-sm font-semibold text-slate-900">
              {health?.memory?.rss || "N/A"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <HardDrive className="h-4 w-4 text-slate-500" />
            Heap Used
          </div>
          <p className="mt-2 text-lg font-bold text-slate-950">
            {health?.memory?.heapUsed || "N/A"}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <HardDrive className="h-4 w-4 text-slate-500" />
            Heap Total
          </div>
          <p className="mt-2 text-lg font-bold text-slate-950">
            {health?.memory?.heapTotal || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}