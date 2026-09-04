"use client";

import {
  MoreVertical,
  Pencil,
  UserPlus,
  ArrowRight,
  Lock,
  Users,
} from "lucide-react";

import { Group } from "../types/dashboard.types";

type Props = {
  group: Group;
  isBlocked: boolean;
  isClosed: boolean;
  isAdmin: boolean;
  isCreator: boolean;
  onClick: () => void;
  onEdit: () => void;
  onSetBudget: () => void;
  onAddMember:()=>void;
};

export default function GroupCard({
  group,
  isBlocked,
  isClosed,
  isAdmin,
  isCreator,
  onClick,
  onEdit,
  onSetBudget,
  onAddMember,
}: Props) {
  const {
    budget,
    totalExpenses,
    expenseCount,
    remainingBudget,
    members,
    name,
    updatedAt,
  } = group;

  const hasBudget = typeof budget === "number" && budget > 0;

  const percentage = hasBudget ? (totalExpenses / budget) * 100 : 0;

  const progressWidth = Math.min(percentage, 100);

  const isOverBudget = hasBudget && remainingBudget < 0;

  const progressColor =
    percentage <= 50
      ? "bg-blue-500"
      : percentage <= 80
        ? "bg-amber-400"
        : percentage <= 100
          ? "bg-orange-500"
          : "bg-red-500";

  const progressTrack =
    percentage <= 50
      ? "bg-blue-50"
      : percentage <= 80
        ? "bg-amber-50"
        : percentage <= 100
          ? "bg-orange-50"
          : "bg-red-50";

  const percentageBadge =
    percentage <= 50
      ? "bg-blue-50 text-blue-600"
      : percentage <= 80
        ? "bg-amber-50 text-amber-600"
        : percentage <= 100
          ? "bg-orange-50 text-orange-600"
          : "bg-red-50 text-red-600";

  const statusConfig = isBlocked
    ? {
        label: "Blocked",
        badge: "bg-red-50 text-red-700 border-red-200",
        topBorder: "border-t-red-400",
      }
    : isClosed
      ? {
          label: "Archived",
          badge: "bg-slate-100 text-slate-600 border-slate-200",
          topBorder: "border-t-slate-300",
        }
      : {
          label: "Active",
          badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
          topBorder: "border-t-emerald-400",
        };

  return (
    <div
      onClick={onClick}
      className={`group relative cursor-pointer rounded-2xl border border-slate-200 bg-white border-t-4 transition-all duration-200 ${
        statusConfig.topBorder
      } ${
        isClosed || isBlocked
          ? ""
          : "hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/60"
      }`}
    >
      <div className="flex items-center justify-between gap-2 px-5 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${statusConfig.badge}`}
          >
            {statusConfig.label}
          </span>

          {isCreator && (
            <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-700">
              Creator
            </span>
          )}
        </div>

        {!isClosed && !isBlocked && (
  <div
    onClick={(e) => e.stopPropagation()}
    className="relative"
  >
    <details className="group/menu relative">
      <summary
        className="
          list-none cursor-pointer rounded-lg p-1.5
          text-slate-400
          transition-all duration-150
          hover:bg-slate-100 hover:text-slate-600
          [&::-webkit-details-marker]:hidden
        "
        aria-label="Group actions"
      >
        <MoreVertical className="h-4 w-4" />
      </summary>

      <div
        className="
          absolute right-0 z-30 mt-2 w-48
          overflow-hidden rounded-xl
          border border-slate-200
          bg-white p-1.5
          shadow-xl shadow-slate-900/10
          ring-1 ring-slate-900/5
        "
      >
        {isAdmin ? (
          <>
            {/* Edit Name */}
            <button
              type="button"
              onClick={onEdit}
              className="
                flex w-full items-center gap-2.5
                rounded-lg px-3 py-2.5
                text-left text-xs font-medium
                text-slate-700
                transition-colors
                hover:bg-indigo-50 hover:text-indigo-700
                focus:outline-none focus:ring-2 focus:ring-indigo-100
              "
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-50 text-slate-500">
                <Pencil className="h-3.5 w-3.5" />
              </span>

              <span>Edit Name</span>
            </button>

            {/* Add Member */}
            <button
              type="button"
              onClick={onAddMember}
              className="
                flex w-full items-center gap-2.5
                rounded-lg px-3 py-2.5
                text-left text-xs font-medium
                text-slate-700
                transition-colors
                hover:bg-indigo-50 hover:text-indigo-700
                focus:outline-none focus:ring-2 focus:ring-indigo-100
              "
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-50 text-slate-500">
                <UserPlus className="h-3.5 w-3.5" />
              </span>

              <span>Add Member</span>
            </button>

            <div className="my-1.5 border-t border-slate-100" />

            {/* Budget */}
            <button
              type="button"
              onClick={onSetBudget}
              className="
                flex w-full items-center gap-2.5
                rounded-lg px-3 py-2.5
                text-left text-xs font-medium
                text-slate-700
                transition-colors
                hover:bg-indigo-50 hover:text-indigo-700
                focus:outline-none focus:ring-2 focus:ring-indigo-100
              "
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-indigo-50 text-indigo-600">
                <ArrowRight className="h-3.5 w-3.5" />
              </span>

              <span>
                {hasBudget ? "Update Budget" : "Set Budget"}
              </span>
            </button>
          </>
        ) : (
          <div className="px-3 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-100">
                <Lock className="h-3.5 w-3.5 text-slate-400" />
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-600">
                  Admin only
                </p>

                <p className="mt-0.5 text-[10px] text-slate-400">
                  You don't have permission
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </details>
  </div>
)}
      </div>

      <div className="px-5 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="flex items-center gap-2 truncate text-base font-bold tracking-tight text-slate-900 transition-colors group-hover:text-indigo-600 sm:text-lg">
              <span className="truncate">{name}</span>

              {(isClosed || isBlocked) && (
                <Lock
                  className={`h-3.5 w-3.5 shrink-0 ${
                    isBlocked ? "text-red-500" : "text-slate-400"
                  }`}
                />
              )}
            </h2>

            <p className="mt-1 text-[11px] text-slate-400">
              Updated {new Date(updatedAt).toLocaleDateString()}
            </p>
          </div>

          <div className="shrink-0 text-right">
            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
              Total
            </p>

            <p
              className={`text-base font-extrabold tracking-tight ${
                totalExpenses > 0 ? "text-emerald-600" : "text-slate-400"
              }`}
            >
              ₹{totalExpenses.toLocaleString()}
            </p>

            <p className="text-[10px] text-slate-400">
              {expenseCount} {expenseCount === 1 ? "expense" : "expenses"}
            </p>
          </div>
        </div>

        {hasBudget ? (
          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-medium text-slate-500">
                  Budget
                </span>

                <span className="text-[11px] font-semibold text-slate-700">
                  ₹{budget.toLocaleString()}
                </span>
              </div>

              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${percentageBadge}`}
              >
                {Math.round(percentage)}%
              </span>
            </div>

            <div
              className={`relative h-2 overflow-hidden rounded-full ${progressTrack}`}
            >
              <div
                className={`absolute left-0 top-0 h-full rounded-full transition-all duration-500 ${progressColor}`}
                style={{ width: `${progressWidth}%` }}
              />

              {percentage > 0 && (
                <div
                  className={`absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-white shadow-sm ${progressColor}`}
                  style={{
                    left: `calc(${progressWidth}% - 6px)`,
                  }}
                />
              )}
            </div>

            <div className="mt-1.5 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">
                ₹{totalExpenses.toLocaleString()} spent
              </span>

              <span
                className={`text-[10px] font-medium ${
                  isOverBudget ? "text-red-500" : "text-slate-400"
                }`}
              >
                {isOverBudget
                  ? `₹${Math.abs(remainingBudget).toLocaleString()} over`
                  : `₹${remainingBudget.toLocaleString()} left`}
              </span>
            </div>
          </div>
        ) : isAdmin ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSetBudget();
            }}
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg text-[11px] font-semibold text-indigo-600 transition hover:text-indigo-700"
          >
            Set budget
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        ) : (
          <p className="mt-4 text-[11px] text-slate-400">No budget set</p>
        )}

        <div
          className={`flex items-center justify-between ${
            hasBudget ? "mt-4" : "mt-5"
          }`}
        >
          <div className="flex items-center -space-x-2.5">
            {members.slice(0, 4).map((member, index) => {
              const initial =
                member.name?.trim()?.charAt(0).toUpperCase() || "?";

              return (
                <div
                  key={member._id}
                  className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-slate-100 text-[10px] font-semibold text-slate-600"
                  style={{ zIndex: 4 - index }}
                  title={member.name}
                >
                  {member.avatar ? (
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    initial
                  )}
                </div>
              );
            })}

            {members.length > 4 && (
              <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-slate-50 text-[9px] font-semibold text-slate-500">
                +{members.length - 4}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <Users className="h-3.5 w-3.5" />

            <span className="font-medium">
              {members.length} {members.length === 1 ? "member" : "members"}
            </span>

            <ArrowRight className="h-3.5 w-3.5 text-slate-300 transition-all group-hover:translate-x-1 group-hover:text-slate-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
