"use client";

import ExpenseCard from "./ExpenseCard";

type Props = {
  expenses?: any[];
  userId?: string;

  totalExpenses: number;
  page: number;
  totalPages: number;
  loadingMore: boolean;

  onRefresh: () => void;
  onLoadMore: () => void;
};

export default function ExpenseList({
  expenses = [],
  userId,
  totalExpenses,
  page,
  totalPages,
  loadingMore,
  onRefresh,
  onLoadMore,
}: Props) {
  const safeExpenses = Array.isArray(expenses) ? expenses : [];

  return (
    <div className="space-y-3">
      {/* Empty state */}
      {safeExpenses.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-white px-4 py-10 text-center">
          <p className="text-sm font-medium text-slate-900">
            No expenses found
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Try a different period, or add a new expense.
          </p>
        </div>
      ) : (
        <>
          {/* List */}
          {safeExpenses
            .slice()
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
            )
            .map((expense) => (
              <ExpenseCard
                key={expense._id}
                expense={expense}
                currentUserId={userId}
                onDeleted={onRefresh}
                onUpdated={onRefresh}
              />
            ))}

          {/* Load more */}
          {page < totalPages && (
            <div className="flex justify-center pt-4">
              <button
                onClick={onLoadMore}
                disabled={loadingMore}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 disabled:opacity-60"
              >
                {loadingMore ? "Loading..." : "Load more"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
