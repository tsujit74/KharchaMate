"use client";

import { useState } from "react";

import DashboardHeader from "./DashboardHeader";
import DashboardStats from "./DashboardStats";
import GroupsSection from "./GroupSection";
import RecentExpensesSection from "./RecentExpensesSection";
import PendingSettlementsSection from "./PendingSettlementsSection";

import {
  Group,
  RecentExpense,
  PendingSettlement,
} from "../types/dashboard.types";

type Props = {
  userId?: string;
  firstName: string;

  groups: Group[];
  recentExpenses: RecentExpense[];
  pendingSettlements: PendingSettlement[];

  recentLoading: boolean;
  pendingLoading: boolean;

  setEditGroupId: (id: string | null) => void;
  setEditGroupName: (name: string) => void;
};

export default function DashboardContent({
  userId,
  firstName,
  groups,
  recentExpenses,
  pendingSettlements,
  recentLoading,
  pendingLoading,
  setEditGroupId,
  setEditGroupName,
}: Props) {
  const [editModalOpen, setEditModalOpen] = useState(false);

  const totalMembers = groups.reduce(
    (sum, group) => sum + group.members.length,
    0,
  );

  const activeGroups = groups.filter((g) => g.isActive && !g.isBlocked).length;

  const archivedGroups = groups.filter(
    (g) => !g.isActive && !g.isBlocked,
  ).length;

  const blockedGroups = groups.filter((g) => g.isBlocked).length;

  const handleEdit = (id: string, name: string) => {
    setEditGroupId(id);
    setEditGroupName(name);
    setEditModalOpen(true);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <DashboardHeader firstName={firstName} />

      {/* Stats */}
      <DashboardStats
        groups={groups}
        recentExpenses={recentExpenses}
        pendingSettlements={pendingSettlements}
      />

      {/* Groups */}
      <GroupsSection
        groups={groups}
        userId={userId}
        onEdit={handleEdit}
        activeGroups={activeGroups}
        archivedGroups={archivedGroups}
        blockedGroups={blockedGroups}
      />

      {/* Bottom Sections */}
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch">
        <RecentExpensesSection
          expenses={recentExpenses}
          loading={recentLoading}
        />

        <PendingSettlementsSection
          settlements={pendingSettlements}
          loading={pendingLoading}
          userId={userId}
        />
      </section>
    </div>
  );
}
