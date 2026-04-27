"use client";

import { Circle } from "lucide-react";

type Props = {
  search: string;
  setSearch: (value: string) => void;
};

export default function TicketSearch({ search, setSearch }: Props) {
  return (
    <div className="relative w-full max-w-sm">
      <svg
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="m21 21-4.3-4.3" />
        <Circle cx="11" cy="11" r="7" />
      </svg>
      
      <input
        type="text"
        placeholder="Search tickets..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
      />
    </div>
  );
}