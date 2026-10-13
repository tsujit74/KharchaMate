"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowLeftRight,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Lock,
  Receipt,
  RefreshCw,
} from "lucide-react";
import {
  createMonthlySnapshot,
  getMonthlySnapshots,
} from "@/app/services/group.service";
import type { MonthlySnapshot } from "@/app/services/group.service";

type Props = {
  groupId: string;
  canCreate: boolean;
};

const SHORT_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const getCurrentMonth = () => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
  }).formatToParts(new Date());

  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;

  return `${year}-${month}`;
};

const formatMonth = (month: string) => {
  const [year, value] = month.split("-").map(Number);

  if (!year || !value) return "Select month";

  return new Date(Date.UTC(year, value - 1, 1)).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
};

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 2,
});

const formatAmount = (amount: number) =>
  `₹${currencyFormatter.format(Number.isFinite(amount) ? amount : 0)}`;

const formatDate = (date: string) => {
  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "";

  return parsed.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  });
};

const formatCategory = (category: string) =>
  category
    ? category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()
    : "Other";

const getPercentage = (value: number) =>
  Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 0;

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    const messages: Record<string, string> = {
      NETWORK_ERROR: "Network error. Check your connection and try again.",
      UNAUTHORIZED: "Your session has expired. Please log in again.",
      FORBIDDEN: "You do not have permission to close this month.",
      INVALID_MONTH: "Select a valid month.",
      INVALID_GROUP: "The group could not be identified.",
    };

    return messages[error.message] || error.message;
  }

  return "Something went wrong. Please try again.";
};

type MonthPickerProps = {
  value: string;
  max: string;
  closedMonths: Set<string>;
  disabled: boolean;
  onChange: (month: string) => void;
};

