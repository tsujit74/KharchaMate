"use client";

import React from "react";
import { ChartType } from "../types/insight";

type Props = {
  value: ChartType;
  onChange: (type: ChartType) => void;
};

export default function ChartToggle({ value, onChange }: Props) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => onChange("pie")}
        className={`px-3 py-1 text-xs sm:text-sm border rounded transition ${
          value === "pie"
            ? "bg-black text-white border-black"
            : "bg-white text-gray-700 hover:bg-gray-100 border-gray-300"
        }`}
      >
        Pie
      </button>

      <button
        onClick={() => onChange("bar")}
        className={`px-3 py-1 text-xs sm:text-sm border rounded transition ${
          value === "bar"
            ? "bg-black text-white border-black"
            : "bg-white text-gray-700 hover:bg-gray-100 border-gray-300"
        }`}
      >
        Bar
      </button>
    </div>
  );
}