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
    <div className="mb-4 rounded-xl border bg-white p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold">Expenses</h2>

        <select
          value={showCustom ? "CUSTOM" : period}
          onChange={(e) => handlePeriodChange(e.target.value as Period)}
          className="rounded-lg border bg-white px-3 py-2 text-sm outline-none"
        >
          <option value="ALL_TIME">All Time</option>
          <option value="THIS_WEEK">This Week</option>
          <option value="THIS_MONTH">This Month</option>
          <option value="LAST_MONTH">Last Month</option>
          <option value="LAST_3_MONTHS">Last 3 Months</option>
          <option value="THIS_YEAR">This Year</option>
          <option value="CUSTOM">Custom Range</option>
        </select>
      </div>

      {showCustom && (
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
          <div>
            <label className="mb-1 block text-sm font-medium">Start date</label>

            <input
              type="date"
              value={customStart}
              onChange={(e) => {
                setCustomError("");
                onCustomStartChange(e.target.value);
              }}
              className="rounded-lg border px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">End date</label>

            <input
              type="date"
              value={customEnd}
              onChange={(e) => {
                setCustomError("");
                onCustomEndChange(e.target.value);
              }}
              className="rounded-lg border px-3 py-2 text-sm"
            />
          </div>

          <button
            type="button"
            onClick={handleApplyCustom}
            className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
          >
            Apply
          </button>
        </div>
      )}

      {customError && (
        <p className="mt-2 text-sm text-red-500">{customError}</p>
      )}
    </div>
  );
}
