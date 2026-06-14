"use client";

import Link from "next/link";
import { Wallet, ShieldCheck } from "lucide-react";
import { PendingSettlement } from "../types/dashboard.types";

type Props = {
  settlements: PendingSettlement[];
  loading: boolean;
  userId?: string;
};

export default function PendingSettlementsSection({
  settlements,
  loading,
  userId,
}: Props) {
  return (
<div className="rounded-2xl border border-slate-200/70 bg-white/80 backdrop-blur-md p-6 shadow-sm flex flex-col h-full">
      
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900 tracking-tight">
          Pending Settlements
        </h3>

        <span className="rounded-md bg-indigo-50 px-2.5 py-0.5 text-[11px] font-bold text-indigo-700 border border-indigo-100">
          {settlements.length} items
        </span>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-sm text-slate-400 font-medium">Loading…</p>
        </div>
      ) : settlements.length === 0 ? (
        /* Empty */
        <div className="flex flex-1 items-center justify-center py-8 text-center">
          <div>
            <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>

            <p className="text-sm font-bold text-slate-800">
              No pending settlements
            </p>

            <p className="mt-1 text-xs text-slate-400 max-w-[240px]">
              Everyone is up to date right now.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {settlements.map((s) => {
            const isUserPayer = s.from === userId;
            const isUserReceiver = s.to === userId;

            const rowClass = isUserPayer
              ? "border-rose-100 bg-rose-50/50 hover:bg-rose-50"
              : isUserReceiver
              ? "border-emerald-100 bg-emerald-50/50 hover:bg-emerald-50"
              : "border-slate-200 bg-slate-50/40 hover:border-indigo-200 hover:bg-indigo-50/20";

            const iconClass = isUserPayer
              ? "bg-rose-100 text-rose-600"
              : isUserReceiver
              ? "bg-emerald-100 text-emerald-600"
              : "bg-indigo-100 text-indigo-600";

            const amountClass = isUserPayer
              ? "bg-rose-100 text-rose-700 border-rose-200/50"
              : isUserReceiver
              ? "bg-emerald-100 text-emerald-700 border-emerald-200/50"
              : "bg-amber-50 text-amber-700 border-amber-200/50";

            return (
              <Link
                key={`${s.groupId}-${s.from}-${s.to}-${s.amount}`}
                href={`/groups/${s.groupId}`}
                className={`flex items-center justify-between gap-4 rounded-xl border px-4 py-3 transition-all duration-200 ${rowClass}`}
              >
                {/* Left */}
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${iconClass}`}
                  >
                    <Wallet className="w-4 h-4" />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-800">
                      {s.fromName} → {s.toName}
                    </p>

                    <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                      {isUserPayer
                        ? "You need to pay this"
                        : isUserReceiver
                        ? "You will receive this"
                        : "Settle this balance"}
                    </p>
                  </div>
                </div>

                {/* Right */}
                <strong
                  className={`whitespace-nowrap rounded-lg border px-2.5 py-1 text-xs font-extrabold tracking-tight ${amountClass}`}
                >
                  ₹{s.amount}
                </strong>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}