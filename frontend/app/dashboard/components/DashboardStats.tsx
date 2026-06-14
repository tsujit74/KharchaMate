"use client";

import StatCard from "./StatCard";
import {
  Users,
  UserPlus,
  ReceiptText,
  ShieldCheck,
} from "lucide-react";

import { Group, RecentExpense } from "../types/dashboard.types";

type Props = {
  groups: Group[];
  recentExpenses: RecentExpense[];
  pendingSettlements: any[];
};

export default function DashboardStats({
  groups,
  recentExpenses,
  pendingSettlements,
}: Props) {
  const totalMembers = groups.reduce(
    (sum, group) => sum + group.members.length,
    0
  );

  const activeGroups = groups.filter(
    (group) => group.isActive && !group.isBlocked
  ).length;

  return (
    <section className="hidden sm:grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

      {/* Groups */}
      <StatCard
        icon={<Users className="w-4 h-4" />}
        label="Groups"
        value={groups.length}
        subtext={`${activeGroups} active`}
        iconStyle="text-indigo-600 bg-indigo-50 border-indigo-100"
      />

      {/* Members */}
      <StatCard
        icon={<UserPlus className="w-4 h-4" />}
        label="Members"
        value={totalMembers}
        subtext="Across all groups"
        iconStyle="text-sky-600 bg-sky-50 border-sky-100"
      />

      {/* Recent Expenses */}
      <StatCard
        icon={<ReceiptText className="w-4 h-4" />}
        label="Recent Expenses"
        value={recentExpenses.length}
        subtext="Latest entries"
        iconStyle="text-emerald-600 bg-emerald-50 border-emerald-100"
      />

      {/* Settlements */}
      <StatCard
        icon={<ShieldCheck className="w-4 h-4" />}
        label="Settlements"
        value={pendingSettlements.length}
        subtext="Pending actions"
        iconStyle="text-amber-600 bg-amber-50 border-amber-100"
      />

    </section>
  );
}