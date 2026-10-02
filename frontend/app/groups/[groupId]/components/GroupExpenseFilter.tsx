"use client";

import { useState } from "react";

export type Period =
  | "THIS_WEEK"
  | "THIS_MONTH"
  | "LAST_MONTH"
  | "LAST_3_MONTHS"
  | "THIS_YEAR"
  | "CUSTOM"
  | "ALL_TIME";

type Props = {
  period: Period;
  onPeriodChange: (period: Period) => void;
  customStart: string;
  customEnd: string;
  onCustomStartChange: (value: string) => void;
  onCustomEndChange: (value: string) => void;
};

const periods: { value: Period; label: string }[] = [
  { value: "ALL_TIME", label: "All Time" },
  { value: "THIS_WEEK", label: "This Week" },
  { value: "THIS_MONTH", label: "This Month" },
  { value: "LAST_MONTH", label: "Last Month" },
  { value: "LAST_3_MONTHS", label: "Last 3 Months" },
  { value: "THIS_YEAR", label: "This Year" },
  { value: "CUSTOM", label: "Custom Range" },
];

const dateInputClass =
  "rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300";

export default function GroupExpenseFilter({
  period,
  onPeriodChange,
  customStart,
  customEnd,
  onCustomStartChange,
  onCustomEndChange,
}: Props) {
  const [customError, setCustomError] = useState("");
  const [showCustom, setShowCustom] = useState(period === "CUSTOM");

  const selectedPeriod = showCustom ? "CUSTOM" : period;

  const handlePeriodChange = (value: Period) => {
    setCustomError("");

    if (value === "CUSTOM") {
      // Only open custom date fields.
      // Do NOT trigger the API yet.
      setShowCustom(true);
      return;
    }

    setShowCustom(false);
    onPeriodChange(value);
  };

  const handleApplyCustom = () => {
    if (!customStart || !customEnd) {
      setCustomError("Please select both dates.");
      return;
    }

    if (customStart > customEnd) {
      setCustomError("Start date cannot be after end date.");
      return;
    }

    setCustomError("");
    onPeriodChange("CUSTOM");
  };

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {periods.map((item) => (
          <button
            key={item.value}
            type="button"
            aria-pressed={selectedPeriod === item.value}
            onClick={() => handlePeriodChange(item.value)}
            className={`shrink-0 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 ${
              selectedPeriod === item.value
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {showCustom && (
        <div className="mt-3 rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div>
              <label
                htmlFor="expense-start-date"
                className="mb-1 block text-xs font-medium text-slate-500"
              >
                Start date
              </label>

              <input
                id="expense-start-date"
                type="date"
                value={customStart}
                onChange={(e) => {
                  setCustomError("");
                  onCustomStartChange(e.target.value);
                }}
                className={dateInputClass}
              />
            </div>

            <div>
              <label
                htmlFor="expense-end-date"
                className="mb-1 block text-xs font-medium text-slate-500"
              >
                End date
              </label>

              <input
                id="expense-end-date"
                type="date"
                value={customEnd}
                onChange={(e) => {
                  setCustomError("");
                  onCustomEndChange(e.target.value);
                }}
                className={dateInputClass}
              />
            </div>

            <button
              type="button"
              onClick={handleApplyCustom}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
            >
              Apply
            </button>
          </div>

          {customError && (
            <p role="alert" className="mt-3 text-sm text-rose-600">
              {customError}
            </p>
          )}
        </div>
      )}
    </div>
  );
}