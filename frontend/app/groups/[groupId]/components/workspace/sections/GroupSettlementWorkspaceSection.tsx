"use client";

import GroupSettlementSection from "../../GroupSettlementSection";

type Props = {
  settlement: any;
  userId?: string;
  groupId: string;
};

export default function GroupSettlementWorkspaceSection({
  settlement,
  userId,
  groupId,
}: Props) {
  return (
    <section className="px-4 py-6 md:px-8 lg:px-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Settlement
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          View balances and manage settlements.
        </p>
      </div>

      <GroupSettlementSection
        settlement={settlement}
        userId={userId}
        groupId={groupId}
      />
    </section>
  );
}