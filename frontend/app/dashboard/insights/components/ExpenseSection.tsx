"use client";

import React from "react";
import { FilterType, CustomRange, CategoryType } from "../types/insight";
import CategoryTabs from "./CategoryTabs";
import MonthlyExpenseList from "./MonthlyExpenseList";

export default function ExpenseSection({
  category,
  setCategory,
  filter,
  customRange,
}: {
  category: CategoryType;
  setCategory: (c: CategoryType) => void;
  filter: FilterType;
  customRange: CustomRange;
}) {
  return (
    <div className="border-t border-gray-200 pt-4">
      <h3 className="text-sm font-medium text-gray-600 mb-3">Monthly Expenses</h3>
      <CategoryTabs selected={category} onChange={setCategory} />
      <MonthlyExpenseList
        filter={filter}
        customRange={customRange}
        category={category}
      />
    </div>
  );
}