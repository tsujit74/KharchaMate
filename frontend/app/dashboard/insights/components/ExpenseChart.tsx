"use client";

import React, { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { InsightResponse, ChartType } from "../types/insight";

export const CATEGORY_COLORS: Record<string, string> = {
  FOOD: "#22C55E",
  TRAVEL: "#3B82F6",
  RENT: "#F59E0B",
  SHOPPING: "#EC4899",
  RECHARGE: "#6366F1",
  OTHER: "#6B7280",
};

export default function ExpenseChart({
  data,
  chartType,
  isMobile,
}: {
  data: InsightResponse;
  chartType: ChartType;
  isMobile: boolean;
}) {
  const chartContent = useMemo(() => {
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
          <Tooltip 
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "6px",
              fontSize: "12px",
            }}
          />
          <Legend 
            wrapperStyle={{
              fontSize: "12px",
              paddingTop: "10px",
            }}
          />
        </PieChart>
      );
    }

    return (
      <BarChart data={data.categoryBreakdown}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis 
          dataKey="category" 
          tick={{ fontSize: 12 }}
          axisLine={{ stroke: "#9ca3af" }}
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          axisLine={{ stroke: "#9ca3af" }}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "6px",
            fontSize: "12px",
          }}
        />
        <Legend 
          wrapperStyle={{
            fontSize: "12px",
            paddingTop: "10px",
          }}
        />
        <Bar 
          dataKey="total" 
          fill="#111827" 
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    );
  }, [data, chartType, isMobile]);

  return (
  <div className="bg-white border border-gray-200 p-4 sm:p-6 rounded">

    {!data?.categoryBreakdown?.length ? (
      <div className="text-center text-gray-500 py-10">
        No chart data
      </div>
    ) : (
      <div className="relative w-full h-[320px] sm:h-[420px]">
        <ResponsiveContainer width="100%" height="100%">
          {chartContent}
        </ResponsiveContainer>
      </div>
    )}

  </div>
);
}