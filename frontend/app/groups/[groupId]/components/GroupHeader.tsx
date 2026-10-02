"use client";

import { Info } from "lucide-react";
import { ReactNode } from "react";

type Props = {
  title: string;
  subtitle: string;
  isActive: boolean;
  onInfoClick: () => void;
  children?: ReactNode;
};

export default function GroupHeader({
  title,
  subtitle,
  isActive,
  onInfoClick,
  children,
}: Props) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="max-w-full truncate text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
            {title}
          </h1>

          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
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

        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {children}

        <button
          type="button"
          onClick={onInfoClick}
          className="inline-flex w-fit items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
        >
          <Info className="h-4 w-4" />
          Group Info
        </button>
      </div>
    </div>
  );
}