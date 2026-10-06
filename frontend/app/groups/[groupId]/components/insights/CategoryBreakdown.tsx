import type { GroupInsights } from "../../types/insights.types";
import {
  cardClass,
  cardTitleClass,
  categoryName,
  formatAmount,
  formatPercent,
} from "../insights/shared";

export default function CategoryBreakdown({
  categories,
}: {
  categories: GroupInsights["categories"];
}) {
  return (
    <div className={cardClass}>
      <h2 className={cardTitleClass}>Category breakdown</h2>

      <div className="mt-4 space-y-4">
        {categories.map((item) => (
          <div key={item.category}>
            <div className="flex flex-wrap items-center justify-between gap-x-3 text-sm">
              <span className="font-medium text-slate-700">
                {categoryName(item.category)}
              </span>
              <span className="text-slate-500">
                {formatAmount(item.amount)}
                <span className="ml-2 text-slate-400">
                  {formatPercent(item.percentage)}
                </span>
              </span>
            </div>

            <div className="mt-1.5 h-2 rounded-full bg-slate-100">
              <div
                className="h-2 rounded-full bg-slate-700"
                style={{ width: `${Math.max(item.percentage, 2)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}