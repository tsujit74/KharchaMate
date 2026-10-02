"use client";

import Link from "next/link";
import { Info, UserPlus } from "lucide-react";
import MemberCard from "./sidebar/MemberCard";

import type { GroupMember } from "../types/group.types";

type Props = {
  balances: GroupMember[];
  currentUserId?: string;
  groupId: string;
  isActive: boolean;
  hasExpenses?: boolean;
};

export default function GroupMembersSidebar({
  balances,
  currentUserId,
  groupId,
  isActive,
  hasExpenses = false,
}: Props) {
  const disableAddMember = !isActive || hasExpenses;

  const disabledReason = !isActive
    ? "Group is closed"
    : "Members can't be added once expenses exist";

  return (
    <div>
      <div className="flex flex-col gap-4 border-b border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
        <div className="flex flex-wrap items-center gap-2.5">
          <h2 className="text-base font-semibold text-slate-900">
            Group members
          </h2>

          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium tabular-nums text-slate-600">
            {balances.length}
          </span>

          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
              isActive
                ? "bg-emerald-50 text-emerald-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isActive ? "bg-emerald-500" : "bg-red-500"
              }`}
            />
            {isActive ? "Active" : "Closed"}
          </span>
        </div>

        <Link
          href={!disableAddMember ? `/groups/${groupId}/add-member` : "#"}
          onClick={(e) => {
            if (disableAddMember) e.preventDefault();
          }}
          aria-disabled={disableAddMember}
          title={disableAddMember ? disabledReason : undefined}
          className={`inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 sm:w-auto ${
            disableAddMember
              ? "cursor-not-allowed bg-slate-100 text-slate-400"
              : "bg-slate-900 text-white shadow-sm hover:bg-slate-800"
          }`}
        >
          <UserPlus className="h-4 w-4" />
          Add Member
        </Link>
      </div>

      <div className="grid gap-3 p-4 sm:p-6 lg:grid-cols-2">
        {balances.map((member) => (
          <MemberCard
            key={member.id}
            member={member}
            currentUserId={currentUserId}
          />
        ))}
      </div>

      <div className="flex items-start gap-2 border-t border-slate-100 bg-slate-50/60 px-4 py-3 text-xs text-slate-500 sm:px-6">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        <p>
          Only <span className="font-semibold text-slate-700">ADMIN</span> can
          activate or close this group.
        </p>
      </div>
    </div>
  );
}
