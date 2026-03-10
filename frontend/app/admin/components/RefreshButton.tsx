"use client";

import { RotateCw } from "lucide-react";

type Props = {
  onRefresh: () => void;
  loading?: boolean;
};

export default function RefreshButton({ onRefresh, loading }: Props) {
  return (
    <button
      onClick={onRefresh}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 text-sm bg-black text-white rounded hover:opacity-90 disabled:opacity-50"
    >
      <RotateCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
      Refresh
    </button>
  );
}