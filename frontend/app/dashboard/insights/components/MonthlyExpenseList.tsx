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
}: {
  filter: "this-month" | "last-month" | "custom";
  customRange: { start: string; end: string };
}) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

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

  const fetchData = async () => {
    try {
      setLoading(true);

      const params =
        filter === "custom"
          ? { start: customRange.start, end: customRange.end }
          : { filter };

      const res = await getMonthlyExpenses(params);
      setExpenses(res.expenses);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filter, customRange]);

  // Loading Skeleton
  if (loading) {
    return (
      <div className="bg-white border p-5 shadow-sm space-y-3 animate-pulse">
        <div className="h-4 w-40 bg-gray-200 rounded" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-200 rounded" />
        ))}
      </div>
    );
  }

  //  Empty State
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
    <div className="bg-white border p-5 shadow-sm">
      <h2 className="font-semibold text-lg mb-4">Monthly Expenses</h2>

      <div className="divide-y">
        {expenses.map((e) => (
          <div
            key={e._id}
            className="py-3 flex justify-between items-start gap-3"
          >
            {/* LEFT */}
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

            {/* RIGHT */}
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
    </div>
  );
}
