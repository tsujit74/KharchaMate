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
import GroupHeader from "../GroupHeader";
import DownloadGroupPDF from "../DownloadGroupPDF";
import { UserPlus } from "lucide-react";
import Link from "next/link";

type Period =
  | "THIS_WEEK"
  | "THIS_MONTH"
  | "LAST_MONTH"
  | "LAST_3_MONTHS"
  | "THIS_YEAR"
  | "CUSTOM"
  | "ALL_TIME";

type Props = {
  groupId: string;
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
    onAdd: () => void;
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
    groupType?: "NORMAL" | "ONGOING";
    typeConfigured?: boolean;
    onInfoClick: () => void;
  };
};

export default function GroupWorkspace({
  groupId,
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
        return (
          <GroupInsightsSection
            groupId={groupId}
            onOpenSettlement={() => setActiveSection("settlement")}
          />
        );
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
        groupName={overviewData?.settlement.group ?? ""}
        groupType={moreData?.groupType}
        typeConfigured={moreData?.typeConfigured}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      <main className="min-w-0 flex-1">
        {overviewData && (
          <div className="px-4 pt-6 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-7xl">
              <GroupHeader
                title={overviewData.settlement.group}
                subtitle={
                  activeSection === "overview"
                    ? "Manage your group expenses"
                    : activeSection === "expenses"
                      ? "View and manage group expenses"
                      : activeSection === "settlement"
                        ? "Manage group settlements"
                        : activeSection === "insights"
                          ? "Understand your group's spending"
                          : activeSection === "members"
                            ? "Manage group members"
                            : "Manage your group"
                }
                isActive={overviewData.isActive}
                groupType={moreData?.groupType}
                typeConfigured={moreData?.typeConfigured}
                onInfoClick={overviewData.onInfoClick}
                onAdd={overviewData.onAdd}
              >
                <DownloadGroupPDF
                  groupId={overviewData.groupId}
                  groupName={overviewData.settlement.group}
                />

                {membersData && (
                  <Link
                    href={
                      !membersData.isActive || membersData.hasExpenses
                        ? "#"
                        : `/groups/${groupId}/add-member`
                    }
                    onClick={(e) => {
                      if (!membersData.isActive || membersData.hasExpenses) {
                        e.preventDefault();
                      }
                    }}
                    aria-disabled={
                      !membersData.isActive || membersData.hasExpenses
                    }
                    title={
                      !membersData.isActive
                        ? "Group is closed"
                        : membersData.hasExpenses
                          ? "Members can't be added once expenses exist"
                          : "Add member"
                    }
                    className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 sm:h-9 sm:w-auto sm:gap-1.5 sm:px-3 sm:text-sm ${
                      !membersData.isActive || membersData.hasExpenses
                        ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                        : "border-slate-900 bg-slate-900 text-white hover:bg-slate-800 focus-visible:ring-slate-400"
                    }`}
                  >
                    <UserPlus className="h-4 w-4" />
                    <span className="hidden sm:inline">Add Member</span>
                  </Link>
                )}
              </GroupHeader>
            </div>
          </div>
        )}
        {renderSection()}
      </main>

      <MobileGroupNavigation
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      {overlays}
    </div>
  );
}
