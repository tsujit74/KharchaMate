"use client";

import GroupMembersSidebar from "../../GroupMembersSidebar";

type Props = {
  balances: any[];
  currentUserId?: string;
  groupId: string;
  isActive: boolean;
  hasExpenses?: boolean;
};

export default function GroupMembersSection({
  balances,
  currentUserId,
  groupId,
  isActive,
  hasExpenses = false,
}: Props) {
  return (
    <section className="px-4 py-1 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">

        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <GroupMembersSidebar
            balances={balances}
            currentUserId={currentUserId}
            groupId={groupId}
            isActive={isActive}
            hasExpenses={hasExpenses}
          />
        </div>
      </div>
    </section>
  );
}