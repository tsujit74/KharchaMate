    import type { GroupInsights } from "../../types/insights.types";
import { cardClass, cardTitleClass, formatAmount } from "../insights/shared";

type Props = {
  budget: GroupInsights["budget"];
  isOngoing: boolean;
};

export default function BudgetCard({ budget, isOngoing }: Props) {
  const title = isOngoing ? "Budget (all-time)" : "Budget";

  if (!budget) {
    return (
      <div className={cardClass}>
        <h2 className={cardTitleClass}>{title}</h2>
        <p className="mt-3 text-sm text-slate-500">
          No budget has been set for this group.
        </p>
      </div>
    );
  }

  const percent = Math.round((budget.spent / budget.amount) * 100);
  const over = budget.remaining < 0;

  const barColor = over
    ? "bg-red-400"
    : percent >= 90
      ? "bg-amber-400"
      : "bg-slate-700";

  return (
    <div className={cardClass}>
      <h2 className={cardTitleClass}>{title}</h2>

      <p className="mt-3 text-sm text-slate-600">
        {formatAmount(budget.spent)} of {formatAmount(budget.amount)} used
      </p>

      <div className="mt-2 h-2 rounded-full bg-slate-100">
        <div
          className={`h-2 rounded-full ${barColor}`}
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>

      <p className="mt-2 text-sm text-slate-500">
        {over
          ? `Over by ${formatAmount(-budget.remaining)}`
          : `${formatAmount(budget.remaining)} remaining (${percent}% used)`}
      </p>
    </div>
  );
}