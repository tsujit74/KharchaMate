"use client";

import { useParams } from "next/navigation";
import toast from "react-hot-toast";

import { useAuth } from "@/app/context/authContext";

import AppSkeleton from "@/app/components/ui/AppSkeleton";
import GroupInfoDrawer from "./components/GroupInfoDrawer";
import AddExpensesModal from "./components/expenses/AddExpensesModal";
import { useGroupDetails } from "./hooks/useGroupDetails";
import { useGroupExpenses } from "./hooks/useGroupExpenses";
import { useState } from "react";
import GroupWorkspace from "./components/workspace/GroupWorkspace";

type Period =
  | "THIS_WEEK"
  | "THIS_MONTH"
  | "LAST_MONTH"
  | "LAST_3_MONTHS"
  | "THIS_YEAR"
  | "CUSTOM"
  | "ALL_TIME";

export default function GroupDetailsPage() {
  const { groupId } = useParams<{ groupId: string }>();

  const { isAuthenticated, loading, user } = useAuth();

  const [infoOpen, setInfoOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [period, setPeriod] = useState<Period>("ALL_TIME");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  const {
    group,
    settlement,
    loading: detailsLoading,
    refresh: refreshDetails,
    error,
  } = useGroupDetails(groupId);

  const {
    expenses,
    page,
    totalExpenses,
    totalPages,
    loadingMore,
    loadMore,
    refresh: refreshExpenses,
  } = useGroupExpenses(groupId, 10, period, customStart, customEnd);

  const isActive = group?.isActive !== false;

  if (loading || detailsLoading) {
    return <AppSkeleton variant="details" />;
  }

  if (!isAuthenticated) return null;

  if (error) {
    return <div className="p-10 text-center text-red-500">{error}</div>;
  }

  if (!settlement) {
    return (
      <div className="p-10 text-center text-gray-500">
        No access to this group.
      </div>
    );
  }

  const refreshAll = async () => {
    try {
      await Promise.all([refreshDetails(), refreshExpenses()]);
    } catch {
      toast.error("Failed to refresh group.");
    }
  };

  return (
    <GroupWorkspace
      groupId={groupId}
      membersData={{
        balances: settlement.balances,
        currentUserId: user?.id,
        groupId,
        isActive,
        hasExpenses: expenses.length > 0,
      }}
      overviewData={{
        settlement,
        userId: user?.id,
        groupId,
        isActive,
        onInfoClick: () => setInfoOpen(true),
        onAdd: () => setIsModalOpen(true),
      }}
      expensesData={{
        expenses,
        totalExpenses,
        isActive,
        page,
        totalPages,
        loadingMore,
        userId: user?.id,
        onAdd: () => setIsModalOpen(true),
        onLoadMore: loadMore,
        onRefresh: refreshAll,
        period,
        onPeriodChange: setPeriod,
        customStart,
        customEnd,
        onCustomStartChange: setCustomStart,
        onCustomEndChange: setCustomEnd,
      }}
      settlementData={{
        settlement,
        userId: user?.id,
        groupId,
      }}
      overlays={
        <>
          <GroupInfoDrawer
            open={infoOpen}
            onClose={() => setInfoOpen(false)}
            group={group}
            currentUserId={user?.id}
            onRefresh={refreshAll}
          />

          <AddExpensesModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            groupId={groupId}
            onSuccess={refreshAll}
          />
        </>
      }
      moreData={{
        groupId,
        groupName: settlement.group,
        onInfoClick: () => setInfoOpen(true),
      }}
    />
  );
}
