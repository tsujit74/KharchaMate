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
} from "lucide-react";

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
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
        {label}
      </p>
      <div className="mt-3 flex items-end justify-between gap-3">
        <p className="text-2xl font-black tracking-tight text-slate-950">
          {value}
        </p>
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white">
          {icon}
        </div>
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
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_20px]">
          <div className="min-w-0 space-y-4">
            {/* Group overview card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex min-w-0 items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-lg font-bold text-white">
                    {group.name[0]?.toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="truncate text-xl font-bold text-slate-950">
                        {group.name}
                      </h2>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold ${
                          group.isBlocked
                            ? "bg-red-50 text-red-700 ring-1 ring-red-200"
                            : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                        }`}
                      >
                        {group.isBlocked ? "Blocked" : "Active"}
                      </span>
                    </div>

                    <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                      <span>Created by</span>
                      <span className="font-medium text-slate-800">
                        {group.createdBy.name}
                      </span>
                      <span>({group.createdBy.email})</span>
                    </p>

                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-700">
                        {group.totalMembers} members
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                        Created {formatDate(group.createdAt)}
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                        Last updated {formatDate(group.updatedAt)}
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                        Group ID : {(group._id)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 w-full lg:w-[520px] xl:w-[560px]">
                  <StatCard
                    label="Members"
                    value={group.totalMembers ?? 0}
                    icon={<Users className="h-5 w-5" />}
                  />
                  <StatCard
                    label="Total Expenses"
                    value={formatAmount(group.totalExpenses ?? 0)}
                    icon={<IndianRupee className="h-5 w-5" />}
                  />
                  <StatCard
                    label="Expenses Count"
                    value={expenses.length}
                    icon={<Ticket className="h-5 w-5" />}
                  />
                  <StatCard
                    label="Total Records"
                    value={`${pagination.total} entries`}
                    icon={<IndianRupee className="h-5 w-5" />}
                  />
                </div>
              </div>
            </div>

            {/* Expenses table */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-slate-950">
                  Expenses
                </h3>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  {expenses.length} of {pagination.total}
                </span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
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
          Paid by
        </th>
        <th className="w-[120px] px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-[0.1em]">
          Amount
        </th>
        <th className="w-[240px] px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.1em]">
          Split
        </th>
      </tr>
    </thead>
    <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
      {expenses.length === 0 ? (
        <tr>
          <td
            colSpan={6}
            className="px-4 py-10 text-center text-sm text-slate-500"
          >
            No expenses in this group.
          </td>
        </tr>
      ) : (
        expenses.map((exp) => (
          <tr
            key={exp._id}
            className="transition hover:bg-slate-25 hover:bg-opacity-60"
          >
            <td className="px-4 py-3 text-xs text-slate-600">
              {formatDate(exp.createdAt)}
            </td>
            <td className="px-4 py-3 text-sm text-slate-900 font-medium">
              {exp.description}
            </td>
            <td className="px-4 py-3 text-xs text-slate-600 capitalize">
              {exp.category.toLowerCase()}
            </td>
            <td className="px-4 py-3 text-sm text-slate-800 font-medium">
              <div className="min-w-0">
                <p className="truncate">{exp.paidBy.name}</p>
                <p className="truncate text-xs text-slate-500">
                  {exp.paidBy.email}
                </p>
              </div>
            </td>
            <td className="px-4 py-3 text-right text-sm font-medium text-slate-900">
              {formatAmount(exp.amount)}
            </td>
            <td className="px-4 py-3 text-xs text-slate-600">
              <p className="mb-1">
                Split among {exp.splitBetween.length} people
              </p>
              <div className="space-y-0.5 text-xs">
                {exp.splitBetween.map((spl) => (
                  <div key={spl._id} className="truncate">
                    <span className="text-slate-800 font-medium">
                      {spl.user.name}
                    </span>:
                    <span className="ml-1 text-slate-700 font-medium">
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

              {/* Pagination */}
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                <div className="text-sm text-slate-500">
                  Showing {expenses.length} of {pagination.total}
                </div>
                <div className="flex gap-2">
                  <button
                    disabled={pagination.page <= 1}
                    onClick={() => setPage(pagination.page - 1)}
                    className="rounded-lg px-4 py-1.5 text-sm text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <button
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => setPage(pagination.page + 1)}
                    className="rounded-lg px-4 py-1.5 text-sm text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
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
