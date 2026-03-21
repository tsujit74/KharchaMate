"use client";

import { useEffect, useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

import { getMyInsights } from "@/app/services/expense.service";
import toast from "react-hot-toast";
import MonthlyExpenseList from "./components/MonthlyExpenseList";
import CategoryTabs from "./components/CategoryTabs";

type InsightResponse = {
  categoryBreakdown: { category: string; total: number }[];
  paidByYou: number;
  yourExpense: number;
  netBalance: number;
};

//const COLORS = ["#111827", "#374151", "#6B7280", "#9CA3AF", "#D1D5DB"];

const CATEGORY_COLORS: Record<string, string> = {
  FOOD: "#22C55E",
  TRAVEL: "#3B82F6",
  RENT: "#F59E0B",
  SHOPPING: "#EC4899",
  RECHARGE: "#6366F1",
  OTHER: "#6B7280",
};

export default function InsightsPage() {
  const [data, setData] = useState<InsightResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"this-month" | "last-month" | "custom">(
    "this-month",
  );
  const [chartType, setChartType] = useState<"pie" | "bar">("pie");
  const [error, setError] = useState("");
  const [customRange, setCustomRange] = useState({
    start: "",
    end: "",
  });
  const [category, setCategory] = useState<string>("ALL");

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(value || 0);

  const fetchInsights = async (params?: any) => {
  try {
    setLoading(true);
    setError("");

    const finalParams = {
      ...(params || { filter }),
      ...(category !== "ALL" && { category }),
    };

    const res = await getMyInsights(finalParams);
    setData(res);
  } catch (err: any) {
    const message = err.message || "Failed to load insights";
    setError(message);
    toast.error(message);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    if (filter !== "custom") {
      fetchInsights({ filter });
    }
  }, [filter,category]);

  const applyCustomFilter = () => {
    if (!customRange.start || !customRange.end) {
      setError("Please select both start and end dates.");
      toast.error("Please select both start and end dates.");
      return;
    }

    if (customRange.start > customRange.end) {
      setError("Start date cannot be after end date.");
      toast.error("Start date cannot be after end date.");
      return;
    }

    fetchInsights({
      start: customRange.start,
      end: customRange.end,
    });
  };

  const chartContent = useMemo(() => {
    if (!data) return null;

    if (chartType === "pie") {
      return (
        <PieChart>
          <Pie
            data={data.categoryBreakdown}
            dataKey="total"
            nameKey="category"
            outerRadius={isMobile ? 80 : 120}
            label={!isMobile}
          >
            {data.categoryBreakdown.map((_, index) => (
              <Cell
                key={index}
                fill={CATEGORY_COLORS[data.categoryBreakdown[index].category]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      );
    }

    return (
      <BarChart data={data.categoryBreakdown}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="category" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="total" fill="#111827" />
      </BarChart>
    );
  }, [data, chartType, isMobile]);

  return (
    <main className="min-h-screen bg-[#F9FAFB] p-4 sm:p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <h1 className="text-xl sm:text-2xl font-bold">Spending Insights</h1>

        {/* FILTER */}
        <div className="flex flex-wrap gap-2 items-center">
          {["this-month", "last-month", "custom"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-3 py-2 text-xs sm:text-sm border ${
                filter === f ? "bg-black text-white" : "bg-white"
              }`}
            >
              {f === "this-month"
                ? "This Month"
                : f === "last-month"
                  ? "Last Month"
                  : "Custom"}
            </button>
          ))}

          {filter === "custom" && (
            <>
              <input
                type="date"
                value={customRange.start}
                onChange={(e) =>
                  setCustomRange({
                    ...customRange,
                    start: e.target.value,
                  })
                }
                className="border px-2 py-1 text-xs sm:text-sm"
              />
              <input
                type="date"
                value={customRange.end}
                onChange={(e) =>
                  setCustomRange({
                    ...customRange,
                    end: e.target.value,
                  })
                }
                className="border px-2 py-1 text-xs sm:text-sm"
              />
              <button
                onClick={applyCustomFilter}
                className="px-3 py-2 bg-black text-white text-xs sm:text-sm"
              >
                Apply
              </button>
            </>
          )}
        </div>

        {/* ERROR */}
        {error && (
          <div className="text-red-600 bg-red-50 border p-3 text-sm">
            {error}
          </div>
        )}

        {/* SKELETON LOADER */}
        {loading && (
          <div className="space-y-4 animate-pulse">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="h-20 bg-gray-200 rounded" />
              <div className="h-20 bg-gray-200 rounded" />
              <div className="h-20 bg-gray-200 rounded" />
            </div>
            <div className="h-72 sm:h-96 bg-gray-200 rounded" />
          </div>
        )}

        {/* CONTENT */}
        {!loading && data && (
          <>
            {/* SUMMARY */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white border p-4 sm:p-6">
                <p className="text-sm text-gray-500">Paid by You</p>
                <p className="text-lg sm:text-xl font-bold">
                  {formatCurrency(data.paidByYou)}
                </p>
              </div>

              <div className="bg-white border p-4 sm:p-6">
                <p className="text-sm text-gray-500">Your Expense</p>
                <p className="text-lg sm:text-xl font-bold">
                  {formatCurrency(data.yourExpense)}
                </p>
              </div>

              <div className="bg-white border p-4 sm:p-6">
                <p className="text-sm text-gray-500">
                  Expense Balance (Before Settlements)
                </p>
                <p
                  className={`text-lg sm:text-xl font-bold ${
                    data.netBalance >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {formatCurrency(data.netBalance)}
                </p>
              </div>
            </div>

            {/* CHART TOGGLE */}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setChartType("pie")}
                className={`px-3 py-1 text-xs sm:text-sm border ${
                  chartType === "pie" ? "bg-black text-white" : ""
                }`}
              >
                Pie
              </button>
              <button
                onClick={() => setChartType("bar")}
                className={`px-3 py-1 text-xs sm:text-sm border ${
                  chartType === "bar" ? "bg-black text-white" : ""
                }`}
              >
                Bar
              </button>
            </div>

            {/* CHART */}
            {data.categoryBreakdown.length === 0 ? (
              <div className="text-center text-gray-500 py-10">
                No spending data available for this period.
              </div>
            ) : (
              <div className="bg-white border p-4 sm:p-6 overflow-x-auto">
                <div className="min-w-[350px] h-[300px] sm:h-[420px]">
                  <ResponsiveContainer width="100%" height="100%">
                    {chartContent}
                  </ResponsiveContainer>
                </div>
              </div>
            )}
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-gray-600 mb-3">
                Monthly Expenses
              </h3>
<CategoryTabs selected={category} onChange={setCategory} />

<MonthlyExpenseList
  filter={filter}
  customRange={customRange}
  category={category}
/>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
