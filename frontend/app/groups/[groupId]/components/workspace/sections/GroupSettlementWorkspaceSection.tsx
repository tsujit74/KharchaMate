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
    <section className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="border-b border-slate-200 pb-5">
          <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
            Settlement
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            View balances and manage settlements.
          </p>
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