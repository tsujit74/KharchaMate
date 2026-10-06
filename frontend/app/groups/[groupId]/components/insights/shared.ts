import type { TrendUnit } from "../../types/insights.types";

export const cardClass =
  "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm";

export const cardTitleClass = "text-base font-semibold text-slate-900";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const formatAmount = (n: number) =>
  `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

const oneDecimal = (n: number) => String(Math.round(n * 10) / 10);

export const compactAmount = (n: number) => {
  const abs = Math.abs(n);
  if (abs >= 1e7) return `₹${oneDecimal(n / 1e7)}Cr`;
  if (abs >= 1e5) return `₹${oneDecimal(n / 1e5)}L`;
  if (abs >= 1e3) return `₹${oneDecimal(n / 1e3)}k`;
  return `₹${Math.round(n)}`;
};

export const formatPercent = (n: number) =>
  n < 1 ? `${n.toFixed(1)}%` : `${Math.round(n)}%`;

export const categoryName = (category: string) =>
  category.charAt(0) + category.slice(1).toLowerCase();

export const trendLabel = (label: string, unit: TrendUnit) => {
  const [year, month, day] = label.split("-");
  const name = MONTHS[Number(month) - 1];

  if (unit === "month") return `${name} '${year.slice(2)}`;
  return `${Number(day)} ${name}`;
};

export const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    timeZone: "Asia/Kolkata",
  });