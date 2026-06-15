"use client";

import { useCallback, useEffect, useState } from "react";
import { getGroupById } from "@/app/services/group.service";
import { getGroupSettlement } from "@/app/services/settlement.service";

export function useGroupDetails(groupId: string) {
  const [group, setGroup] = useState<any>(null);
  const [settlement, setSettlement] = useState<any>(null);

  // only for first page load
  const [loading, setLoading] = useState(true);

  // for refresh operations
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const initialLoad = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [settlementData, groupData] = await Promise.all([
        getGroupSettlement(groupId),
        getGroupById(groupId),
      ]);

      setSettlement(settlementData);
      setGroup(groupData);
    } catch (err: any) {
      if (err?.message === "FORBIDDEN") {
        setError("You are not a member of this group.");
      } else {
        setError("Failed to load group details.");
      }
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  const refresh = useCallback(async () => {
    try {
      setRefreshing(true);

      const [settlementData, groupData] = await Promise.all([
        getGroupSettlement(groupId),
        getGroupById(groupId),
      ]);

      setSettlement(settlementData);
      setGroup(groupData);
    } catch (err) {
      console.error("Refresh failed", err);
    } finally {
      setRefreshing(false);
    }
  }, [groupId]);

  useEffect(() => {
    if (groupId) {
      initialLoad();
    }
  }, [groupId, initialLoad]);

  return {
    group,
    settlement,
    loading,
    refreshing,
    error,
    refresh,
  };
}