"use client";

import GroupExpenseFilter from "../../GroupExpenseFilter";
import GroupExpenseSection from "../../GroupExpenseSection";

type Period =
  | "THIS_WEEK"
  | "THIS_MONTH"
  | "LAST_MONTH"
  | "LAST_3_MONTHS"
  | "THIS_YEAR"
  | "CUSTOM"
  | "ALL_TIME";

type Props = {
  expenses: any[];
  totalExpenses: number;
  isActive: boolean;
  page: number;
  totalPages: number;
  loadingMore: boolean;
  userId?: string;
  onAdd: () => void;
  onLoadMore: () => void;
  onRefresh: () => void;

  period: Period;
  onPeriodChange: (period: Period) => void;
  customStart: string;
  customEnd: string;
  onCustomStartChange: (value: string) => void;
  onCustomEndChange: (value: string) => void;
};

export default function GroupExpensesSection({
  expenses,
  totalExpenses,
  isActive,
  page,
  totalPages,
  loadingMore,
  userId,
  onAdd,
  onLoadMore,
  onRefresh,
  period,
  onPeriodChange,
  customStart,
  customEnd,
  onCustomStartChange,
  onCustomEndChange,
}: Props) {
  return (
    <section className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
          Expenses
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          View and manage group expenses.
        </p>

        <div className="mt-6">
          <GroupExpenseFilter
            period={period}
            onPeriodChange={onPeriodChange}
            customStart={customStart}
            customEnd={customEnd}
            onCustomStartChange={onCustomStartChange}
            onCustomEndChange={onCustomEndChange}
          />
        </div>

        <div className="mt-6">
          <GroupExpenseSection
            expenses={expenses}
            totalExpenses={totalExpenses}
            isActive={isActive}
            page={page}
            totalPages={totalPages}
            loadingMore={loadingMore}
            userId={userId}
            onAdd={onAdd}
            onLoadMore={onLoadMore}
            onRefresh={onRefresh}
          />
        </div>
      </div>
    </section>
  );
}
