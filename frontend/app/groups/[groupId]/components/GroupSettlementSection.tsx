"use client";

import { CheckCircle2, Clock3, History, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import ReminderButton from "@/app/components/ui/Reminder/ReminderButton";

type Props = {
  settlement: any;
  userId?: string;
  groupId: string;
};

type Filter = "all" | "youOwe" | "owedToYou";

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "youOwe", label: "You owe" },
  { value: "owedToYou", label: "Owed to you" },
];

function initials(name?: string) {
  if (!name) return "?";

  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";

  return (first + last).toUpperCase();
}

function formatAmount(amount: number | string) {
  return `₹${Number(amount).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function GroupSettlementSection({
  settlement,
  userId,
  groupId,
}: Props) {
  const router = useRouter();

  const [filter, setFilter] = useState<Filter>("all");
  const [historyPayments, setHistoryPayments] = useState<any[]>([]);
  const [historyTitle, setHistoryTitle] = useState("");

  const settlements = settlement?.settlements ?? [];
  const balances = settlement?.balances ?? [];
  const paymentStatuses = settlement?.paymentStatuses ?? [];

  const handlePay = (toId: string) => {
    router.push(`/groups/${groupId}/settle?to=${toId}`);
  };

  const openPaymentHistory = (
    payments: any[],
    fromName: string,
    toName: string,
  ) => {
    setHistoryPayments(payments);
    setHistoryTitle(`${fromName} → ${toName}`);
  };

  const closePaymentHistory = () => {
    setHistoryPayments([]);
    setHistoryTitle("");
  };

  if (!settlements.length) {
    return (
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">Settlement</h2>

        <p className="mt-1 text-sm text-slate-500">
          All balances are settled.
        </p>
      </div>
    );
  }

  const getMyPayments = (s: any) =>
    paymentStatuses.filter(
      (p: any) =>
        p.from?.toString() === userId?.toString() &&
        p.to?._id?.toString() === s.to?.toString(),
    );

  const sumAmount = (payments: any[]) =>
    payments.reduce(
      (total: number, payment: any) => total + Number(payment.amount || 0),
      0,
    );

  const totalPending = settlements
    .filter((s: any) => s.from === userId)
    .reduce(
      (total: number, s: any) =>
        total +
        sumAmount(
          getMyPayments(s).filter((p: any) => p.status === "INITIATED"),
        ),
      0,
    );

  const totalYouOwe = settlements
    .filter((s: any) => s.from === userId)
    .reduce((total: number, s: any) => total + Number(s.amount), 0);

  const totalOwedToYou = settlements
    .filter((s: any) => s.to === userId)
    .reduce((total: number, s: any) => total + Number(s.amount), 0);

  const visibleSettlements = settlements
    .filter((s: any) => {
      if (filter === "youOwe") return s.from === userId;
      if (filter === "owedToYou") return s.to === userId;
      return true;
    })
    .sort(
      (a: any, b: any) =>
        Number(b.from === userId) - Number(a.from === userId),
    );

  return (
    <>
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        {/* Header */}
        <div className="flex flex-col gap-4 px-5 pt-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Settlement
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Track balances and payment status
            </p>
          </div>

          <div className="inline-flex self-start rounded-lg bg-slate-100 p-1">
            {filters.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setFilter(item.value)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 ${
                  filter === item.value
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="mx-5 mt-5 grid grid-cols-3 divide-x divide-slate-100 rounded-xl border border-slate-100 bg-slate-50/60 sm:mx-6">
          <div className="px-3 py-3 sm:px-4">
            <p className="text-xs text-slate-500">You owe</p>
            <p
              className={`mt-1 text-sm font-semibold tabular-nums sm:text-lg ${
                totalYouOwe > 0 ? "text-rose-600" : "text-slate-900"
              }`}
            >
              {formatAmount(totalYouOwe)}
            </p>
          </div>

          <div className="px-3 py-3 sm:px-4">
            <p className="text-xs text-slate-500">Owed to you</p>
            <p
              className={`mt-1 text-sm font-semibold tabular-nums sm:text-lg ${
                totalOwedToYou > 0 ? "text-emerald-600" : "text-slate-900"
              }`}
            >
              {formatAmount(totalOwedToYou)}
            </p>
          </div>

          <div className="px-3 py-3 sm:px-4">
            <p className="text-xs text-slate-500">Awaiting confirmation</p>
            <p
              className={`mt-1 text-sm font-semibold tabular-nums sm:text-lg ${
                totalPending > 0 ? "text-amber-600" : "text-slate-900"
              }`}
            >
              {formatAmount(totalPending)}
            </p>
          </div>
        </div>

        {/* Rows */}
        <div className="px-3 pb-3 pt-3 sm:px-5 sm:pb-5">
          {visibleSettlements.length === 0 && (
            <p className="px-3 py-8 text-center text-sm text-slate-500">
              No settlements in this view.
            </p>
          )}

          {visibleSettlements.map((s: any) => {
            const youOwe = s.from === userId;
            const someoneOwesYou = s.to === userId;

            const fromLabel = youOwe ? "You" : s.fromName;
            const toLabel = someoneOwesYou ? "You" : s.toName;

            const myPaymentsToUser = getMyPayments(s);

            const pendingAmount = sumAmount(
              myPaymentsToUser.filter((p: any) => p.status === "INITIATED"),
            );
            const confirmedAmount = sumAmount(
              myPaymentsToUser.filter((p: any) => p.status !== "INITIATED"),
            );

            // s.amount is treated as the remaining balance
            const totalAmount = Number(s.amount) + confirmedAmount;
            const confirmedPercent = (confirmedAmount / totalAmount) * 100;
            const pendingPercent = (pendingAmount / totalAmount) * 100;
            const showProgress =
              youOwe && (confirmedAmount > 0 || pendingAmount > 0);

            const debtor = balances.find((b: any) => b.id === s.from);

            return (
              <div
                key={`${s.from}-${s.to}`}
                className="rounded-xl px-3 py-3 transition-colors hover:bg-slate-50 sm:py-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                  {/* People */}
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex shrink-0 -space-x-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600 ring-2 ring-white">
                        {initials(s.fromName)}
                      </div>

                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-700 ring-2 ring-white">
                        {initials(s.toName)}
                      </div>
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-900">
                        {fromLabel}
                        <span className="mx-1.5 font-normal text-slate-400">
                          pays
                        </span>
                        {toLabel}
                      </p>

                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                        {youOwe && (
                          <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-medium text-rose-600">
                            You owe
                          </span>
                        )}

                        {someoneOwesYou && (
                          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-600">
                            Owes you
                          </span>
                        )}

                        {!youOwe && !someoneOwesYou && (
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                            Between members
                          </span>
                        )}

                        {youOwe && pendingAmount > 0 && (
                          <span className="flex items-center gap-1 text-[11px] font-medium text-amber-600">
                            <Clock3 className="h-3.5 w-3.5 shrink-0" />
                            {formatAmount(pendingAmount)} awaiting confirmation
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Amount + actions */}
                  <div className="flex shrink-0 items-center justify-end gap-3 pl-12 sm:pl-0">
                    {youOwe && (
                      <button
                        type="button"
                        onClick={() =>
                          openPaymentHistory(
                            myPaymentsToUser,
                            s.fromName,
                            s.toName,
                          )
                        }
                        className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
                        aria-label="Payment history"
                        title="Payment history"
                      >
                        <History className="h-4 w-4" />
                      </button>
                    )}

                    <span
                      className={`text-base font-semibold tabular-nums ${
                        youOwe || someoneOwesYou
                          ? "text-slate-900"
                          : "text-slate-400"
                      }`}
                    >
                      {formatAmount(s.amount)}
                    </span>

                    {youOwe && (
                      <button
                        type="button"
                        onClick={() => handlePay(s.to)}
                        className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-medium text-white shadow-sm transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
                      >
                        Pay
                      </button>
                    )}

                    {someoneOwesYou && (
                      <ReminderButton
                        groupId={groupId}
                        toUserId={debtor?.id}
                        amount={s.amount}
                      />
                    )}
                  </div>
                </div>

                {showProgress && (
                  <div className="mt-3 sm:pl-12">
                    <div className="flex h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="bg-emerald-500"
                        style={{ width: `${confirmedPercent}%` }}
                      />
                      <div
                        className="bg-amber-400"
                        style={{ width: `${pendingPercent}%` }}
                      />
                    </div>

                    <p className="mt-1.5 text-[11px] text-slate-500">
                      {formatAmount(confirmedAmount)} paid of{" "}
                      {formatAmount(totalAmount)}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment History Modal */}
      {historyPayments.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div className="w-full max-w-sm rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  Payment history
                </h3>

                <p className="mt-0.5 text-xs text-gray-400">{historyTitle}</p>
              </div>

              <button
                type="button"
                onClick={closePaymentHistory}
                className="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto px-2 py-2">
              {historyPayments.map((payment: any) => {
                const isPending = payment.status === "INITIATED";

                return (
                  <div
                    key={payment._id}
                    className="flex items-center justify-between gap-3 rounded-md px-2 py-2 hover:bg-gray-50"
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      {isPending ? (
                        <Clock3 className="h-4 w-4 shrink-0 text-amber-500" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                      )}

                      <div className="min-w-0">
                        <p className="text-sm font-medium tabular-nums text-gray-900">
                          {formatAmount(payment.amount)}
                        </p>

                        <p
                          className={`mt-0.5 text-xs ${
                            isPending ? "text-amber-600" : "text-emerald-600"
                          }`}
                        >
                          {isPending
                            ? "Awaiting confirmation"
                            : "Payment confirmed"}
                        </p>
                      </div>
                    </div>

                    <span className="shrink-0 text-xs text-gray-400">
                      {payment.createdAt
                        ? new Date(payment.createdAt).toLocaleDateString()
                        : ""}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}