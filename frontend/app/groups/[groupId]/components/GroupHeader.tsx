"use client";

import { Info, Plus } from "lucide-react";
import { ReactNode } from "react";

type Props = {
  title: string;
  subtitle: string;
  isActive: boolean;
  onInfoClick: () => void;
  onAdd: () => void;
  children?: ReactNode;
};

export default function GroupHeader({
  title,
  subtitle,
  isActive,
  onInfoClick,
  onAdd,
  children,
}: Props) {
  return (
    <header className="rounded-xl border border-slate-200 bg-white px-3 py-3 shadow-sm sm:px-4 sm:py-3.5">
      <div className="flex min-w-0 items-center justify-between gap-3">
        {/* Group information */}
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-center gap-2">
            <h1
              title={title}
              className="min-w-0 truncate text-base font-semibold tracking-tight text-slate-900 sm:text-lg"
            >
              {title}
            </h1>

            <span
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold sm:text-xs ${
                isActive
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isActive ? "bg-emerald-500" : "bg-red-500"
                }`}
              />
              {isActive ? "Active" : "Closed"}
            </span>
          </div>

          <p className="mt-0.5 hidden truncate text-xs text-slate-500 sm:block">
            {subtitle}
          </p>

          {!isActive && (
            <p className="mt-1 text-[11px] font-medium text-red-600">
              This group is closed.
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          {children}

          {isActive ? (
            <button
              type="button"
              onClick={onAdd}
              aria-label="Add expense"
              title="Add expense"
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-1 sm:h-9 sm:w-auto sm:gap-1.5 sm:px-3 sm:text-sm"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Expense</span>
            </button>
          ) : (
            <div
              aria-label="Group closed"
              title="Group closed"
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 sm:h-9 sm:w-auto sm:px-3 sm:text-sm"
            >
              <span className="sm:hidden">✕</span>
              <span className="hidden sm:inline">Group Closed</span>
            </div>
          )}

          <button
            type="button"
            onClick={onInfoClick}
            aria-label="Group info"
            title="Group info"
            className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 sm:h-9 sm:w-auto sm:gap-1.5 sm:px-3 sm:text-sm ${
              isActive
                ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 focus-visible:ring-emerald-300"
                : "border-red-200 bg-red-50 text-red-700 hover:bg-red-100 focus-visible:ring-red-300"
            }`}
          >
            <Info className="h-4 w-4" />
            <span className="hidden sm:inline">Group Info</span>
          </button>
        </div>
      </div>
    </header>
  );
}
