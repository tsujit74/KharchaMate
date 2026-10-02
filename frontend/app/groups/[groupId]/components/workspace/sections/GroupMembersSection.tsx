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
    <section className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="border-b border-slate-200 pb-5">
          <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
            Members
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            View group members, balances, and manage membership.
          </p>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
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