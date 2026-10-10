import type { GroupInsights } from "../../types/insights.types";
import {
  cardClass,
  cardTitleClass,
  categoryName,
  formatAmount,
  formatPercent,
} from "../insights/shared";

type Props = {
  categories: GroupInsights["categories"];
};

function safeNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function clampPercent(value: number): number {
  return Math.min(100, Math.max(0, safeNumber(value)));
}

export default function CategoryBreakdown({ categories }: Props) {
  const items = categories
    .map((item) => ({
      ...item,
      amount: safeNumber(item.amount),
      percentage: safeNumber(item.percentage),
    }))
    .sort((a, b) => b.amount - a.amount);

  const hasSpending = items.some((item) => item.amount > 0);

  return (
    <section className={cardClass} aria-label="Expense category breakdown">
      <div className="flex items-center justify-between gap-3">
        <h2 className={cardTitleClass}>Category breakdown</h2>
        <span className="shrink-0 text-xs text-slate-500">
          {items.length} {items.length === 1 ? "category" : "categories"}
        </span>
      </div>

      {!hasSpending ? (
        <div className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-5 text-center">
          <p className="text-sm font-medium text-slate-700">
            No category spending yet
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Expense totals will appear here when available.
          </p>
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          {items.map((item) => {
            const percentage = clampPercent(item.percentage);
            const amountWidth = item.amount > 0 ? Math.max(percentage, 2) : 0;

            return (
              <div key={item.category}>
                <div className="flex items-center justify-between gap-3">
                  <span className="min-w-0 truncate text-sm font-medium text-slate-700">
                    {categoryName(item.category)}
                  </span>

                  <div className="flex shrink-0 items-center gap-2">
                    <span className="text-sm font-semibold tabular-nums text-slate-900">
                      {formatAmount(item.amount)}
                    </span>
                    <span className="min-w-[3.25rem] rounded-md bg-indigo-50 px-1.5 py-0.5 text-center text-xs font-medium tabular-nums text-indigo-700">
                      {formatPercent(percentage)}
                    </span>
                  </div>
                </div>

                <div
                  className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100"
                  role="progressbar"
                  aria-label={`${categoryName(item.category)} spending share`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={percentage}
                >
                  <div
                    className="h-full rounded-full bg-indigo-600 transition-[width] duration-300"
                    style={{ width: `${amountWidth}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
