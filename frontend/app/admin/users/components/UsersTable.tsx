"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  Ban,
  CheckCircle2,
  UserCog,
  CalendarDays,
  Clock3,
  Phone,
  Mail,
  Hash,
} from "lucide-react";

type User = {
  _id: string;
  name: string;
  email: string;
  mobile?: string;
  role: string;
  isBlocked: boolean;
  createdAt: string;
  updatedAt?: string;
  lastLoginAt?: string;
};

type Props = {
  users: User[];
  actionLoading: string | null;
  handleBlock: (id: string) => void;
  handleUnblock: (id: string) => void;
};

// function formatDate(value?: string) {
//   if (!value) return "—";
//   const d = new Date(value);
//   if (Number.isNaN(d.getTime())) return "—";
//   return new Intl.DateTimeFormat("en-IN", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   }).format(d);
// }

function formatDateTime(value?: string) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

function formatDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

function shortId(id: string) {
  return id.length > 10 ? `${id.slice(0, 4)}…${id.slice(-4)}` : id;
}

function UsersTable({
  users,
  actionLoading,
  handleBlock,
  handleUnblock,
}: Props) {
  const router = useRouter();

  if (!users.length) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-sm font-semibold text-slate-900">No users found</p>
        <p className="mt-1 text-sm text-slate-500">
          No matching records in the current filter.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50">
            <tr className="text-left text-[11px] uppercase tracking-wider text-slate-500">
              <th className="whitespace-nowrap px-3 py-3 font-semibold">
                User
              </th>
              <th className="whitespace-nowrap px-3 py-3 font-semibold">
                Contact
              </th>
              <th className="whitespace-nowrap px-3 py-3 font-semibold">ID</th>
              <th className="whitespace-nowrap px-3 py-3 font-semibold">
                Role
              </th>
              <th className="whitespace-nowrap px-3 py-3 font-semibold">
                Status
              </th>
              <th className="whitespace-nowrap px-3 py-3 font-semibold">
                Joined
              </th>
              <th className="whitespace-nowrap px-3 py-3 font-semibold lg:table-cell">
                Last login
              </th>
              <th className="whitespace-nowrap px-3 py-3 font-semibold lg:table-cell">
                Updated
              </th>
              <th className="whitespace-nowrap px-3 py-3 font-semibold text-right">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {users.map((user) => (
              <tr
                key={user._id}
                onClick={() => router.push(`/admin/users/${user._id}`)}
                className="cursor-pointer transition hover:bg-slate-50"
              >
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white">
                      <UserCog className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-950">
                        {user.name}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-3 py-3 text-slate-600">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-slate-400" />
                      <span>{user.mobile || "—"}</span>
                    </div>
                    <div className="flex items-center gap-1.5 lg:hidden">
                      <Mail className="h-3.5 w-3.5 text-slate-400" />
                      <span className="truncate text-xs">{user.email}</span>
                    </div>
                  </div>
                </td>

                <td className="px-3 py-3">
                  <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 font-mono text-[11px] text-slate-600">
                    <Hash className="h-3 w-3" />
                    {shortId(user._id)}
                  </span>
                </td>

                <td className="px-3 py-3">
                  <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold capitalize text-slate-700">
                    {user.role}
                  </span>
                </td>

                <td className="px-3 py-3">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      user.isBlocked
                        ? "bg-red-50 text-red-700 ring-1 ring-red-200"
                        : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        user.isBlocked ? "bg-red-500" : "bg-emerald-500"
                      }`}
                    />
                    {user.isBlocked ? "Blocked" : "Active"}
                  </span>
                </td>

                <td className="px-3 py-3 text-slate-600">
                  <div className="flex items-center gap-1.5 whitespace-nowrap">
                    <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                    {formatDate(user.createdAt)}
                  </div>
                </td>

                <td className="hidden px-3 py-3 text-slate-600 lg:table-cell">
                  <div className="flex items-center gap-1.5 whitespace-nowrap">
                    <Clock3 className="h-3.5 w-3.5 text-slate-400" />
                    {formatDate(user.lastLoginAt)}
                  </div>
                </td>

                <td className="hidden px-3 py-3 text-slate-600 lg:table-cell">
                  <div className="flex items-center gap-1.5 whitespace-nowrap">
                    <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                    {formatDate(user.updatedAt)}
                  </div>
                </td>

                <td className="px-3 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/admin/users/${user._id}`);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11px] font-medium text-slate-700 transition hover:bg-slate-100"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View
                    </button>

                    <button
                      disabled={actionLoading === user._id}
                      onClick={(e) => {
                        e.stopPropagation();
                        user.isBlocked
                          ? handleUnblock(user._id)
                          : handleBlock(user._id);
                      }}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
                        user.isBlocked
                          ? "bg-emerald-600 hover:bg-emerald-700"
                          : "bg-red-600 hover:bg-red-700"
                      }`}
                    >
                      {actionLoading === user._id ? (
                        "..."
                      ) : user.isBlocked ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Unblock
                        </>
                      ) : (
                        <>
                          <Ban className="h-3.5 w-3.5" />
                          Block
                        </>
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default React.memo(UsersTable);
