"use client";

import { useState } from "react";
import GroupNavigation, { type Section } from "./GroupNavigation";
import MobileGroupNavigation from "./MobileGroupNavigation";
import GroupMembersSection from "./sections/GroupMembersSection";
import GroupOverviewSection from "./sections/GroupOverviewSection";
import GroupExpensesSection from "./sections/GroupExpensesSection";
import GroupSettlementWorkspaceSection from "./sections/GroupSettlementWorkspaceSection";
import GroupInsightsSection from "./sections/GroupInsightsSection";
import GroupMoreSection from "./sections/GroupMoreSection";

type Period =
  | "THIS_WEEK"
  | "THIS_MONTH"
  | "LAST_MONTH"
  | "LAST_3_MONTHS"
  | "THIS_YEAR"
  | "CUSTOM"
  | "ALL_TIME";

type Props = {
  children?: React.ReactNode;
  overlays?: React.ReactNode;

  membersData?: {
    balances: any[];
    currentUserId?: string;
    groupId: string;
    isActive: boolean;
    hasExpenses?: boolean;
  };

  overviewData?: {
    settlement: any;
    userId?: string;
    groupId: string;
    isActive: boolean;
    onInfoClick: () => void;
  };

  expensesData?: {
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

  settlementData?: {
    settlement: any;
    userId?: string;
    groupId: string;
  };

  moreData?: {
    groupId: string;
    groupName: string;
    onInfoClick: () => void;
  };
};

export default function GroupWorkspace({
  children,
  overlays,
  membersData,
  overviewData,
  expensesData,
  settlementData,
  moreData,
}: Props) {
  const [activeSection, setActiveSection] = useState<Section>("overview");

  function renderSection() {
    switch (activeSection) {
      case "overview":
        return overviewData ? (
          <GroupOverviewSection {...overviewData} />
        ) : (
          children
        );
      case "expenses":
        return expensesData ? (
          <GroupExpensesSection {...expensesData} />
        ) : (
          children
        );
      case "settlement":
        return settlementData ? (
          <GroupSettlementWorkspaceSection {...settlementData} />
        ) : (
          children
        );
      case "insights":
        return <GroupInsightsSection />;
      case "members":
        return membersData ? (
          <GroupMembersSection {...membersData} />
        ) : (
          children
        );
      case "more":
        return moreData ? <GroupMoreSection {...moreData} /> : children;
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-50/50 pb-20 md:pb-0">
      <GroupNavigation
  groupName={moreData?.groupName}
  activeSection={activeSection}
  onSectionChange={setActiveSection}
/>

      <main className="min-w-0 flex-1">{renderSection()}</main>

      <MobileGroupNavigation
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      {overlays}
    </div>
  );
}
