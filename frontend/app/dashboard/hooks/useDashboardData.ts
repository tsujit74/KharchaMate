"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { getMyGroups } from "@/app/services/group.service";
import { getRecentExpenses } from "@/app/services/expense.service";
import { getPendingSettlements } from "@/app/services/settlement.service";

import {
  Group,
  RecentExpense,
  PendingSettlement,
} from "../types/dashboard.types";

export function useDashboardData(isAuthenticated: boolean, authLoading: boolean) {
  const router = useRouter();

  const [groups, setGroups] = useState<Group[]>([]);
  const [recentExpenses, setRecentExpenses] = useState<RecentExpense[]>([]);
  const [pendingSettlements, setPendingSettlements] = useState<
    PendingSettlement[]
  >([]);

  const [groupLoading, setGroupLoading] = useState(true);
  const [recentLoading, setRecentLoading] = useState(true);
  const [pendingLoading, setPendingLoading] = useState(true);

  const [error, setError] = useState("");

 useEffect(() => {
  if (authLoading) return; 

  if (!isAuthenticated) {
    router.replace("/auth");
    return;
  }

  const fetchAll = async () => {
    try {
      const groupsData = await getMyGroups();

      const sortedGroups = groupsData.sort(
        (a: Group, b: Group) =>
          new Date(b.updatedAt).getTime() -
          new Date(a.updatedAt).getTime()
      );

      setGroups(sortedGroups);
      setRecentExpenses(await getRecentExpenses());
      setPendingSettlements(await getPendingSettlements());
    } catch (err: any) {
      const message = err.message || "Failed to load dashboard data";
      setError(message);
      toast.error(message);

      if (err.message === "UNAUTHORIZED") {
        router.replace("/auth");
      }
    } finally {
      setGroupLoading(false);
      setRecentLoading(false);
      setPendingLoading(false);
    }
  };

  fetchAll();
}, [isAuthenticated, authLoading, router]);

  return {
    groups,
    setGroups,
    recentExpenses,
    pendingSettlements,
    groupLoading,
    recentLoading,
    pendingLoading,
    error,
  };
}