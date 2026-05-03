// src/app/profile/components/ExpensesList.tsx
"use client";

import { useEffect, useState } from "react";
import { getMyExpenses } from "@/app/services/expense.service";
import { formatDateTime } from "@/app/utils/formatDateTime";

type Group = { _id: string; name: string };
type UserRef = { _id: string; name: string };

type Expense = {
  _id: string;
  description: string;
  amount: number;
  group: Group;
  paidBy: UserRef;
  createdAt: string;
};

type Props = {
  userId: string;
  mode?: "all" | "paid";
};

const ITEMS_PER_PAGE = 10;

export default function ExpensesList({ userId, mode = "all" }: Props) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState("");

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await getMyExpenses({
          page: currentPage,
          limit: ITEMS_PER_PAGE,
          month: selectedMonth,
        });
        setExpenses(res.data || []);
        setTotalPages(Math.max(1, res.totalPages || 1));
      } catch (err) {
        console.error("Failed to fetch expenses", err);
        setExpenses([]);
        setTotalPages(1);
      }
    };

    fetchExpenses();
  }, [currentPage, selectedMonth]);

  const filteredExpenses =
    mode === "paid"
      ? expenses.filter((e) => e.paidBy._id === userId)
      : expenses;

  return (
    <>
      {/* Month Filter */}
      <div className="mb-4">
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => {
            setSelectedMonth(e.target.value);
            setCurrentPage(1);
          }}
          className="border rounded-lg px-3 py-2 text-sm"
        />
      </div>

      {/* List */}
      <div className="space-y-3">
        {filteredExpenses.length === 0 ? (
          <p className="text-gray-500 text-sm">No expenses found.</p>
        ) : (
          filteredExpenses.map((item) => {
            const dateLabel = item.createdAt
              ? formatDateTime(item.createdAt).dateLabel
              : "";
            const isYou = item.paidBy._id === userId;

            return (
              <div
                key={item._id}
                className="rounded-2xl border p-4 flex justify-between items-center bg-white hover:shadow-sm transition"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {item.description || `${item.group?.name || "Group"} expense`}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {item.group?.name || "Unknown group"} •{" "}
                    {isYou ? "Paid by you" : `Paid by ${item.paidBy.name}`}
                  </p>
                  {dateLabel && (
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {dateLabel}
                    </p>
                  )}
                </div>
                <p
                  className={`text-sm font-semibold tabular-nums ${
                    isYou ? "text-green-600" : "text-gray-900"
                  }`}
                >
                  ₹{item.amount.toFixed(2)}
                </p>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-40"
          >
            Prev
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((p) => Math.min(totalPages, p + 1))
            }
            className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}