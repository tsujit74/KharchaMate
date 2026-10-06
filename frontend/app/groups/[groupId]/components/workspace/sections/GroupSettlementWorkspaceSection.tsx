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
    <section className="px-4 py-1 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        

        <div className="mt-4">
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