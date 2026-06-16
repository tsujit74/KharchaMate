"use client";

import React from "react";
import { FilterType, CustomRange } from "../types/insight";

export default function FilterBar({
  filter,
  setFilter,
  customRange,
  setCustomRange,
  applyCustomFilter,
}: {
  filter: FilterType;
  setFilter: (f: FilterType) => void;
  customRange: CustomRange;
  setCustomRange: (r: CustomRange) => void;
  applyCustomFilter: () => void;
}) {
  const filterLabels: Record<FilterType, string> = {
    "this-month": "This Month",
    "last-month": "Last Month",
    custom: "Custom",
  };

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {(["this-month", "last-month", "custom"] as FilterType[]).map((f) => (
        <button
          key={f}
          onClick={() => setFilter(f)}
          className={`px-3 py-2 text-xs sm:text-sm border rounded transition whitespace-nowrap ${
            filter === f
              ? "bg-black text-white border-black"
              : "bg-white text-gray-700 hover:bg-gray-100 border-gray-300"
          }`}
        >
          {filterLabels[f]}
        </button>
      ))}

      {filter === "custom" && (
        <div className="flex flex-wrap gap-2 items-center ml-2">
          <input
            type="date"
            value={customRange.start}
            onChange={(e) =>
              setCustomRange({ ...customRange, start: e.target.value })
            }
            className="border px-2 py-1 text-xs sm:text-sm rounded border-gray-300 focus:outline-none focus:border-black"
          />
          <input
            type="date"
            value={customRange.end}
            onChange={(e) =>
              setCustomRange({ ...customRange, end: e.target.value })
            }
            className="border px-2 py-1 text-xs sm:text-sm rounded border-gray-300 focus:outline-none focus:border-black"
          />
          <button
            onClick={applyCustomFilter}
            className="px-3 py-2 bg-black text-white text-xs sm:text-sm rounded transition hover:bg-gray-800"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
}