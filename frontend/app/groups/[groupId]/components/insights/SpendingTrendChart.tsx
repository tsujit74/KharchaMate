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

type ChartPoint = {
  key: string;
  name: string;
  amount: number;
  partial: boolean;
};

const VIEWS: { id: View; label: string }[] = [
  { id: "bars", label: "Bars" },
  { id: "trend", label: "Trend" },
];

const COLORS = {
  primary: "#4f46e5",
  current: "#f59e0b",
  average: "#0d9488",
  grid: "#e2e8f0",
  muted: "#64748b",
  text: "#0f172a",
  white: "#ffffff",
};

const SCROLL_THRESHOLD = 10;
const PX_PER_POINT = 40;

const CHART_MARGIN = { top: 12, right: 12, left: 0, bottom: 0 };
const X_TICK = { fontSize: 11, fill: COLORS.muted };
const Y_TICK = { fontSize: 11, fill: COLORS.muted };

const TOOLTIP_STYLE = {
  borderRadius: 10,
  border: `1px solid ${COLORS.grid}`,
  backgroundColor: COLORS.white,
  boxShadow: "0 4px 16px rgba(15, 23, 42, 0.08)",
  fontSize: 12,
  padding: "8px 12px",
};

const UNIT_HEADING = {
  day: "Spending by day",
  week: "Spending by week",
  month: "Spending by month",
} as const;

const AVERAGE_LABEL = {
  day: "Avg. / day",
  week: "Avg. / week",
  month: "Avg. / month",
} as const;

function formatWeekRange(label: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(label);

  if (!match) return label;

  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  const day = Number(match[3]);
  const start = new Date(Date.UTC(year, month, day));

  if (
    start.getUTCFullYear() !== year ||
    start.getUTCMonth() !== month ||
    start.getUTCDate() !== day
  ) {
    return label;
  }

  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 6);

  const startMonth = start.toLocaleDateString("en-IN", {
    month: "short",
    timeZone: "UTC",
  });

  const endMonth = end.toLocaleDateString("en-IN", {
    month: "short",
    timeZone: "UTC",
  });

  const startYear = start.getUTCFullYear();
  const endYear = end.getUTCFullYear();

  if (startYear !== endYear) {
    return `${startMonth} ${start.getUTCDate()}, ${startYear}–${endMonth} ${end.getUTCDate()}, ${endYear}`;
  }

  if (startMonth !== endMonth) {
    return `${startMonth} ${start.getUTCDate()}–${endMonth} ${end.getUTCDate()}`;
  }

  return `${startMonth} ${start.getUTCDate()}–${end.getUTCDate()}`;
}

function getPointLabel(label: string, unit: Props["trend"]["unit"]) {
  if (unit === "week") return formatWeekRange(label);
  return trendLabel(label, unit);
}

