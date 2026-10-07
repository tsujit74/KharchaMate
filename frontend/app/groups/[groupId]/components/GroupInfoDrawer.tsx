"use client";

import { useEffect, useMemo, useState } from "react";
import {
  X,
  Shield,
  UserMinus,
  UserPlus,
  Crown,
  Loader2,
  Info,
} from "lucide-react";
import Link from "next/link";
import {
  removeMember,
  toggleGroupStatus,
  updateGroupType,
} from "@/app/services/group.service";
import toast from "react-hot-toast";
import { useConfirm } from "@/app/context/ConfirmContext";

const roleBadgeStyle: Record<string, string> = {
  CREATOR: "bg-purple-50 text-purple-700 ring-purple-200",
  ADMIN: "bg-blue-50 text-blue-700 ring-blue-200",
  MEMBER: "bg-slate-100 text-slate-600 ring-slate-200",
};

const TYPE_OPTIONS = [
  { value: "NORMAL", label: "Normal" },
  { value: "ONGOING", label: "Ongoing" },
] as const;

export default function GroupInfoDrawer({
  open,
  onClose,
  group,
  currentUserId,
  onRefresh,
}: any) {
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [typeLoading, setTypeLoading] = useState(false);

  const { confirm } = useConfirm();

  const [selectedType, setSelectedType] = useState<"NORMAL" | "ONGOING" | "">(
    group?.typeConfigured === true ? (group?.type ?? "") : "",
  );

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    setSelectedType(group?.typeConfigured === true ? (group?.type ?? "") : "");
  }, [group?.type, group?.typeConfigured]);

  const admins = group?.admins ?? [];
  const members = group?.members ?? [];

  const isAdmin = admins.some((a: any) => a._id === currentUserId);
  const isActive = group?.isActive !== false;
  const hasExpenses = (group?.expenseCount ?? 0) > 0;

  const enrichedMembers = useMemo(() => {
    if (!group) return [];

    return members.map((m: any) => {
      const creator = group.createdBy?._id === m._id;
      const admin = admins.some((a: any) => a._id === m._id);

      return {
        ...m,
        role: creator ? "CREATOR" : admin ? "ADMIN" : "MEMBER",
      };
    });
  }, [group, members, admins]);

  if (!group) return null;

  const typeConfigured = group?.typeConfigured === true;

  const canEditType = isAdmin && (!hasExpenses || !typeConfigured);

  const typeChanged =
    !!selectedType && (!typeConfigured || selectedType !== group.type);

  const typeHint = hasExpenses
    ? typeConfigured
      ? "Locked after expenses are added"
      : "Type not set. Choose once to configure group"
    : !isAdmin
      ? "Only admins can change this"
      : typeConfigured
        ? "Can be changed until the first expense"
        : "Not set yet. Choose a type";

  const handleUpdateType = async () => {
    if (!isAdmin || !selectedType || typeLoading) return;

    if (hasExpenses && typeConfigured) return;

    if (typeConfigured && selectedType === group.type) return;

    try {
      setTypeLoading(true);

      await updateGroupType(group._id, selectedType);
      await onRefresh();

      toast.success("Group type updated");
    } catch (err: any) {
      toast.error(err?.message || "Failed to update group type");
    } finally {
      setTypeLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!isAdmin || statusLoading) return;

    if (isActive) {
      const confirmed = await confirm({
        title: "Close Group",
        message:
          "Closing this group will disable all actions and put it in view-only mode. Continue?",
        confirmText: "Close Group",
        cancelText: "Cancel",
        variant: "warning",
      });

      if (!confirmed) return;
    }

    try {
      setStatusLoading(true);

      await toggleGroupStatus(group._id);
      await onRefresh();

      toast.success(isActive ? "Group closed" : "Group reactivated");
    } catch (err: any) {
      toast.error(err?.message || "Failed to update status");
    } finally {
      setStatusLoading(false);
    }
  };

  const handleRemove = async (userId: string) => {
    if (!isActive) return toast.error("Group is closed");

    if (hasExpenses) {
      return toast.error("Cannot remove members after expenses");
    }

    const member = members.find((m: any) => m._id === userId);

    const confirmed = await confirm({
      title: "Remove Member",
      message: `Are you sure you want to remove "${member?.name ?? "this member"}" from the group?`,
      confirmText: "Remove Member",
      cancelText: "Cancel",
      variant: "danger",
    });

    if (!confirmed) return;

    try {
      setLoadingUserId(userId);

      await removeMember(group._id, userId);
      await onRefresh();

      toast.success("Member removed");
    } catch (err: any) {
      toast.error(err?.message || "Failed");
    } finally {
      setLoadingUserId(null);
    }
  };

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out sm:w-[420px] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-slate-900">
              Group info
            </h2>

            <p className="text-xs text-slate-500">Manage members & settings</p>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && isActive && (
              <Link
                href={`/groups/${group._id}/add-member`}
                aria-label="Add member"
                title="Add member"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              >
                <UserPlus className="h-4 w-4" />
              </Link>
            )}

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-base font-semibold uppercase text-white">
              {group.name?.charAt(0)}
            </span>

            <div className="min-w-0">
              <h3
                title={group.name}
                className="truncate text-lg font-semibold tracking-tight text-slate-900"
              >
                {group.name}
              </h3>

              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
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

                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    !typeConfigured
                      ? "bg-amber-50 text-amber-700"
                      : group.type === "ONGOING"
                        ? "bg-blue-50 text-blue-700"
                        : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {!typeConfigured
                    ? "Not set"
                    : group.type === "ONGOING"
                      ? "Ongoing"
                      : "Normal"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Group status
              </p>

              <p className="mt-0.5 text-xs text-slate-500">
                {isActive ? "Members can add expenses" : "View only mode"}
              </p>
            </div>

            {isAdmin && (
              <button
                type="button"
                role="switch"
                aria-checked={isActive}
                aria-label="Toggle group status"
                onClick={handleToggleStatus}
                disabled={statusLoading}
                className={`relative h-6 w-11 shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${
                  isActive ? "bg-emerald-500" : "bg-slate-300"
                }`}
              >
                <span
                  className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                    isActive ? "translate-x-5" : ""
                  }`}
                />
              </button>
            )}
          </div>

          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900">
                  Group type
                </p>
                <p className="text-xs leading-snug text-slate-500">
                  {typeHint}
                </p>
              </div>

              <div
                role="group"
                aria-label="Group type"
                className="inline-flex shrink-0 rounded-lg bg-slate-100 p-0.5"
              >
                {TYPE_OPTIONS.map((opt) => {
                  const selected = selectedType === opt.value;

                  return (
                    <button
                      key={opt.value}
                      type="button"
                      aria-pressed={selected}
                      disabled={!canEditType || typeLoading}
                      onClick={() => setSelectedType(opt.value)}
                      className={`rounded-md px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:cursor-not-allowed disabled:opacity-60 ${
                        selected
                          ? "bg-white text-slate-900 shadow-sm"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {canEditType && typeChanged && (
              <div className="mt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setSelectedType(typeConfigured ? (group.type ?? "") : "")
                  }
                  disabled={typeLoading}
                  className="h-8 rounded-lg px-3 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 disabled:opacity-60"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleUpdateType}
                  disabled={typeLoading}
                  className="inline-flex h-8 min-w-[64px] items-center justify-center rounded-lg bg-slate-900 px-3 text-xs font-medium text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {typeLoading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    "Save"
                  )}
                </button>
              </div>
            )}
          </div>

          <div>
            <div className="mb-3 flex items-center gap-2">
              <p className="text-sm font-semibold text-slate-900">Members</p>

              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium tabular-nums text-slate-600">
                {members.length}
              </span>
            </div>

            <div className="space-y-2.5">
              {enrichedMembers.map((m: any) => {
                const isYou = m._id === currentUserId;

                return (
                  <div
                    key={m._id}
                    className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 transition-shadow hover:shadow-sm"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold uppercase text-slate-600">
                      {m.name?.charAt(0)}
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-900">
                        {m.name}

                        {isYou && (
                          <span className="ml-1 font-normal text-slate-500">
                            (You)
                          </span>
                        )}
                      </p>

                      <p className="truncate text-xs text-slate-500">
                        {m.email}
                      </p>

                      {m.mobile && (
                        <p className="truncate text-xs text-slate-500">
                          {m.mobile}
                        </p>
                      )}
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ring-inset ${
                          roleBadgeStyle[m.role]
                        }`}
                      >
                        {m.role === "CREATOR" && <Crown className="h-3 w-3" />}

                        {m.role === "ADMIN" && <Shield className="h-3 w-3" />}

                        {m.role}
                      </span>

                      {isAdmin &&
                        isActive &&
                        m.role !== "CREATOR" &&
                        !isYou && (
                          <button
                            type="button"
                            disabled={loadingUserId === m._id}
                            onClick={() => handleRemove(m._id)}
                            aria-label={`Remove ${m.name}`}
                            title="Remove member"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 disabled:cursor-not-allowed"
                          >
                            {loadingUserId === m._id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <UserMinus className="h-4 w-4" />
                            )}
                          </button>
                        )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2 border-t border-slate-200 bg-slate-50/60 px-5 py-3 text-xs text-slate-500">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />

          <p>Only admins can manage members and group settings.</p>
        </div>
      </aside>
    </>
  );
}
