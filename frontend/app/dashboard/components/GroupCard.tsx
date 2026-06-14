"use client";

import {
  MoreVertical,
  Pencil,
  UserPlus,
  ArrowRight,
  Lock,
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
  return (
    <div
      onClick={onClick}
      className={`group relative p-4 sm:p-6 rounded-[1rem] border cursor-pointer transition-all duration-300 border-t-[6px] ${
        isBlocked
          ? "border-t-red-300 bg-white border-slate-300"
          : isClosed
          ? "border-t-slate-300 bg-slate-50 border-slate-300"
          : "border-t-indigo-300 bg-white border-slate-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-100"
      }`}
    >
      {/* Top badges */}
      <div className="flex items-start justify-between mb-4 sm:mb-5 gap-3">
        <div className="flex flex-wrap gap-2">
          <span
            className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${
              isBlocked
                ? "bg-red-50 text-red-600 border-red-200"
                : isClosed
                ? "bg-slate-100 text-slate-500 border-slate-200"
                : "bg-emerald-50 text-emerald-600 border-emerald-100"
            }`}
          >
            {isBlocked ? "Blocked" : isClosed ? "Archived" : "Active"}
          </span>

          {isCreator && (
            <span className="px-3 py-1 text-[10px] font-bold rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 uppercase tracking-wider">
              Creator
            </span>
          )}
        </div>

        {/* Actions */}
        {!isClosed && !isBlocked && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative"
          >
            <details className="relative">
              <summary className="list-none cursor-pointer p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition">
                <MoreVertical className="w-4 h-4" />
              </summary>

              <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-20">
                {isAdmin && (
                  <button
                    onClick={onEdit}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-xl hover:bg-slate-50 transition"
                  >
                    <Pencil className="w-4 h-4 text-slate-500" />
                    Edit Name
                  </button>
                )}

                {isAdmin && (
                  <button className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-xl hover:bg-slate-50 transition">
                    <UserPlus className="w-4 h-4 text-slate-500" />
                    Add Member
                  </button>
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

      {/* Title */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 group-hover:text-indigo-600 transition-colors tracking-tight">
            {group.name}
            {(isClosed || isBlocked) && (
              <Lock
                className={`w-3.5 h-3.5 ${
                  isBlocked ? "text-red-500" : "text-slate-400"
                }`}
              />
            )}
          </h2>

          <p className="text-xs text-slate-400">
            Updated {new Date(group.updatedAt).toLocaleDateString()}
          </p>
        </div>

        <div className="text-right">
          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
            Total
          </p>

          <p
            className={`text-base font-extrabold tracking-tight ${
              group.totalExpenses > 0
                ? "text-emerald-600"
                : "text-slate-400"
            }`}
          >
            ₹{group.totalExpenses.toLocaleString()}
          </p>

          <p className="text-[10px] font-medium text-slate-400 mt-0.5">
            {group.expenseCount} expenses
          </p>
        </div>
      </div>

      {/* Members */}
      <div className="flex items-center justify-between mt-5 sm:mt-6">
        <div className="flex -space-x-3">
          {group.members.slice(0, 4).map((m, i) => (
            <div
              key={m._id}
              className="h-9 w-9 flex items-center justify-center rounded-full bg-slate-100 border-2 border-white text-xs font-semibold text-slate-600"
              style={{ zIndex: 4 - i }}
            >
              {m.name?.[0]?.toUpperCase()}
            </div>
          ))}

          {group.members.length > 4 && (
            <div className="h-9 w-9 flex items-center justify-center rounded-full bg-slate-50 border-2 border-white text-[10px] font-semibold text-slate-400">
              +{group.members.length - 4}
            </div>
          )}
        </div>

        <ArrowRight className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
      </div>

      {/* Footer */}
      <p className="text-xs text-slate-500 mt-2 font-medium">
        {group.members.length} members
      </p>
    </div>
  );
}