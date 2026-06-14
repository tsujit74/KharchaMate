"use client";

import { useRouter } from "next/navigation";
import { MoreVertical } from "lucide-react";
import GroupCard from "./GroupCard";
import { Group } from "../types/dashboard.types";

type Props = {
  groups: Group[];
  userId?: string;
  onEdit: (groupId: string, groupName: string) => void;
  activeGroups: number;
  archivedGroups: number;
  blockedGroups: number;
};

export default function GroupsSection({
  groups,
  userId,
  onEdit,
  activeGroups,
  archivedGroups,
  blockedGroups,
}: Props) {
  const router = useRouter();

  return (
    <section>
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
          Your Groups
        </h3>

        <span className="text-xs bg-slate-100 text-slate-500 px-3 py-1 rounded-full font-medium border border-slate-200/40">
          {activeGroups} active, {archivedGroups} archived, {blockedGroups} blocked
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {groups.map((group) => {
          const isBlocked = group.isBlocked;
          const isClosed = !group.isActive && !isBlocked;

          const isAdmin =
            group.admins?.includes(userId || "") ?? false;

          const isCreator = group.createdBy === userId;

          return (
            <GroupCard
              key={group._id}
              group={group}
              isBlocked={!!isBlocked}
              isClosed={!!isClosed}
              isAdmin={isAdmin}
              isCreator={isCreator}
              onClick={() =>
                router.push(
                  isBlocked || isClosed
                    ? `/groups/${group._id}?mode=readonly`
                    : `/groups/${group._id}`
                )
              }
              onEdit={() => onEdit(group._id, group.name)}
            />
          );
        })}
      </div>
    </section>
  );
}