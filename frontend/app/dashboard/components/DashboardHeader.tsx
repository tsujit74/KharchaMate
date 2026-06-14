"use client";

import Link from "next/link";
import { TrendingUp, Plus } from "lucide-react";

type Props = {
  firstName: string;
};

export default function DashboardHeader({ firstName }: Props) {
  return (
    <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
      {/* Left Side */}
      <div className="min-w-0 flex-1">
        <p className="text-[10px] sm:text-xs font-semibold text-blue-600 uppercase tracking-wider">
          Dashboard
        </p>

        <h2 className="mt-1 text-lg sm:text-3xl font-black text-slate-950 tracking-tight leading-tight truncate">
          Hey, {firstName}.
        </h2>

        <p className="hidden sm:block mt-1 text-sm sm:text-base text-slate-500 leading-relaxed">
          Your expense ecosystem at a glance.
        </p>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-2 shrink-0 ml-auto">
        <Link
          href="/dashboard/insights"
          className="inline-flex items-center justify-center h-10 w-10 sm:w-auto sm:px-4 rounded-xl bg-white border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition"
        >
          <TrendingUp className="w-4 h-4 text-blue-600" />
          <span className="hidden sm:inline ml-1">Insights</span>
        </Link>

        <Link
          href="/groups/create"
          className="inline-flex items-center justify-center h-10 w-10 sm:w-auto sm:px-4 rounded-xl bg-slate-950 text-white text-sm font-medium hover:bg-slate-800 transition shadow"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline ml-1">New Group</span>
        </Link>
      </div>
    </div>
  );
}