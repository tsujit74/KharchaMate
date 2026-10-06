"use client";

import { useAuth } from "@/app/context/authContext";
import { useGroupInsights } from "../../../hooks/useGroupInsights";

import InsightsEmptyState from "../../insights/InsightsEmptyState";
import InsightsSkeleton from "../../insights/InsightsSkeleton";
import InsightsKpis from "../../insights/InsightsKpis";
import SpendingTrendChart from "../../insights/SpendingTrendChart";
import CategoryBreakdown from "../../insights/CategoryBreakdown";
import MemberContribution from "../../insights/MemberContribution";
import TopExpenses from "../../insights/TopExpenses";
import BudgetCard from "../../insights/BudgetCard";
import SettlementCard from "../../insights/SettlementCard";

type Props = {
  groupId: string;
  onOpenSettlement: () => void;
};

export default function GroupInsightsSection({
  groupId,
  onOpenSettlement,
}: Props) {
  const { user } = useAuth();
  const { data, loading, error } = useGroupInsights(groupId);

  const isOngoing = data?.group.type === "ONGOING";

  return (
    <section className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        {loading && <InsightsSkeleton />}

        {!loading && error && (
          <div
            role="alert"
            className="mt-4 rounded-2xl border border-slate-200 bg-white p-8 text-center"
          >
            <p className="text-sm font-medium text-red-500">{error}</p>
          </div>
        )}

        {!loading && data && data.summary.expenseCount === 0 && (
          <InsightsEmptyState />
        )}

        {!loading && data && data.summary.expenseCount > 0 && (
          <div className="space-y-4">
            <InsightsKpis
              summary={data.summary}
              type={data.group.type}
              memberCount={data.group.memberCount}
            />

            <SpendingTrendChart trend={data.trend} isOngoing={isOngoing} />

            <div className="grid gap-4 lg:grid-cols-2">
              <CategoryBreakdown categories={data.categories} />

              {data.group.memberCount > 1 && (
                <MemberContribution
                  members={data.members}
                  currentUserId={user?.id}
                />
              )}
            </div>

            {data.topExpenses.length > 0 && (
              <TopExpenses
                expenses={data.topExpenses}
                totalSpent={data.summary.totalSpent}
                expenseCount={data.summary.expenseCount}
              />
            )}

            <div className="grid gap-4 lg:grid-cols-2">
              <BudgetCard budget={data.budget} isOngoing={isOngoing} />

              {data.group.memberCount > 1 && (
                <SettlementCard
                  settlement={data.settlement}
                  onOpen={onOpenSettlement}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
