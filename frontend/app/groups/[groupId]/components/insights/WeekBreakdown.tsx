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
  const max = Math.max(...data.map((d) => d.amount), 0);

  if (max === 0) return null;

  return (
    <div className={cardClass}>
      <h2 className={cardTitleClass}>Spending by weekday</h2>

      <div className="mt-4 grid grid-cols-7 gap-2">
        {data.map((d) => {
          const isPeak = d.amount === max;
          const height = d.amount ? Math.max((d.amount / max) * 100, 4) : 0;

          return (
            <div
              key={d.label}
              className="flex flex-col items-center gap-1"
              title={`${d.label}: ${formatAmount(d.amount)}`}
            >
              <span className="text-[10px] text-slate-400">
                {d.amount ? compactAmount(d.amount) : "—"}
              </span>
              <div className="flex h-24 w-full items-end rounded-md bg-slate-50">
                <div
                  className={`w-full rounded-md ${
                    isPeak ? "bg-slate-700" : "bg-slate-300"
                  }`}
                  style={{ height: `${height}%` }}
                />
              </div>
              <span className="text-xs text-slate-500">{d.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}