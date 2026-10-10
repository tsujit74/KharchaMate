
import type { GroupInsights } from "../../types/insights.types";
import {
  cardClass,
  cardTitleClass,
  formatAmount,
  formatPercent,
} from "../insights/shared";

type Props = {
  budget: GroupInsights["budget"];
  projection?: { amount: number; daysLeft: number } | null;
};

export default function BudgetCard({ budget, projection }: Props) {
  if (!budget) {
    return (
      <section className={`${cardClass} min-w-0`}>
        <h2 className={cardTitleClass}>Budget</h2>
        <div className="mt-3 rounded-lg bg-slate-50 p-3">
          <p className="text-sm font-medium text-slate-800">No budget set</p>
          <p className="mt-1 text-xs leading-4 text-slate-500">
            Set a group budget to track spending, remaining funds, and potential
            overspending.
          </p>
        </div>
      </section>
    );
  }

  const amount = Number(budget.amount);
  const spent = Number(budget.spent);
  const remaining = Number(budget.remaining);
  const rawPercent = Number(budget.percentageUsed);

  const validAmount = Number.isFinite(amount) && amount > 0;
  const validSpent = Number.isFinite(spent) && spent >= 0;
  const validRemaining = Number.isFinite(remaining);
  const validPercent = Number.isFinite(rawPercent);

  const usableBudget = validAmount && validSpent && validRemaining;

  const percent = validPercent
    ? Math.max(0, rawPercent)
    : validAmount && validSpent
      ? (spent / amount) * 100
      : 0;

  const progress = Math.min(percent, 100);
  const over = validRemaining
    ? remaining < 0
    : validAmount && validSpent && spent > amount;

  const title = budget.scope === "MONTH" ? "Monthly budget" : "Group budget";

  const status = !usableBudget
    ? {
        label: "Data unavailable",
        color: "text-slate-600",
        dot: "bg-slate-400",
        bar: "bg-slate-400",
      }
    : over || percent >= 100
      ? {
          label: "Budget exceeded",
          color: "text-red-700",
          dot: "bg-red-500",
          bar: "bg-red-500",
        }
      : percent >= 90
        ? {
            label: "Almost at limit",
            color: "text-orange-700",
            dot: "bg-orange-500",
            bar: "bg-orange-500",
          }
        : percent >= 75
          ? {
              label: "Approaching limit",
              color: "text-amber-700",
              dot: "bg-amber-500",
              bar: "bg-amber-500",
            }
          : {
              label: "On track",
              color: "text-emerald-700",
              dot: "bg-emerald-500",
              bar: "bg-emerald-500",
            };

  const validProjection =
    projection != null &&
    Number.isFinite(projection.amount) &&
    projection.amount >= 0 &&
    Number.isFinite(projection.daysLeft) &&
    projection.daysLeft >= 0;

  const projectedOver =
    validProjection && validAmount && projection.amount > amount;

  const projectedPercent =
    validProjection && validAmount ? (projection.amount / amount) * 100 : 0;

  return (
    <section className={`${cardClass} min-w-0`}>
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <h2 className={cardTitleClass}>{title}</h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Spending overview
          </p>
        </div>

        <span
          className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-[11px] font-medium ${status.color} bg-slate-50 ring-1 ring-inset ring-slate-200`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${status.dot}`}
            aria-hidden="true"
          />
          {status.label}
        </span>
      </div>

      {usableBudget ? (
        <>
          <div className="mt-3 flex items-end justify-between gap-2">
            <div className="min-w-0">
              <p className="text-xs text-slate-500">Amount spent</p>
              <p className="mt-0.5 break-words text-2xl font-semibold tracking-tight text-slate-950">
                {formatAmount(spent)}
              </p>
            </div>
            <p className="shrink-0 pb-0.5 text-sm font-medium tabular-nums text-slate-600">
              {formatPercent(percent)}
            </p>
          </div>

          <div className="mt-3">
            <div
              className="h-2 overflow-hidden rounded-full bg-slate-100"
              role="progressbar"
              aria-label="Budget used"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progress)}
              aria-valuetext={`${formatPercent(percent)} used`}
            >
              <div
                className={`h-full rounded-full transition-[width] duration-300 ${status.bar}`}
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="mt-1.5 flex justify-between gap-2 text-[11px] text-slate-500">
              <span>₹0 spent</span>
              <span className="text-right">
                Budget: {formatAmount(amount)}
              </span>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="min-w-0 rounded-lg border border-slate-200 bg-slate-50/70 p-2.5">
              <p className="text-xs font-medium text-slate-500">
                {over ? "Over budget by" : "Remaining"}
              </p>
              <p
                className={`mt-0.5 break-words text-lg font-semibold tracking-tight ${
                  over ? "text-red-700" : "text-slate-950"
                }`}
              >
                {formatAmount(Math.abs(remaining))}
              </p>
            </div>

            <div className="min-w-0 rounded-lg border border-slate-200 bg-slate-50/70 p-2.5">
              <p className="text-xs font-medium text-slate-500">
                Total budget
              </p>
              <p className="mt-0.5 break-words text-lg font-semibold tracking-tight text-slate-950">
                {formatAmount(amount)}
              </p>
            </div>
          </div>
        </>
      ) : (
        <p className="mt-3 rounded-lg bg-amber-50 p-2.5 text-xs leading-4 text-amber-800">
          Budget data is invalid or incomplete. Check the amount, spending, and
          remaining balance.
        </p>
      )}

      {validProjection && validAmount && (
        <div
          className={`mt-3 rounded-lg border p-2.5 ${
            projectedOver
              ? "border-amber-200 bg-amber-50/70"
              : "border-slate-200 bg-white"
          }`}
        >
          <div className="flex items-start gap-2">
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${
                projectedOver
                  ? "bg-amber-100 text-amber-700"
                  : "bg-slate-100 text-slate-600"
              }`}
              aria-hidden="true"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-4 w-4"
              >
                <path
                  d="M3 3v18h18M7 14l4-4 3 3 6-7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-slate-900">
                Projected month-end spending
              </p>
              <p className="mt-0.5 break-words text-lg font-semibold tracking-tight text-slate-950">
                {formatAmount(projection.amount)}
              </p>
              <p
                className={`mt-0.5 text-xs leading-4 ${
                  projectedOver ? "text-amber-800" : "text-slate-500"
                }`}
              >
                {projectedOver
                  ? `${formatAmount(projection.amount - amount)} above budget`
                  : `${formatPercent(projectedPercent)} of budget projected`}
                {" · "}
                {projection.daysLeft}{" "}
                {projection.daysLeft === 1 ? "day" : "days"} left
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
