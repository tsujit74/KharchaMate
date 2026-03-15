"use client";

import { useEffect, useState } from "react";
import { getSystemHealth } from "@/app/services/admin.service";

type HealthData = {
  status: string;
  database: string;
  uptime: number;
  memory: {
    rss: string;
    heapUsed: string;
    heapTotal: string;
  };
};

export default function SystemHealthCard() {
  const [health, setHealth] = useState<HealthData | null>(null);

  const fetchHealth = async () => {
    try {
      const data = await getSystemHealth();
      setHealth(data);
    } catch (err) {
      console.error("Health fetch failed", err);
    }
  };

  useEffect(() => {
    fetchHealth();

    const interval = setInterval(fetchHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!health) {
    return <p className="text-gray-500">Loading system health...</p>;
  }

  const uptimeMinutes = Math.floor(health.uptime / 60);

  return (
    <div className="space-y-4">

      <h2 className="text-lg font-semibold">System Health</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        {/* Server Status */}
        <div className="border rounded-lg p-4">
          <p className="text-sm text-gray-500">Server</p>
          <span className="inline-block mt-1 px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded">
            {health.status}
          </span>
        </div>

        {/* Database Status */}
        <div className="border rounded-lg p-4">
          <p className="text-sm text-gray-500">Database</p>
          <span
            className={`inline-block mt-1 px-3 py-1 text-xs font-medium rounded ${
              health.database === "connected"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {health.database}
          </span>
        </div>

        {/* Uptime */}
        <div className="border rounded-lg p-4">
          <p className="text-sm text-gray-500">Uptime</p>
          <p className="font-medium">{uptimeMinutes} minutes</p>
        </div>

        {/* Memory */}
        <div className="border rounded-lg p-4">
          <p className="text-sm text-gray-500">Memory</p>
          <p className="font-medium">{health.memory.rss}</p>
        </div>

      </div>
    </div>
  );
}