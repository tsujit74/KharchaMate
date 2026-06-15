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
        <p className="text-gray-500 text-sm">
          No expenses yet.
        </p>
      ) : (
        <>
          {/* List */}
          {safeExpenses
            .slice()
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
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
                className="px-4 py-2 bg-black text-white rounded-lg text-sm disabled:opacity-60"
              >
                {loadingMore ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}