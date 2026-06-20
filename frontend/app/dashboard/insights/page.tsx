"use client";

import { useState, useEffect } from "react";
import { useInsights } from "./hooks/useInsights";
import { useExpenseList } from "./hooks/useExpenseList";
import { ChartType } from "./types/insight";

import InsightsHeader from "./components/InsightsHeader";
import FilterBar from "./components/FilterBar";
import SummaryCards from "./components/SummaryCards";
import ExpenseChart from "./components/ExpenseChart";
import ErrorDisplay from "./components/ErrorDisplay";
import SkeletonLoader from "./components/SkeletonLoader";
import NoDataMessage from "./components/NoDataMessage";
import ExpenseSection from "./components/ExpenseSection";
import ChartToggle from "./components/ChartToogle";
import { useAuth } from "@/app/context/authContext";
import { useRouter } from "next/navigation";

export default function InsightsPage() {
  const { user, isAuthenticated} = useAuth();
  const router = useRouter();
  const {
    data,
    loading,
    error,
    filter,
    setFilter,
    category,
    setCategory,
    customRange,
    setCustomRange,
    applyCustomFilter,
  } = useInsights();

  const {
    expenses,
    loading: expensesLoading,
    loadMore,
    hasMore,
  } = useExpenseList(filter, customRange, category);

  const [chartType, setChartType] = useState<ChartType>("pie");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/auth");
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <main className="min-h-screen bg-[#F9FAFB] p-4 sm:p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <InsightsHeader />

        <FilterBar
          filter={filter}
          setFilter={setFilter}
          customRange={customRange}
          setCustomRange={setCustomRange}
          applyCustomFilter={applyCustomFilter}
        />

        <ErrorDisplay error={error} />

        {loading && <SkeletonLoader />}

        {!loading && data && (
          <>
            <SummaryCards data={data} />

            <div className="flex justify-end mt-2 mb-4">
              <ChartToggle value={chartType} onChange={setChartType} />
            </div>

            {data.categoryBreakdown.length === 0 ? (
              <NoDataMessage />
            ) : (
              <ExpenseChart
                data={data}
                chartType={chartType}
                isMobile={isMobile}
              />
            )}

            <ExpenseSection
              category={category}
              setCategory={setCategory}
              filter={filter}
              customRange={customRange}
            />
          </>
        )}

        {!loading && !data && (
          <div className="bg-white border p-8 text-center rounded">
            <p className="text-gray-500 text-sm">
              No insights available. Add some expenses first.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
