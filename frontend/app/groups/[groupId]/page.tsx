"use client";

import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { useAuth } from "@/app/context/authContext";

import AppSkeleton from "@/app/components/ui/AppSkeleton";
import GroupInfoDrawer from "./components/GroupInfoDrawer";

import GroupHeader from "./components/GroupHeader";
import SettlementSection from "./components/GroupSettlementSection";
import GroupMembersSidebar from "./components/GroupMembersSidebar";
import AddExpensesModal from "./components/expenses/AddExpensesModal";
import GroupKPIs from "./components/GroupKPI";
import GroupExpenseSection from "./components/GroupExpenseSection";
import { useGroupDetails } from "./hooks/useGroupDetails";
import { useGroupExpenses } from "./hooks/useGroupExpenses";
import { useState } from "react";

export default function GroupDetailsPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const router = useRouter();

  const { isAuthenticated, loading, user } = useAuth();

  const {
    group,
    settlement,
    loading: detailsLoading,
    error,
    refresh: refreshDetails,
  } = useGroupDetails(groupId);

  const {
    expenses,
    page,
    totalExpenses,
    totalPages,
    loadingMore,
    loadMore,
    refresh: refreshExpenses,
  } = useGroupExpenses(groupId);

  const [infoOpen, setInfoOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    <main className="min-h-screen bg-[#FCFCFD] flex">
      {/* SIDEBAR */}
      <aside className="w-72 hidden md:block border-r bg-white p-4 sticky top-0 h-screen">
        <GroupMembersSidebar
          balances={settlement.balances}
          currentUserId={user?.id}
          groupId={groupId}
          isActive={group?.isActive}
          hasExpenses={expenses.length > 0}
        />
      </aside>

      {/* MAIN */}
      <section className="flex-1 px-4 md:px-10 py-6">
        <GroupHeader
          title={settlement.group}
          subtitle="Track expenses & settlements"
          isActive={isActive}
          onInfoClick={() => setInfoOpen(true)}
        />

        <GroupKPIs
          totalSpent={settlement.totalSpent}
          yourShare={settlement.yourShare}
          members={settlement.balances.length}
        />

        <SettlementSection
          settlement={settlement}
          userId={user?.id}
          groupId={groupId}
        />

        <GroupExpenseSection
          expenses={expenses}
          totalExpenses={totalExpenses}
          isActive={isActive}
          page={page}
          totalPages={totalPages}
          loadingMore={loadingMore}
          userId={user?.id}
          onAdd={() => setIsModalOpen(true)}
          onLoadMore={loadMore}
          onRefresh={refreshAll}
        />
      </section>

      {/* DRAWERS */}
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
    </main>
  );
}
