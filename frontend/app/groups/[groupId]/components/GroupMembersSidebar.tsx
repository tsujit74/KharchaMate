"use client";

import Link from "next/link";
import { UserPlus } from "lucide-react";
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

  return (
    <div className="relative flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-900">
          Group Members
        </h3>

        <span
          className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${
            isActive
              ? "bg-emerald-100 text-emerald-700 border-emerald-300"
              : "bg-red-100 text-red-700 border-red-300"
          }`}
        >
          {isActive ? "Active" : "Closed"}
        </span>
      </div>

      {/* Members List */}
      <div className="space-y-3 flex-1 overflow-y-auto">
        {balances.map((member) => (
          <MemberCard
            key={member.id}
            member={member}
            currentUserId={currentUserId}
          />
        ))}
      </div>

      {/* Add Member */}
      <Link
        href={
          !disableAddMember
            ? `/groups/${groupId}/add-member`
            : "#"
        }
        onClick={(e) => {
          if (disableAddMember) e.preventDefault();
        }}
        className={`mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition ${
          disableAddMember
            ? "border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed"
            : "border-slate-300 text-slate-700 hover:bg-slate-50"
        }`}
      >
        <UserPlus className="w-4 h-4" />
        Add Member
      </Link>

      {/* Footer */}
      <p className="mt-3 text-xs text-slate-500 border-t pt-3">
        ℹ️ Only{" "}
        <span className="font-semibold text-indigo-600">
          ADMIN
        </span>{" "}
        can activate or close this group.
      </p>
    </div>
  );
}