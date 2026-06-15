"use client";

import { Plus } from "lucide-react";
import ExpenseList from "./expenses/ExpenseList";
import { Expense } from "../types/expense.types";

type Props = {
  expenses?: Expense[];
  totalExpenses: number;
  isActive: boolean;
  onAdd: () => void;
  onLoadMore: () => void;
  page: number;
  totalPages: number;
  loadingMore: boolean;
  userId?: string;
  onRefresh: () => void;
};

export default function GroupExpenseSection({
  expenses = [],
  totalExpenses,
  isActive,
  onAdd,
  onLoadMore,
  page,
  totalPages,
  loadingMore,
  userId,
  onRefresh,
}: Props) {
  const safeExpenses = Array.isArray(expenses) ? expenses : [];

  return (
    <div className="max-w-6xl mx-auto">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold">Expenses ({totalExpenses})</h2>

        <p className="text-sm text-gray-500">
          Showing {safeExpenses.length} of {totalExpenses}
        </p>

        {isActive ? (
          <button
            onClick={onAdd}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Expense
          </button>
        ) : (
          <button disabled className="px-4 py-2 bg-gray-300 text-sm rounded-lg">
            Group Closed
          </button>
        )}
      </div>

      {/* LIST */}
      <ExpenseList
        expenses={safeExpenses}
        userId={userId}
        totalExpenses={totalExpenses}
        page={page}
        totalPages={totalPages}
        loadingMore={loadingMore}
        onRefresh={onRefresh}
        onLoadMore={onLoadMore}
      />
    </div>
  );
}
