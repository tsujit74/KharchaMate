"use client";

import { useEffect, useState } from "react";
import { getGroupInsights } from "@/app/services/group.service";
import type { GroupInsights } from "../types/insights.types";

type State = {
  groupId: string;
  data: GroupInsights | null;
  error: string;
};

export function useGroupInsights(groupId: string) {
  const [state, setState] = useState<State | null>(null);

  useEffect(() => {
    let cancelled = false;

    getGroupInsights(groupId)
      .then((res) => {
        if (!cancelled) setState({ groupId, data: res, error: "" });
      })
      .catch((err) => {
        if (cancelled) return;
        setState({
          groupId,
          data: null,
          error:
            err?.message === "NETWORK_ERROR"
              ? "Network error. Check your connection and try again."
              : "Failed to load insights.",
        });
      });

    return () => {
      cancelled = true;
    };
  }, [groupId]);

  const current = state && state.groupId === groupId ? state : null;

  return {
    data: current?.data ?? null,
    loading: current === null,
    error: current?.error ?? "",
  };
}