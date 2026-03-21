"use client";

import { useEffect, useState } from "react";
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
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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

  const fetchData = async (pageNumber = 1, append = false) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setInitialLoading(true);
      }

      const params: any =
        filter === "custom"
          ? { start: customRange.start, end: customRange.end }
          : { filter };

      if (category && category !== "ALL") {
        params.category = category;
      }

      params.page = pageNumber;
      params.limit = 5;

      const res = await getMonthlyExpenses(params);

      if (append) {
        setExpenses((prev) => [...prev, ...res.expenses]);
      } else {
        setExpenses(res.expenses);
      }

      setPage(res.page);
      setTotalPages(res.totalPages);
    } catch {
    } finally {
      setInitialLoading(false);
      setLoadingMore(false);
    }
  };

  //  Reset when filter changes
  useEffect(() => {
    setExpenses([]);
    setPage(1);
    fetchData(1);
  }, [filter, customRange, category]);

  const loadMore = () => {
    if (page < totalPages) {
      fetchData(page + 1, true);
    }
  };

  // First Load
  if (initialLoading) {
    return (
      <div className="bg-white border p-5 shadow-sm space-y-3 animate-pulse">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-200 rounded" />
        ))}
      </div>
    );
  }

  // Empty
  if (!expenses.length) {
    return (
      <div className="bg-white border p-8 shadow-sm text-center">
        <p className="text-gray-500 text-sm">
          No expenses found for this period.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border p-5 shadow-sm relative">
      <h2 className="font-semibold text-lg mb-4">Monthly Expenses</h2>

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
                <span className="px-2 py-0.5 bg-gray-100 rounded">
                  {e.category}
                </span>
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

      {page < totalPages && (
        <div className="text-center mt-4">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="px-4 py-2 text-sm border rounded hover:bg-gray-100 transition"
          >
            {loadingMore ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}