"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { GroupInsights } from "../../types/insights.types";
import { compactAmount, formatAmount, trendLabel } from "../insights/shared";

type Props = {
  trend: GroupInsights["trend"];
  isOngoing: boolean;
};

type View = "bars" | "trend";

const VIEWS: { id: View; label: string }[] = [
  { id: "bars", label: "Bars" },
  { id: "trend", label: "Trend" },
];

const DARK = "#334155";
const LIGHT = "#cbd5e1";
const GRID = "#e2e8f0";
const MUTED = "#64748b";

// Above this many periods the chart scrolls horizontally instead of
// squeezing bars and labels together.
const SCROLL_THRESHOLD = 10;
const PX_PER_POINT = 40;

const CHART_MARGIN = { top: 12, right: 12, left: 0, bottom: 0 };
const X_TICK = { fontSize: 11, fill: MUTED };
const Y_TICK = { fontSize: 11, fill: MUTED };

const TOOLTIP_STYLE = {
  borderRadius: 8,
  border: `1px solid ${GRID}`,
  backgroundColor: "#ffffff",
  fontSize: 12,
};

const UNIT_HEADING = {
  day: "Spending by day",
  week: "Spending by week",
  month: "Spending by month",
} as const;

export default function SpendingTrendChart({ trend, isOngoing }: Props) {
  const [view, setView] = useState<View>("bars");

  const stats = useMemo(() => {
    const points = trend.points.map((point, index) => ({
      // Label alone can repeat (e.g. "Jan" across years), so include index.
      key: `${point.label}-${index}`,
      name: trendLabel(point.label, trend.unit),
      amount: Number.isFinite(point.amount) ? point.amount : 0,
      partial: isOngoing && index === trend.points.length - 1,
    }));

    const total = points.reduce((sum, p) => sum + p.amount, 0);

    // Only a real peak (> 0). All-zero data has no meaningful "highest".
    const peak = points.reduce<(typeof points)[number] | null>(
      (best, p) => (p.amount > (best?.amount ?? 0) ? p : best),
      null,
    );

    // The in-progress period is excluded so it doesn't drag the average down.
    const complete = points.filter((p) => !p.partial);
    const base = complete.length > 0 ? complete : points;
    const average =
      base.length > 0
        ? base.reduce((sum, p) => sum + p.amount, 0) / base.length
        : 0;

    return {
      points,
      total,
      peak,
      average,
      averageExcludesPartial:
        complete.length > 0 && complete.length < points.length,
      hasNegative: points.some((p) => p.amount < 0),
    };
  }, [trend, isOngoing]);

  const { points, total, peak, average, averageExcludesPartial, hasNegative } =
    stats;

  // A trend line needs at least two points. Deriving the active view (rather
  // than only trusting state) keeps the chart valid if data shrinks while
  // "Trend" is selected.
  const canToggle = points.length >= 2;
  const activeView: View = canToggle ? view : "bars";

  const card =
    "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5";
  const title = "text-sm font-semibold text-slate-900 sm:text-base";

  if (points.length === 0) {
    return (
      <div className={card}>
        <h2 className={title}>Spending</h2>
        <p className="mt-3 text-sm text-slate-500">
          No spending data yet. Add an expense to see the chart.
        </p>
      </div>
    );
  }

  const heading =
    activeView === "trend"
      ? "Spending trend"
      : isOngoing
        ? "Monthly spending"
        : UNIT_HEADING[trend.unit];

  const summary =
    activeView === "trend"
      ? `Average: ${formatAmount(Math.round(average))}`
      : peak
        ? `Highest: ${peak.name}, ${formatAmount(peak.amount)}`
        : `Total: ${formatAmount(total)}`;

  const footnote =
    activeView === "trend"
      ? `Dashed line is the average per period${
          averageExcludesPartial ? ", excluding the current month" : ""
        }.`
      : `Grouped by the date each expense was added.${
          isOngoing ? " The lighter bar is the current month, still in progress." : ""
        }`;

  const scrolls = points.length > SCROLL_THRESHOLD;
  const minWidth = scrolls ? points.length * PX_PER_POINT : undefined;

  // Non-negative data should always be anchored at zero so bar and line
  // heights are honest. Only fall back to auto if refunds make values negative.
  const yDomain: [number | "auto", number | "auto"] = hasNegative
    ? ["auto", "auto"]
    : [0, "auto"];

  const grid = <CartesianGrid vertical={false} stroke={GRID} />;

  const yAxis = (
    <YAxis
      width={44}
      tickCount={4}
      domain={yDomain}
      axisLine={false}
      tickLine={false}
      tick={Y_TICK}
      tickFormatter={(value) => compactAmount(Number(value))}
    />
  );

  const tooltip = (cursor: boolean | { fill: string }) => (
    <Tooltip
      cursor={cursor}
      formatter={(value) => [formatAmount(Number(value)), "Spent"]}
      contentStyle={TOOLTIP_STYLE}
      wrapperStyle={{ outline: "none" }}
    />
  );

  return (
    <div className={card}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className={title}>{heading}</h2>
          <p className="mt-0.5 text-xs text-slate-500">{summary}</p>
        </div>

        {canToggle && (
          <div
            role="group"
            aria-label="Chart type"
            className="inline-flex shrink-0 rounded-lg bg-slate-100 p-0.5"
          >
            {VIEWS.map((v) => {
              const selected = activeView === v.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setView(v.id)}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 ${
                    selected
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {v.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-4 overflow-x-auto">
        <div
          role="img"
          aria-label={`${heading}. ${summary}`}
          className="h-[220px] w-full sm:h-[260px]"
          style={{ minWidth }}
        >
          <ResponsiveContainer width="100%" height="100%">
            {activeView === "bars" ? (
              <BarChart data={points} margin={CHART_MARGIN}>
                {grid}
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={X_TICK}
                  tickMargin={8}
                  interval="preserveStartEnd"
                  minTickGap={12}
                />
                {yAxis}
                {tooltip({ fill: "#f1f5f9" })}
                <Bar
                  dataKey="amount"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                  isAnimationActive={false}
                >
                  {points.map((p) => (
                    <Cell key={p.key} fill={p.partial ? LIGHT : DARK} />
                  ))}
                </Bar>
              </BarChart>
            ) : (
              <LineChart data={points} margin={CHART_MARGIN}>
                {grid}
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={X_TICK}
                  tickMargin={8}
                  interval="preserveStartEnd"
                  minTickGap={12}
                  // Keeps the first and last labels from being clipped at the
                  // chart edges, since line points sit on the edge itself.
                  padding={{ left: 16, right: 16 }}
                />
                {yAxis}
                {tooltip(true)}
                {average > 0 && (
                  <ReferenceLine
                    y={average}
                    stroke="#94a3b8"
                    strokeDasharray="4 4"
                  />
                )}
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke={DARK}
                  strokeWidth={2}
                  dot={{ r: 3, fill: DARK, strokeWidth: 0 }}
                  activeDot={{ r: 5 }}
                  isAnimationActive={false}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-400">{footnote}</p>
    </div>
  );
}