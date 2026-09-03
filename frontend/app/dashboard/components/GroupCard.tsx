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
};

export default function GroupCard({
  group,
  isBlocked,
  isClosed,
  isAdmin,
  isCreator,
  onClick,
  onEdit,
}: Props) {
  const { budget, totalExpenses, expenseCount, members, name, updatedAt } =
    group;

 const hasBudget = typeof budget === "number" && budget > 0;

const remaining = hasBudget
  ? budget - totalExpenses
  : null;

const percentage = hasBudget
  ? (totalExpenses / budget) * 100
  : 0;

const progressWidth = Math.min(percentage, 100);

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

const percentageColor =
  percentage <= 50
    ? "text-blue-600"
    : percentage <= 80
      ? "text-amber-600"
      : percentage <= 100
        ? "text-orange-600"
        : "text-red-600";

  // const remaining = hasBudget ? budget - totalExpenses : null;

  // const percentage = hasBudget ? (totalExpenses / budget) * 100 : null;

  // const progressWidth = percentage !== null ? Math.min(percentage, 100) : 0;

  const isOverBudget = hasBudget && totalExpenses > budget;

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
      className={`group relative rounded-2xl border border-slate-200 bg-white border-t-4 transition-all duration-200 ${
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
            className={`inline-flex items-center px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${statusConfig.badge}`}
          >
            {statusConfig.label}
          </span>

          {isCreator && (
            <span className="inline-flex items-center px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border bg-indigo-50 text-indigo-700 border-indigo-200">
              Creator
            </span>
          )}
        </div>

        {!isClosed && !isBlocked && (
          <div onClick={(e) => e.stopPropagation()} className="relative">
            <details className="relative">
              <summary className="list-none cursor-pointer p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition">
                <MoreVertical className="w-4 h-4" />
              </summary>

              <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 z-20">
                {isAdmin && (
                  <>
                    <button
                      onClick={onEdit}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-slate-50 transition"
                    >
                      <Pencil className="w-4 h-4 text-slate-500" />
                      Edit Name
                    </button>

                    <button className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-slate-50 transition">
                      <UserPlus className="w-4 h-4 text-slate-500" />
                      Add Member
                    </button>
                  </>
                )}

                {!isAdmin && (
                  <div className="px-3 py-2 text-xs text-slate-400">
                    Admin only actions
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
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2 group-hover:text-indigo-600 transition-colors tracking-tight">
              <span className="truncate">{name}</span>

              {(isClosed || isBlocked) && (
                <Lock
                  className={`w-3.5 h-3.5 shrink-0 ${
                    isBlocked ? "text-red-500" : "text-slate-400"
                  }`}
                />
              )}
            </h2>

            <p className="text-[11px] text-slate-400 mt-1">
              Updated {new Date(updatedAt).toLocaleDateString()}
            </p>
          </div>

          <div className="text-right shrink-0">
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

{hasBudget && (
  <div className="mt-4">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-1.5">
        <span className="text-[11px] font-medium text-slate-500">
          Budget
        </span>

        <span className="text-[11px] font-semibold text-slate-700">
          ₹{budget.toLocaleString()}
        </span>
      </div>

      <span
        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${percentageColor} ${
          percentage <= 50
            ? "bg-blue-50"
            : percentage <= 80
              ? "bg-amber-50"
              : percentage <= 100
                ? "bg-orange-50"
                : "bg-red-50"
        }`}
      >
        {Math.round(percentage)}%
      </span>
    </div>

    <div
      className={`relative h-2 rounded-full ${progressTrack}`}
    >
      <div
        className={`absolute left-0 top-0 h-full rounded-full ${progressColor} transition-all duration-500`}
        style={{
          width: `${progressWidth}%`,
        }}
      />

      {percentage > 0 && (
        <div
          className={`absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full border-2 border-white shadow-sm ${progressColor}`}
          style={{
            left: `calc(${progressWidth}% - 6px)`,
          }}
        />
      )}
    </div>

    <div className="flex items-center justify-between mt-1.5">
      <span className="text-[10px] text-slate-400">
        ₹{totalExpenses.toLocaleString()} spent
      </span>

      <span
        className={`text-[10px] font-medium ${
          percentage > 100
            ? "text-red-500"
            : "text-slate-400"
        }`}
      >
        {percentage > 100
          ? `₹${Math.abs(remaining!).toLocaleString()} over`
          : `₹${remaining!.toLocaleString()} left`}
      </span>
    </div>
  </div>
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
                  className="h-7 w-7 flex items-center justify-center rounded-full bg-slate-100 border-2 border-white text-[10px] font-semibold text-slate-600 overflow-hidden"
                  style={{ zIndex: 4 - index }}
                  title={member.name}
                >
                  {member.avatar ? (
                    <img
                      src={member.avatar}
                      alt={member.name || "Member"}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        e.currentTarget.parentElement?.classList.add(
                          "avatar-fallback",
                        );
                      }}
                    />
                  ) : (
                    initial
                  )}
                </div>
              );
            })}

            {members.length > 4 && (
              <div className="h-7 w-7 flex items-center justify-center rounded-full bg-slate-50 border-2 border-white text-[9px] font-semibold text-slate-500">
                +{members.length - 4}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <Users className="w-3.5 h-3.5" />

            <span className="font-medium">
              {members.length} {members.length === 1 ? "member" : "members"}
            </span>

            <ArrowRight className="w-3.5 h-3.5 text-slate-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </div>
    </div>
  );
}
