"use client";

import GroupHeader from "../../GroupHeader";
import GroupKPI from "../../GroupKPI";
import GroupSettlementSection from "../../GroupSettlementSection";
import DownloadGroupPDF from "../../DownloadGroupPDF";

type Props = {
  settlement: any;
  userId?: string;
  groupId: string;
  isActive: boolean;
  onInfoClick: () => void;
};

export default function GroupOverviewSection({
  settlement,
  userId,
  groupId,
  isActive,
  onInfoClick,
}: Props) {
  return (
    <section className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <GroupHeader
          title={settlement.group}
          subtitle="Track expenses & settlements"
          isActive={isActive}
          onInfoClick={onInfoClick}
        >
          <DownloadGroupPDF groupId={groupId} groupName={settlement.group} />
        </GroupHeader>

        <div className="mt-6">
          <GroupKPI
            totalSpent={settlement.totalSpent}
            yourShare={settlement.yourShare}
            members={settlement.balances.length}
          />
        </div>

        <div className="mt-6">
          <GroupSettlementSection
            settlement={settlement}
            userId={userId}
            groupId={groupId}
          />
        </div>
      </div>
    </section>
  );
}