"use client";

import { useCallback, useEffect, useState } from "react";
import { getGroupExpenses } from "@/app/services/group.service";

type Props = {
  groupId: string;
  limit?: number;
};

export function useGroupExpenses(groupId: string, limit = 10) {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const load = useCallback(
    async (pageNum = 1) => {
      try {
        if (pageNum === 1) setLoading(true);

        const data = await getGroupExpenses(groupId, pageNum, limit);

        if (pageNum === 1) {
          setExpenses(data.expenses || []);
        } else {
          setExpenses((prev) => [...prev, ...(data.expenses || [])]);
        }

        setPage(data.page);
        setTotalExpenses(data.total);
        setTotalPages(data.totalPages);
      } catch (err) {
        console.error("Failed to load expenses", err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [groupId, limit]
  );

  useEffect(() => {
    if (groupId) load(1);
  }, [groupId, load]);

  const loadMore = async () => {
    if (page >= totalPages) return;

    setLoadingMore(true);
    await load(page + 1);
  };

  const refresh = async () => {
    await load(1);
  };

  return {
    expenses,
    page,
    totalExpenses,
    totalPages,
    loading,
    loadingMore,
    loadMore,
    refresh,
  };
}