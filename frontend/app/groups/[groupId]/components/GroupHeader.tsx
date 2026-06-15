"use client";

import { Info } from "lucide-react";

export default function GroupHeader({
  title,
  subtitle,
  isActive,
  onInfoClick,
}: {
  title: string;
  subtitle: string;
  isActive: boolean;
  onInfoClick: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>

      <button
        onClick={onInfoClick}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition
        ${
          isActive
            ? "bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100"
            : "bg-red-50 border-red-300 text-red-700 hover:bg-red-100"
        }`}
      >
        <Info className="w-4 h-4" />
        Group Info
      </button>
    </div>
  );
}