"use client";

import { useState, useEffect, useCallback } from "react";
import { getMonthlyExpenses } from "@/app/services/expense.service";
import {
  Expense,
  FilterType,
  CategoryType,
  ExpenseParams,
} from "../types/insight";

export function useExpenseList(
  filter: FilterType,
  customRange: { start: string; end: string },
  category: CategoryType
) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // ✅ build params
  const buildParams = useCallback(
    (pageNum: number): ExpenseParams => {
      const params: ExpenseParams =
        filter === "custom"
          ? { start: customRange.start, end: customRange.end }
          : { filter };

      if (category && category !== "ALL") {
        params.category = category;
      }

      params.page = pageNum;
      params.limit = 10;

      return params;
    },
    [filter, customRange, category]
  );

  // ✅ reset + fetch when filters change
  const fetchInitial = useCallback(async () => {
    try {
      setLoading(true);
      setPage(1);

      const res = await getMonthlyExpenses(buildParams(1));

      setExpenses(res.expenses || []);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      setExpenses([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [buildParams]);

  // ✅ load more (fixed stale page issue)
  const loadMore = useCallback(async () => {
    try {
      setLoadingMore(true);

      const nextPage = page + 1;
      const res = await getMonthlyExpenses(buildParams(nextPage));

      setExpenses((prev) => [...prev, ...(res.expenses || [])]);
      setPage(nextPage);
    } catch {
      // silent fail (optional toast if needed)
    } finally {
      setLoadingMore(false);
    }
  }, [buildParams, page]);

  // ✅ IMPORTANT: reset on filter change
  useEffect(() => {
    setExpenses([]);
    setPage(1);
    setTotalPages(1);
    fetchInitial();
  }, [filter, customRange.start, customRange.end, category]);

  return {
    expenses,
    loading,
    loadingMore,
    page,
    totalPages,
    loadMore,
    hasMore: page < totalPages,
  };
}