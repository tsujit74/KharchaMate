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
    <div className="mx-auto w-full max-w-5xl">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-base font-semibold text-slate-900">Expenses</h2>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium tabular-nums text-slate-600">
              {totalExpenses}
            </span>
          </div>

          <p className="mt-1 text-sm text-slate-500">
            Showing {safeExpenses.length} of {totalExpenses}
          </p>
        </div>

        {isActive ? (
          <button
            onClick={onAdd}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            Add Expense
          </button>
        ) : (
          <button
            disabled
            className="inline-flex w-full cursor-not-allowed items-center justify-center rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-400 sm:w-auto"
          >
            Group Closed
          </button>
        )}
      </div>

      <div className="mt-6">
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
    </div>
  );
}
