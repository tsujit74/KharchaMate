"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/authContext";
import { getMyGroups } from "@/app/services/group.service";
import {
  getPendingSettlements,
  getMySettlementHistory,
} from "@/app/services/settlement.service";
import toast from "react-hot-toast";

type Group = { _id: string; name: string };

type Settlement = any;
type PendingSettlementRaw = any;

export function useProfileData() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  const [groups, setGroups] = useState<Group[]>([]);
  const [settlements, setSettlements] = useState<PendingSettlementRaw[]>([]);
  const [history, setHistory] = useState<Settlement[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    const fetchData = async () => {
      try {
        setLoadingData(true);

        const [grpData, settleData, historyData] = await Promise.all([
          getMyGroups(),
          getPendingSettlements(),
          getMySettlementHistory(),
        ]);

        setGroups(grpData || []);
        setSettlements(settleData || []);
        setHistory(historyData || []);
      } catch (err: any) {
        if (err.message === "UNAUTHORIZED") {
          toast.error("Session expired. Please login again.");
          router.replace("/login");
          return;
        }
        toast.error("Failed to load profile data.");
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [loading, isAuthenticated]);

  return {
    user,
    groups,
    settlements,
    history,
    loading,
    loadingData,
  };
}