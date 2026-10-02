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
    <section className="px-4 py-6 md:px-8 lg:px-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Members
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          View group members, balances, and manage membership.
        </p>
      </div>

      <div className="w-full max-w-4xl rounded-xl border bg-white p-4 md:p-6">
        <GroupMembersSidebar
          balances={balances}
          currentUserId={currentUserId}
          groupId={groupId}
          isActive={isActive}
          hasExpenses={hasExpenses}
        />
      </div>
    </section>
  );
}   