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
    <section className="px-4 py-6 md:px-8 lg:px-10">
      <GroupHeader
        title={settlement.group}
        subtitle="Track expenses & settlements"
        isActive={isActive}
        onInfoClick={onInfoClick}
      />

      <GroupKPI
        totalSpent={settlement.totalSpent}
        yourShare={settlement.yourShare}
        members={settlement.balances.length}
      />

      <div className="mt-6 flex justify-end">
        <DownloadGroupPDF groupId={groupId} groupName={settlement.group} />
      </div>

      <div className="mt-6">
        <GroupSettlementSection
          settlement={settlement}
          userId={userId}
          groupId={groupId}
        />
      </div>
    </section>
  );
}
