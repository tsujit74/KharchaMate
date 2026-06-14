"use client";

import Link from "next/link";
import { RecentExpense } from "../types/dashboard.types";

type Props = {
  expenses: RecentExpense[];
  loading: boolean;
};

export default function RecentExpensesSection({
  expenses,
  loading,
}: Props) {
  return (
    <div className="bg-white/80 backdrop-blur-md border border-slate-200/70 rounded-2xl p-6 shadow-sm flex flex-col h-full">
      
      {/* Header */}
      <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-4">
        Recent Expenses
      </h3>

      {/* Loading */}
      {loading ? (
        <p className="text-sm text-slate-500">Loading…</p>
      ) : expenses.length === 0 ? (
        /* Empty */
        <div className="flex flex-1 items-center justify-center">
          <p className="text-sm text-slate-500">No recent expenses</p>
        </div>
      ) : (
        /* List */
        <div className="divide-y divide-slate-100">
          {expenses.map((e) => (
            <Link
              key={e._id}
              href={`/groups/${e.group._id}`}
              className="flex items-center justify-between gap-4 py-3.5 hover:bg-slate-50/80 rounded-xl px-3 -mx-3 transition duration-200"
            >
              {/* Left */}
              <div className="min-w-0">
                <p className="font-bold text-sm text-slate-800 truncate">
                  {e.description}
                </p>

                <p className="text-xs text-slate-400 truncate mt-0.5">
                  {e.group.name} •{" "}
                  <span className="font-medium text-slate-500">
                    {e.paidBy.name}
                  </span>
                </p>
              </div>

              {/* Right */}
              <div className="text-right shrink-0">
                <p className="font-bold text-sm text-slate-800 tracking-tight">
                  ₹{e.amount}
                </p>

                <p className="text-[10px] font-medium text-slate-400 mt-0.5">
                  {new Date(e.createdAt).toLocaleDateString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}