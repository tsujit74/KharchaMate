"use client";

import { useEffect, useState, useTransition } from "react";
import { getMonthlyExpenses } from "@/app/services/expense.service";

type Expense = {
  _id: string;
  description: string;
  amount: number;
  category: string;
  createdAt: string;
  group?: { name: string };
  paidBy: { name: string; email: string };
};

export default function MonthlyExpenseList({
  filter,
  customRange,
  category,
}: {
  filter: "this-month" | "last-month" | "custom";
  customRange: { start: string; end: string };
  category?: string;
}) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [isPending, startTransition] = useTransition();

  const formatDate = (date: string) =>
    new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(value);

  const buildParams = (pageNum: number) => {
    const params: any =
      filter === "custom"
        ? { start: customRange.start, end: customRange.end }
        : { filter };

    if (category && category !== "ALL") {
      params.category = category;
    }

    params.page = pageNum;
    params.limit = 10;

    return params;
  };

  // ✅ Smooth Fetch (no flicker)
  const fetchInitial = async () => {
    try {
      // show skeleton ONLY first time
      if (expenses.length === 0) {
        setLoading(true);
      }

      setPage(1);

      const res = await getMonthlyExpenses(buildParams(1));

      setExpenses(res.expenses);
      setTotalPages(res.totalPages);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  // ✅ Load More
  const loadMore = async () => {
    try {
      setLoadingMore(true);
      const nextPage = page + 1;

      const res = await getMonthlyExpenses(buildParams(nextPage));

      setExpenses((prev) => [...prev, ...res.expenses]);
      setPage(nextPage);
    } catch {
    } finally {
      setLoadingMore(false);
    }
  };

  // ✅ Smooth transition on filter/category change
  useEffect(() => {
    startTransition(() => {
      fetchInitial();
    });
  }, [filter, customRange, category]);

  // ✅ Skeleton only first load
  if (loading && expenses.length === 0) {
    return (
      <div className="bg-white border p-5 shadow-sm space-y-3 animate-pulse">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-200 rounded" />
        ))}
      </div>
    );
  }

  // ✅ Empty state
  if (!loading && expenses.length === 0) {
    return (
      <div className="bg-white border p-8 shadow-sm text-center">
        <p className="text-gray-500 text-sm">
          No expenses found for this period.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border p-5 shadow-sm">
      <h2 className="font-semibold text-lg mb-4">Monthly Expenses</h2>

      {/* ✅ Subtle loader instead of flicker */}
      {(loading || isPending) && expenses.length > 0 && (
        <p className="text-xs text-gray-400 mb-2">Updating...</p>
      )}

      <div className="divide-y">
        {expenses.map((e) => (
          <div
            key={e._id}
            className="py-3 flex justify-between items-start gap-3"
          >
            <div className="space-y-1">
              <p className="text-sm font-medium">{e.description}</p>

              <div className="text-xs text-gray-500 flex flex-wrap gap-2">
                <span>{e.group?.name || "No Group"}</span>
                <span>•</span>
                <span>{e.category}</span>
                <span>•</span>
                <span>Paid by {e.paidBy.name}</span>
              </div>
            </div>

            <div className="text-right">
              <p className="font-semibold text-sm">
                {formatCurrency(e.amount)}
              </p>
              <p className="text-[11px] text-gray-400">
                {formatDate(e.createdAt)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      {page < totalPages && (
        <div className="mt-4 text-center">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="px-4 py-2 text-sm border rounded hover:bg-gray-100"
          >
            {loadingMore ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}