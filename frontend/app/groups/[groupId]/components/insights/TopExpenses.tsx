import type { GroupInsights } from "../../types/insights.types";
import {
  cardClass,
  cardTitleClass,
  categoryName,
  formatAmount,
  shortDate,
} from "../insights/shared";

type Props = {
  expenses: GroupInsights["topExpenses"];
  totalSpent: number;
  expenseCount: number;
};

export default function TopExpenses({
  expenses,
  totalSpent,
  expenseCount,
}: Props) {
  const topTotal = expenses.reduce((sum, e) => sum + e.amount, 0);
  const topPercent = totalSpent ? Math.round((topTotal / totalSpent) * 100) : 0;

  return (
    <div className={cardClass}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className={cardTitleClass}>Top expenses</h2>

        {expenseCount > expenses.length && (
          <p className="text-sm text-slate-500">
            These make up {topPercent}% of the total
          </p>
        )}
      </div>

      <ul className="mt-2 divide-y divide-slate-100">
        {expenses.map((expense) => (
          <li
            key={expense.id}
            className="flex items-start justify-between gap-4 py-3"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-800">
                {expense.description}
              </p>
              <p className="mt-0.5 text-xs text-slate-400">
                {categoryName(expense.category)}, paid by {expense.paidByName},
                added {shortDate(expense.createdAt)}
              </p>
            </div>

            <p className="shrink-0 text-sm font-semibold text-slate-900">
              {formatAmount(expense.amount)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