export default function SpendingTrendChart({ trend, isOngoing }: Props) {
  const [view, setView] = useState<View>("bars");

  const stats = useMemo(() => {
    const points: ChartPoint[] = trend.points.map((point, index) => ({
      key: `${point.label}-${index}`,
      name: getPointLabel(point.label, trend.unit),
      amount: point.amount,
      partial: isOngoing && index === trend.points.length - 1,
    })).filter((point) => Number.isFinite(point.amount));

    const total = points.reduce((sum, point) => sum + point.amount, 0);

    const peak = points.reduce<ChartPoint | null>(
      (best, point) =>
        point.amount > (best?.amount ?? 0) ? point : best,
      null,
    );

    const complete = points.filter((point) => !point.partial);
    const base = complete.length > 0 ? complete : points;

    const average =
      base.length > 0
        ? base.reduce((sum, point) => sum + point.amount, 0) / base.length
        : 0;

    return {
      points,
      total,
      peak,
      average,
      averageExcludesPartial:
        complete.length > 0 && complete.length < points.length,
      hasNegative: points.some((point) => point.amount < 0),
    };
  }, [trend, isOngoing]);

  const {
    points,
    total,
    peak,
    average,
    averageExcludesPartial,
    hasNegative,
  } = stats;

  const canToggle = points.length >= 2;
  const activeView: View = canToggle ? view : "bars";

  const card =
    "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5";

  const title =
    "text-sm font-semibold tracking-tight text-slate-900 sm:text-base";

  if (points.length === 0) {
    return (
      <section className={card} aria-label="Group spending analysis">
        <h2 className={title}>Spending overview</h2>
        <p className="mt-1 text-xs text-slate-500">
          See how your group&apos;s expenses change over time.
        </p>

        <div className="mt-4 flex min-h-28 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 text-center">
          <span className="text-sm font-medium text-slate-700">
            No spending data yet
          </span>
          <p className="mt-1 text-xs text-slate-500">
            Add an expense to see your group&apos;s spending pattern.
          </p>
        </div>
      </section>
    );
  }

  const heading =
    activeView === "trend" ? "Spending trend" : UNIT_HEADING[trend.unit];

  const periodName =
    trend.unit === "day"
      ? "current day"
      : trend.unit === "week"
        ? "current week"
        : "current month";

  const footnote =
    activeView === "trend"
      ? `The dashed teal line shows average spending per period${
          averageExcludesPartial ? `, excluding the ${periodName}` : ""
        }.`
      : `Each bar groups expenses by period.${
          isOngoing
            ? ` The amber bar marks the ${periodName}, which is still in progress.`
            : ""
        }`;

  const scrolls = points.length > SCROLL_THRESHOLD;
  const minWidth = scrolls ? points.length * PX_PER_POINT : undefined;

  const yDomain: [number | "auto", number | "auto"] = hasNegative
    ? ["auto", "auto"]
    : [0, "auto"];

  const grid = (
    <CartesianGrid
      vertical={false}
      stroke={COLORS.grid}
      strokeDasharray="3 4"
    />
  );

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
      labelStyle={{
        color: COLORS.text,
        fontWeight: 600,
        marginBottom: 4,
      }}
      itemStyle={{ color: COLORS.primary }}
      wrapperStyle={{ outline: "none" }}
    />
  );

  return (
    <section className={card} aria-label="Group spending analysis">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className={title}>{heading}</h2>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Understand when your group spends more or less.
          </p>
        </div>

        {canToggle && (
          <div
            role="group"
            aria-label="Chart type"
            className="inline-flex shrink-0 rounded-lg border border-slate-200 bg-slate-50 p-0.5"
          >
            {VIEWS.map((item) => {
              const selected = activeView === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setView(item.id)}
                  className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1 ${
                    selected
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-600 hover:bg-white hover:text-slate-900"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="min-w-0 rounded-xl border border-indigo-100 bg-indigo-50/70 p-2.5">
          <p className="text-[10px] font-medium uppercase tracking-wide text-indigo-700 sm:text-[11px]">
            Total spent
          </p>
          <p className="mt-1 truncate text-sm font-semibold tabular-nums text-slate-900 sm:text-base">
            {formatAmount(total)}
          </p>
        </div>

        <div className="min-w-0 rounded-xl border border-slate-200 bg-slate-50 p-2.5">
          <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500 sm:text-[11px]">
            Highest spent
          </p>
          <p className="mt-1 truncate text-sm font-semibold tabular-nums text-slate-900 sm:text-base">
            {peak ? formatAmount(peak.amount) : "—"}
          </p>
          <p className="mt-0.5 truncate text-[10px] text-slate-500">
            {peak?.name ?? "No peak"}
          </p>
        </div>

        <div className="min-w-0 rounded-xl border border-teal-100 bg-teal-50/70 p-2.5">
          <p className="text-[10px] font-medium uppercase tracking-wide text-teal-700 sm:text-[11px]">
            {AVERAGE_LABEL[trend.unit]}
          </p>
          <p className="mt-1 truncate text-sm font-semibold tabular-nums text-slate-900 sm:text-base">
            {formatAmount(Math.round(average))}
          </p>
          <p className="mt-0.5 truncate text-[10px] text-slate-500">
            {averageExcludesPartial ? "Completed periods" : "All periods"}
          </p>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <div
          role="img"
          aria-label={`${heading}. Total spent ${formatAmount(total)}.${
            peak
              ? ` Highest spending was ${formatAmount(peak.amount)} in ${peak.name}.`
              : ""
          }`}
          className="h-[220px] w-full sm:h-[250px]"
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
                {tooltip({ fill: "#eef2ff" })}

                <Bar
                  dataKey="amount"
                  name="Spent"
                  radius={[5, 5, 0, 0]}
                  maxBarSize={40}
                  isAnimationActive={false}
                >
                  {points.map((point) => (
                    <Cell
                      key={point.key}
                      fill={point.partial ? COLORS.current : COLORS.primary}
                    />
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
                  padding={{ left: 16, right: 16 }}
                />

                {yAxis}
                {tooltip(true)}

                {average > 0 && (
                  <ReferenceLine
                    y={average}
                    stroke={COLORS.average}
                    strokeDasharray="5 4"
                    strokeWidth={1.5}
                  />
                )}

                <Line
                  type="monotone"
                  dataKey="amount"
                  name="Spent"
                  stroke={COLORS.primary}
                  strokeWidth={2.5}
                  dot={{
                    r: 3,
                    fill: COLORS.white,
                    stroke: COLORS.primary,
                    strokeWidth: 2,
                  }}
                  activeDot={{
                    r: 5,
                    fill: COLORS.primary,
                    stroke: COLORS.white,
                    strokeWidth: 2,
                  }}
                  isAnimationActive={false}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      <p className="mt-2.5 text-[11px] leading-5 text-slate-500">
        {footnote}
      </p>

      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-slate-100 pt-3 text-[11px] text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2 rounded-sm bg-indigo-600" />
          Spending
        </span>

        {isOngoing && (
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-sm bg-amber-500" />
            Current period
          </span>
        )}

        {activeView === "trend" && average > 0 && (
          <span className="inline-flex items-center gap-1.5">
            <span className="h-0 w-4 border-t-2 border-dashed border-teal-600" />
            Average
          </span>
        )}
      </div>
    </section>
  );
}