"use client";

import GroupKPI from "../../GroupKPI";
import GroupSettlementSection from "../../GroupSettlementSection";

type Props = {
  settlement: any;
  userId?: string;
  groupId: string;
};

export default function GroupOverviewSection({
  settlement,
  userId,
  groupId,
}: Props) {
  return (
    <section className="px-4 py-1 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mt-4">
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