function MonthPicker({
  value,
  max,
  closedMonths,
  disabled,
  onChange,
}: MonthPickerProps) {
  const [open, setOpen] = useState(false);
  const [year, setYear] = useState(() => Number(value.split("-")[0]) || 0);
  const containerRef = useRef<HTMLDivElement>(null);

  const maxYear = Number(max.split("-")[0]);

  useEffect(() => {
    if (!open) return;

    const handlePointer = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  useEffect(() => {
    if (disabled) setOpen(false);
  }, [disabled]);

  const toggle = () => {
    if (disabled) return;

    if (!open) {
      setYear(Number(value.split("-")[0]) || maxYear);
    }

    setOpen((current) => !current);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={toggle}
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-left text-sm font-medium text-slate-900 transition hover:border-slate-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className="flex min-w-0 items-center gap-2.5">
          <CalendarDays className="h-4 w-4 shrink-0 text-indigo-600" />
          <span className="truncate">{formatMonth(value)}</span>
        </span>
        <ChevronRight
          className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${
            open ? "rotate-90" : ""
          }`}
        />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Select month"
          className="absolute left-0 top-full z-20 mt-2 w-72 max-w-[calc(100vw-3rem)] rounded-2xl border border-slate-200 bg-white p-3 shadow-lg"
        >
          <div className="mb-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setYear((current) => current - 1)}
              aria-label="Previous year"
              className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-semibold text-slate-900">{year}</span>
            <button
              type="button"
              onClick={() => setYear((current) => current + 1)}
              disabled={year >= maxYear}
              aria-label="Next year"
              className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            {SHORT_MONTHS.map((label, index) => {
              const key = `${year}-${String(index + 1).padStart(2, "0")}`;
              const isFuture = key > max;
              const isClosed = closedMonths.has(key);
              const isSelected = key === value;

              return (
                <button
                  key={key}
                  type="button"
                  disabled={isFuture || isClosed}
                  aria-pressed={isSelected}
                  onClick={() => {
                    onChange(key);
                    setOpen(false);
                  }}
                  className={`relative flex items-center justify-center gap-1 rounded-xl px-2 py-2.5 text-sm font-medium transition ${
                    isSelected
                      ? "bg-indigo-600 text-white"
                      : isClosed
                        ? "cursor-not-allowed bg-slate-50 text-slate-400"
                        : isFuture
                          ? "cursor-not-allowed text-slate-300"
                          : "text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"
                  }`}
                >
                  {label}
                  {isClosed && <Lock className="h-3 w-3" />}
                </button>
              );
            })}
          </div>

          <p className="mt-3 flex items-center gap-1.5 px-1 text-xs text-slate-500">
            <Lock className="h-3 w-3" />
            Already closed months are locked
          </p>
        </div>
      )}
    </div>
  );
}

export default function MonthlySnapshotsSection({ groupId, canCreate }: Props) {
  const [snapshots, setSnapshots] = useState<MonthlySnapshot[]>([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [month, setMonth] = useState(getCurrentMonth);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadSnapshots = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getMonthlySnapshots(groupId);
      const items = Array.isArray(response.snapshots) ? response.snapshots : [];

      setSnapshots(items);

      setSelectedMonth((current) => {
        if (items.some((item) => item.month === current)) return current;
        return items[0]?.month || "";
      });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    void loadSnapshots();
  }, [loadSnapshots]);

  const closedMonths = useMemo(
    () => new Set(snapshots.map((snapshot) => snapshot.month)),
    [snapshots],
  );

  const selectedSnapshot =
    snapshots.find((snapshot) => snapshot.month === selectedMonth) || null;

  const categories = selectedSnapshot?.categories ?? [];
  const members = selectedSnapshot?.members ?? [];

  const handleCreate = async () => {
    if (!canCreate || creating || !month) return;

    const currentMonth = getCurrentMonth();

    if (month > currentMonth) {
      setError("Future months cannot be closed.");
      return;
    }

    if (closedMonths.has(month)) {
      setError("This month already has a saved snapshot.");
      return;
    }

    setCreating(true);
    setError("");
    setSuccess("");

    try {
      const response = await createMonthlySnapshot(groupId, month);

      setSnapshots((current) =>
        [
          response.snapshot,
          ...current.filter(
            (snapshot) => snapshot.month !== response.snapshot.month,
          ),
        ].sort((a, b) => b.month.localeCompare(a.month)),
      );

      setSelectedMonth(response.snapshot.month);
      setSuccess(`${formatMonth(month)} snapshot saved successfully.`);
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);

      if (message.toLowerCase().includes("already been closed")) {
        await loadSnapshots();
      }
    } finally {
      setCreating(false);
    }
  };

  return (
    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <CalendarDays className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-slate-900">
              Monthly Snapshots
            </h2>
            <p className="mt-0.5 text-sm text-slate-500">
              Saved reports that keep each month&apos;s figures as they were
              when it was closed.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => void loadSnapshots()}
          disabled={loading || creating}
          aria-label="Refresh snapshots"
          className="flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 p-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4 sm:py-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {canCreate && (
        <div className="mt-5 flex flex-col gap-3 rounded-xl bg-slate-50 p-4 sm:flex-row sm:items-end">
          <div className="flex-1 sm:max-w-xs">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Month to close
            </label>
            <MonthPicker
              value={month}
              max={getCurrentMonth()}
              closedMonths={closedMonths}
              disabled={creating}
              onChange={(next) => {
                setMonth(next);
                setError("");
                setSuccess("");
              }}
            />
          </div>

          <button
            type="button"
            onClick={() => void handleCreate()}
            disabled={creating || loading || !month}
            className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Lock className="h-4 w-4" />
            {creating ? "Saving snapshot..." : "Close month"}
          </button>
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="mt-4 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div
          role="status"
          className="mt-4 flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700"
        >
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {loading ? (
        <div role="status" className="mt-5 animate-pulse space-y-3">
          <div className="h-16 rounded-xl bg-slate-100" />
          <div className="h-16 rounded-xl bg-slate-100" />
        </div>
      ) : snapshots.length === 0 ? (
        <div className="mt-5 rounded-xl border border-dashed border-slate-300 px-6 py-10 text-center">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-500">
            <CalendarDays className="h-5 w-5" />
          </div>
          <p className="mt-3 font-medium text-slate-800">
            No monthly snapshots yet
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {canCreate
              ? "Select a month above to save its financial report."
              : "Saved monthly reports will appear here when available."}
          </p>
        </div>
      ) : (
        <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <div className="space-y-2 lg:max-h-[640px] lg:overflow-y-auto lg:pr-1">
            {snapshots.map((snapshot) => {
              const active = selectedMonth === snapshot.month;
              const closedAt = formatDate(snapshot.closedAt);

              return (
                <button
                  key={snapshot._id}
                  type="button"
                  onClick={() => {
                    setSelectedMonth(snapshot.month);
                    setError("");
                    setSuccess("");
                  }}
                  aria-pressed={active}
                  className={`flex w-full items-center justify-between gap-3 rounded-xl border p-3.5 text-left transition ${
                    active
                      ? "border-indigo-300 bg-indigo-50 ring-1 ring-indigo-200"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                        active
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <Lock className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-900">
                        {formatMonth(snapshot.month)}
                      </p>
                      {closedAt && (
                        <p className="mt-0.5 truncate text-xs text-slate-500">
                          Closed {closedAt}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-slate-900">
                    {formatAmount(snapshot.totalExpenses)}
                  </span>
                </button>
              );
            })}
          </div>

          {selectedSnapshot && (
            <div className="min-w-0 space-y-5 rounded-xl border border-slate-200 p-4 sm:p-5">
              <div className="rounded-xl bg-indigo-600 p-4 text-white sm:p-5">
                <p className="text-sm text-indigo-100">
                  {formatMonth(selectedSnapshot.month)}
                </p>
                <p className="mt-1 break-words text-3xl font-bold">
                  {formatAmount(selectedSnapshot.totalExpenses)}
                </p>
                <p className="text-sm text-indigo-100">Total expenses</p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-indigo-600">
                    <Receipt className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Transactions</p>
                    <p className="text-lg font-semibold text-slate-900">
                      {selectedSnapshot.transactionCount}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-indigo-600">
                    <ArrowLeftRight className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Settlements</p>
                    <p className="text-lg font-semibold text-slate-900">
                      {selectedSnapshot.settlementCount}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl bg-slate-50 p-3 sm:col-span-2">
                  <p className="text-xs text-slate-500">
                    Total completed settlements
                  </p>
                  <p className="mt-0.5 break-words text-lg font-semibold text-slate-900">
                    {formatAmount(selectedSnapshot.totalSettlements)}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900">Categories</h3>

                {categories.length === 0 ? (
                  <p className="mt-2 text-sm text-slate-500">
                    No category spending recorded.
                  </p>
                ) : (
                  <div className="mt-3 space-y-3.5">
                    {categories.map((category) => {
                      const percentage = getPercentage(category.percentage);

                      return (
                        <div key={category.category}>
                          <div className="flex items-center justify-between gap-3 text-sm">
                            <span className="truncate text-slate-700">
                              {formatCategory(category.category)}
                            </span>
                            <span className="shrink-0 font-medium text-slate-900">
                              {formatAmount(category.amount)}
                            </span>
                          </div>
                          <div className="mt-1.5 flex items-center gap-2">
                            <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                              <div
                                className="h-full rounded-full bg-indigo-500"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="w-11 shrink-0 text-right text-xs text-slate-500">
                              {percentage.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-semibold text-slate-900">
                  Member contributions
                </h3>

                {members.length === 0 ? (
                  <p className="mt-2 text-sm text-slate-500">
                    No member activity recorded.
                  </p>
                ) : (
                  <div className="mt-2 divide-y divide-slate-100">
                    {members.map((member) => (
                      <div
                        key={member.userId}
                        className="flex items-center justify-between gap-3 py-3"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-sm font-semibold text-indigo-600">
                            {(member.name || "?").charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-slate-800">
                              {member.name || "Unknown member"}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-500">
                              Share: {formatAmount(member.share)}
                            </p>
                          </div>
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="text-sm font-semibold text-slate-900">
                            {formatAmount(member.paid)}
                          </p>
                          <p className="text-xs text-slate-500">Paid</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}