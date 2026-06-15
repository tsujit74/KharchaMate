"use client";

import { useCallback, useEffect, useState } from "react";
import { getGroupById } from "@/app/services/group.service";
import { getGroupSettlement } from "@/app/services/settlement.service";

type Props = {
  groupId: string;
};

export function useGroupDetails(groupId: string) {
  const [group, setGroup] = useState<any>(null);
  const [settlement, setSettlement] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
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

  useEffect(() => {
    if (groupId) load();
  }, [groupId, load]);

  return {
    group,
    settlement,
    loading,
    error,
    refresh: load,
  };
}