"use client";

import { useEffect, useState } from "react";
import { getGroupInsights } from "@/app/services/group.service";
import type { GroupInsights } from "../types/insights.types";

export function useGroupInsights(groupId: string) {
  const [data, setData] = useState<GroupInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError("");

    getGroupInsights(groupId)
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(
          err?.message === "NETWORK_ERROR"
            ? "Network error. Check your connection and try again."
            : "Failed to load insights.",
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [groupId]);

  return { data, loading, error };
}