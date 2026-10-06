"use client";

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
  onLoadMore,
  page,
  totalPages,
  loadingMore,
  userId,
  onRefresh,
}: Props) {
  const safeExpenses = Array.isArray(expenses) ? expenses : [];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-slate-900 sm:text-base">
            Expenses
          </h2>

          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium tabular-nums text-slate-600">
            {totalExpenses}
          </span>
        </div>

        <p className="text-xs text-slate-500 sm:text-sm">
          Showing {safeExpenses.length} of {totalExpenses}
        </p>
      </div>

      <div className="mt-4">
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