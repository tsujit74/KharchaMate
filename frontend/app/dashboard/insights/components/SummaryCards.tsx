"use client";

import React from "react";
import { InsightResponse } from "../types/insight";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value || 0);

export default function SummaryCards({
  data,
}: {
  data: InsightResponse;
}) {
  const cards = [
    {
      label: "Paid by You",
      value: data.paidByYou,
      variant: "default",
    },
    {
      label: "Your Expense",
      value: data.yourExpense,
      variant: "default",
    },
    {
      label: "Expense Balance (Before Settlements)",
      value: data.netBalance,
      variant: data.netBalance >= 0 ? "positive" : "negative",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`bg-white border p-4 sm:p-6 rounded transition ${
            card.variant === "positive"
              ? "border-green-200"
              : card.variant === "negative"
                ? "border-red-200"
                : "border-gray-200"
          }`}
        >
          <p className="text-sm text-gray-500 mb-1">{card.label}</p>
          <p
            className={`text-lg sm:text-xl font-bold ${
              card.variant === "positive"
                ? "text-green-600"
                : card.variant === "negative"
                  ? "text-red-600"
                  : "text-gray-900"
            }`}
          >
            {formatCurrency(card.value)}
          </p>
        </div>
      ))}
    </div>
  );
}