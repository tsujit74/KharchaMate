"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import {
  blockGroupAdmin,
  getGroupDetailsAdmin,
  GroupDetailsResponse,
  unblockGroupAdmin,
} from "@/app/services/admin.service";
import {
  Users,
  IndianRupee,
  Ticket,
  Lock,
  Unlock,
  ArrowLeft,
  RefreshCw,
  Receipt,
  Eye,
} from "lucide-react";
import Link from "next/link";

function formatDate(value?: string): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

function formatAmount(value?: number): string {
  if (value === undefined || value === null) return "₹0";
  return `₹${Number(value)
    .toFixed(2)
    .replace(/\d(?=(\d{3})+\.)/g, "$&,")}`;
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      {/* TOP */}
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
          {label}
        </p>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white">
          {icon}
        </div>
      </div>

      {/* VALUE */}
      <div className="mt-4">
        <p className="break-words text-xl font-black leading-tight text-slate-950 sm:text-xl xl:text-1xl">
          {value}
        </p>
      </div>
    </div>
  );
}

export default function AdminGroupDetailsPage() {
  const { groupId } = useParams();
  const [data, setData] = useState<GroupDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const fetchGroupDetails = async () => {
    try {
      setLoading(true);
      const response = await getGroupDetailsAdmin(groupId as string, {
        page,
        limit,
      });
      setData(response);
    } catch (err: any) {
      const msg =
        err.message === "UNAUTHORIZED"
          ? "Unauthorized access"
          : err.message === "FORBIDDEN"
            ? "Forbidden"
            : "Failed to load group details";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (groupId) fetchGroupDetails();
  }, [groupId, page, limit]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 text-sm font-medium text-slate-600 shadow-sm">
          Loading group details...
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-600 shadow-sm">
          Group not found or data unavailable
        </div>
      </div>
    );
  }

  const { group, expenses, pagination } = data;

  return (
    <div className="min-h-screen bg-slate-50 px-3 py-3 md:px-4 md:py-4">
      <div className="mx-auto max-w-[1400px] space-y-4">
        {/* Header bar */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-950">Group Details</h1>
            <p className="text-sm text-slate-500">
              View and manage group information
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>

            <button
              disabled={loading}
              onClick={fetchGroupDetails}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>

            <button
              disabled={loading}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
                group.isBlocked
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
              onClick={async (e) => {
                e.preventDefault();
                try {
                  await (group.isBlocked
                    ? unblockGroupAdmin(group._id)
                    : blockGroupAdmin(group._id));
                  toast.success(
                    group.isBlocked ? "Group unblocked" : "Group blocked",
                  );
                  fetchGroupDetails();
                } catch {
                  toast.error("Action failed");
                }
              }}
            >
              {loading ? (
                "Processing..."
              ) : group.isBlocked ? (
                <>
                  <Unlock className="h-4 w-4" />
                  Unblock
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  Block
                </>
              )}
            </button>
          </div>
        </div>

        {/* Main layout */}
        <div className="grid gap-4">
          <div className="min-w-0 space-y-4">
            {/* GROUP OVERVIEW */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-5 2xl:flex-row 2xl:items-start 2xl:justify-between">
                {/* LEFT CONTENT */}
                <div className="min-w-0 flex-1">
                  {/* HEADER */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-lg font-bold text-white">
                      {group.name[0]?.toUpperCase()}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="truncate text-xl font-bold text-slate-950">
                          {group.name}
                        </h2>

                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                            group.isBlocked
                              ? "bg-red-50 text-red-700 ring-1 ring-red-200"
                              : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                          }`}
                        >
                          {group.isBlocked ? "Blocked" : "Active"}
                        </span>
                      </div>

                      <p className="mt-1 text-sm text-slate-500">
                        Created by{" "}
                        <span className="font-medium text-slate-800">
                          {group.createdBy.name}
                        </span>{" "}
                        ({group.createdBy.email})
                      </p>
                    </div>
                  </div>

                  {/* TAGS */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                      {group.totalMembers} Members
                    </span>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                      Created {formatDate(group.createdAt)}
                    </span>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                      Updated {formatDate(group.updatedAt)}
                    </span>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                      ID: {group._id}
                    </span>
                  </div>

                  {/* MEMBERS */}
                  <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-xs font-bold uppercase tracking-wide text-slate-600">
                        Members
                      </h3>

                      <span className="text-xs text-slate-500">
                        {group.members.length} total
                      </span>
                    </div>

                    <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                      {group.members.map((member) => (
                        <div
                          key={member._id}
                          className="rounded-lg border border-slate-200 bg-white px-3 py-2"
                        >
                          <div className="flex items-start justify-between gap-2">
                            {/* USER INFO */}
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-slate-800">
                                {member.name}
                              </p>

                              <p className="truncate text-[11px] text-slate-500">
                                {member.email}
                              </p>
                            </div>

                            {/* ACTION */}
                            <Link
                              href={`/admin/users/${member._id}`}
                              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-2 gap-1 2xl:w-[320px]">
                  <StatCard
                    label="Members"
                    value={group.totalMembers ?? 0}
                    icon={<Users className="h-5 w-5" />}
                  />

                  <StatCard
                    label="Expenses"
                    value={formatAmount(group.totalExpenses ?? 0)}
                    icon={<IndianRupee className="h-5 w-5" />}
                  />

                  <StatCard
                    label="Entries"
                    value={expenses.length}
                    icon={<Ticket className="h-5 w-5" />}
                  />

                  <StatCard
                    label="Records"
                    value={pagination.total}
                    icon={<Receipt className="h-5 w-5" />}
                  />
                </div>
              </div>
            </div>

            {/* EXPENSE TABLE */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              {/* HEADER */}
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    Expenses
                  </h3>

                  <p className="text-sm text-slate-500">
                    Showing {expenses.length} of {pagination.total} records
                  </p>
                </div>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  Page {pagination.page} / {pagination.totalPages}
                </span>
              </div>

              {/* TABLE */}
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-50 text-slate-600">
                    <tr>
                      <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.1em]">
                        Date
                      </th>

                      <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.1em]">
                        Description
                      </th>

                      <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.1em]">
                        Category
                      </th>

                      <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.1em]">
                        Paid By
                      </th>

                      <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-[0.1em]">
                        Amount
                      </th>

                      <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.1em]">
                        Split Details
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100 bg-white">
                    {expenses.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-4 py-10 text-center text-sm text-slate-500"
                        >
                          No expenses found.
                        </td>
                      </tr>
                    ) : (
                      expenses.map((exp) => (
                        <tr key={exp._id} className="hover:bg-slate-50">
                          <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500">
                            {formatDate(exp.createdAt)}
                          </td>

                          <td className="px-4 py-3">
                            <p className="font-medium text-slate-900">
                              {exp.description}
                            </p>
                          </td>

                          <td className="px-4 py-3">
                            <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-medium capitalize text-slate-700">
                              {exp.category.toLowerCase()}
                            </span>
                          </td>

                          <td className="px-4 py-3">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-slate-800">
                                {exp.paidBy.name}
                              </p>

                              <p className="truncate text-xs text-slate-500">
                                {exp.paidBy.email}
                              </p>
                            </div>
                          </td>

                          <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-semibold text-slate-900">
                            {formatAmount(exp.amount)}
                          </td>

                          <td className="px-4 py-3">
                            <div className="space-y-1">
                              {exp.splitBetween.map((spl) => (
                                <div
                                  key={spl._id}
                                  className="flex items-center justify-between gap-2 text-xs"
                                >
                                  <span className="truncate text-slate-700">
                                    {spl.user.name}
                                  </span>

                                  <span className="font-medium text-slate-900">
                                    ₹{spl.amount.toFixed(2)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION */}
              <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3">
                <p className="text-sm text-slate-500">
                  Showing {expenses.length} results
                </p>

                <div className="flex items-center gap-2">
                  <button
                    disabled={pagination.page <= 1}
                    onClick={() => setPage(pagination.page - 1)}
                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>

                  <button
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => setPage(pagination.page + 1)}
                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
