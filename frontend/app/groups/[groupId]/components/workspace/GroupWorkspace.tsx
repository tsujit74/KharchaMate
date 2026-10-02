"use client";

import { useState } from "react";
import GroupNavigation from "./GroupNavigation";
import GroupMembersSection from "./sections/GroupMembersSection";
import GroupOverviewSection from "./sections/GroupOverviewSection";
import GroupExpensesSection from "./sections/GroupExpensesSection";
import GroupSettlementWorkspaceSection from "./sections/GroupSettlementWorkspaceSection";
import GroupInsightsSection from "./sections/GroupInsightsSection";
import GroupMoreSection from "./sections/GroupMoreSection";
import MobileGroupNavigation from "./MobileGroupNavigation";

type Section =
  | "overview"
  | "expenses"
  | "settlement"
  | "insights"
  | "members"
  | "more";

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

  return (
    <div className="flex min-h-screen bg-[#FCFCFD] pb-16 md:pb-0">
      <GroupNavigation
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      <section className="min-w-0 flex-1">
        {activeSection === "members" && membersData ? (
          <GroupMembersSection {...membersData} />
        ) : activeSection === "overview" && overviewData ? (
          <GroupOverviewSection {...overviewData} />
        ) : activeSection === "expenses" && expensesData ? (
          <GroupExpensesSection {...expensesData} />
        ) : activeSection === "settlement" && settlementData ? (
          <GroupSettlementWorkspaceSection {...settlementData} />
        ) : activeSection === "insights" ? (
          <GroupInsightsSection />
        ) : activeSection === "more" && moreData ? (
          <GroupMoreSection {...moreData} />
        ) : (
          children
        )}
      </section>

      <MobileGroupNavigation
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      {overlays}
    </div>
  );
}
