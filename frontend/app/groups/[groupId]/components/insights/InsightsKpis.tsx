import type { GroupInsights } from "../../types/insights.types";
import { cardClass, formatAmount } from "../insights/shared";

type Props = {
  summary: GroupInsights["summary"];
  type: GroupInsights["group"]["type"];
  memberCount: number;
};

type Kpi = { label: string; value: string; note: string };

export default function InsightsKpis({ summary, type, memberCount }: Props) {
  const sharePercent = summary.totalSpent
    ? Math.round((summary.yourShare / summary.totalSpent) * 100)
    : 0;

  const shared: Kpi[] = [
    {
      label: "Total Spent",
      value: formatAmount(summary.totalSpent),
      note:
        type === "ONGOING"
          ? `${summary.expenseCount} expenses in total`
          : `${memberCount} members`,
    },
    {
      label: "Your Share",
      value: formatAmount(summary.yourShare),
      note: `${sharePercent}% of total`,
    },
  ];

  const byType: Kpi[] =
    type === "ONGOING"
      ? [
          {
            label: "This Month",
            value: formatAmount(summary.thisMonth ?? 0),
            note: "spent so far",
          },
          {
            label: "Avg / Month",
            value:
              summary.avgPerMonth != null
                ? formatAmount(summary.avgPerMonth)
                : "—",
            note:
              summary.avgPerMonth != null
                ? "completed months only"
                : "available after one full month",
          },
        ]
      : [
          {
            label: "Avg Expense",
            value: formatAmount(summary.averageExpense),
            note: "per expense",
          },
          {
            label: "Expenses",
            value: String(summary.expenseCount),
            note: "added so far",
          },
        ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {[...shared, ...byType].map((kpi) => (
        <div key={kpi.label} className={cardClass}>
          <p className="text-sm text-slate-500">{kpi.label}</p>
          <p className="mt-2 break-words text-xl font-semibold text-slate-900 sm:text-2xl">
            {kpi.value}
          </p>
          <p className="mt-1 text-xs text-slate-400">{kpi.note}</p>
        </div>
      ))}
    </div>
  );
}