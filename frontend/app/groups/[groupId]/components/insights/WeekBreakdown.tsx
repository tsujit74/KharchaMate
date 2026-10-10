import { useMemo } from "react";
import type { GroupInsights } from "../../types/insights.types";
import {
  cardClass,
  cardTitleClass,
  compactAmount,
  formatAmount,
} from "../insights/shared";

type Props = {
  data: GroupInsights["byWeekday"];
};

export default function WeekdayBreakdown({ data }: Props) {
  const { days, max, total } = useMemo(() => {
    const days = data.map((day, index) => ({
      key: `${day.label}-${index}`,
      label: day.label?.trim() || "Unknown",
      amount: Number.isFinite(day.amount) ? Math.max(0, day.amount) : 0,
    }));

    const max = Math.max(0, ...days.map((day) => day.amount));
    const total = days.reduce((sum, day) => sum + day.amount, 0);

    return { days, max, total };
  }, [data]);

  if (days.length === 0) {
    return (
      <section className={cardClass}>
        <h2 className={cardTitleClass}>Spending by weekday</h2>
        <p className="mt-3 text-sm text-slate-500">
          Weekday spending data is not available yet.
        </p>
      </section>
    );
  }

  const peakDays = days.filter((day) => max > 0 && day.amount === max);

  return (
    <section className={cardClass} aria-label="Group spending by weekday">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className={cardTitleClass}>Spending by weekday</h2>
          <p className="mt-1 text-xs text-slate-500">
            Compare expenses across the week.
          </p>
        </div>

        <div className="shrink-0 rounded-lg bg-indigo-50 px-2.5 py-1.5 text-right">
          <p className="text-[10px] font-medium text-indigo-600">Total shown</p>
          <p className="text-sm font-semibold tabular-nums text-indigo-900">
            {formatAmount(total)}
          </p>
        </div>
      </div>

      {max === 0 ? (
        <div className="mt-4 rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-5 text-center">
          <p className="text-sm font-medium text-slate-700">
            No spending recorded
          </p>
          <p className="mt-1 text-xs text-slate-500">
            The weekday bars will appear when expenses are available.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-5 grid grid-cols-7 gap-2">
            {days.map((day) => {
              const isPeak = day.amount === max && max > 0;
              const height =
                day.amount > 0 ? Math.max((day.amount / max) * 100, 4) : 0;

              return (
                <div
                  key={day.key}
                  className="flex min-w-0 flex-col items-center gap-1.5"
                  title={`${day.label}: ${formatAmount(day.amount)}`}
                >
                  <span
                    className={`max-w-full truncate text-center text-[10px] font-medium tabular-nums ${
                      isPeak ? "text-teal-700" : "text-slate-500"
                    }`}
                  >
                    {day.amount > 0 ? compactAmount(day.amount) : "₹0"}
                  </span>

                  <div className="relative flex h-24 w-full items-end overflow-hidden rounded-md bg-slate-100 sm:h-28">
                    <div
                      className={`w-full rounded-t-md transition-[height] duration-300 ${
                        isPeak
                          ? "bg-teal-600"
                          : day.amount > 0
                            ? "bg-indigo-400 hover:bg-indigo-500"
                            : "bg-transparent"
                      }`}
                      style={{ height: `${height}%` }}
                    />
                  </div>

                  <span
                    className={`max-w-full truncate text-xs ${
                      isPeak ? "font-semibold text-teal-700" : "text-slate-500"
                    }`}
                  >
                    {day.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <span className="size-2 rounded-sm bg-indigo-400" />
                Spending
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="size-2 rounded-sm bg-teal-600" />
                Highest
              </span>
            </div>

            <p className="text-xs text-slate-500">
              {peakDays.length === 1
                ? `Peak: ${peakDays[0].label}`
                : `Peak: ${peakDays.map((day) => day.label).join(", ")}`}
            </p>
          </div>

          <p className="mt-2 text-[11px] text-slate-400">
            Tap a bar to see the full amount.
          </p>
        </>
      )}
    </section>
  );
}
