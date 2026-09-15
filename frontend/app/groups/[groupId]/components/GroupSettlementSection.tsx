"use client";

import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  History,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import ReminderButton from "@/app/components/ui/Reminder/ReminderButton";

type Props = {
  settlement: any;
  userId?: string;
  groupId: string;
};

function initials(name?: string) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

export default function GroupSettlementSection({
  settlement,
  userId,
  groupId,
}: Props) {
  const router = useRouter();

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
      <div className="max-w-6xl mx-auto bg-white rounded-lg border border-gray-200 p-4 mb-8">
        <h2 className="text-base font-semibold text-gray-900">Settlement</h2>
        <p className="text-sm text-gray-400 mt-2">All balances are settled.</p>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-6xl mx-auto bg-white rounded-lg border border-gray-200 mb-8">
        {/* Section header */}
        <div className="px-4 pt-4 pb-2">
          <h2 className="text-base font-semibold text-gray-900">
            Settlement
          </h2>
          <p className="text-sm text-gray-400">
            Track balances and payment status
          </p>
        </div>

        <div className="px-2 pb-2">
          {settlements
            .slice()
            .sort(
              (a: any, b: any) =>
                Number(b.from === userId) - Number(a.from === userId),
            )
            .map((s: any) => {
              const youOwe = s.from === userId;
              const someoneOwesYou = s.to === userId;

              const myPaymentsToUser = paymentStatuses.filter(
                (p: any) =>
                  p.from?.toString() === userId?.toString() &&
                  p.to?._id?.toString() === s.to?.toString(),
              );

              const pendingPayments = myPaymentsToUser.filter(
                (p: any) => p.status === "INITIATED",
              );

              const pendingAmount = pendingPayments.reduce(
                (total: number, payment: any) =>
                  total + Number(payment.amount || 0),
                0,
              );

              const debtor = balances.find(
                (b: any) => b.id === s.from,
              );

              return (
                <div
                  key={`${s.from}-${s.to}`}
                  className="rounded-md px-2 py-2.5 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
                    {/* People */}
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100 text-[11px] font-medium text-gray-600">
                        {initials(s.fromName)}
                      </div>

                      <div className="flex items-center gap-1.5 text-sm min-w-0">
                        <span className="font-medium text-gray-900 truncate">
                          {s.fromName}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                        <span className="font-medium text-gray-900 truncate">
                          {someoneOwesYou ? "You" : s.toName}
                        </span>
                      </div>
                    </div>

                    {/* You owe */}
                    {youOwe && (
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-lg font-semibold tabular-nums text-gray-900">
                          ₹{Number(s.amount).toFixed(2)}
                        </span>

                        <button
                          onClick={() => handlePay(s.to)}
                          className="rounded-md bg-gray-900 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
                        >
                          Pay
                        </button>
                      </div>
                    )}

                    {/* Someone owes you */}
                    {someoneOwesYou && (
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-lg font-semibold tabular-nums text-gray-900">
                          ₹{Number(s.amount).toFixed(2)}
                        </span>

                        <ReminderButton
                          groupId={groupId}
                          toUserId={debtor?.id}
                          amount={s.amount}
                        />
                      </div>
                    )}

                    {/* Other settlement */}
                    {!youOwe && !someoneOwesYou && (
                      <span className="text-lg font-semibold tabular-nums text-gray-400 shrink-0">
                        ₹{Number(s.amount).toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Secondary status row (payer only) */}
                  {youOwe && (
                    <div className="flex flex-wrap items-center justify-end gap-x-3 gap-y-1 mt-1.5 pl-9">
                      {pendingAmount > 0 && (
                        <div className="flex items-center gap-1 text-xs font-medium text-amber-600">
                          <Clock3 className="w-3.5 h-3.5" />
                          <span>
                            ₹{pendingAmount.toFixed(2)} awaiting confirmation
                          </span>
                        </div>
                      )}

                      <button
                        onClick={() =>
                          openPaymentHistory(
                            myPaymentsToUser,
                            s.fromName,
                            s.toName,
                          )
                        }
                        className="flex items-center gap-1 text-xs font-medium text-gray-400 transition-colors hover:text-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400 rounded"
                      >
                        <History className="w-3.5 h-3.5" />
                        <span>Payment history</span>
                      </button>
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
          <div className="w-full max-w-sm rounded-lg bg-white border border-gray-200 shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  Payment history
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  {historyTitle}
                </p>
              </div>

              <button
                onClick={closePaymentHistory}
                className="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Payments */}
            <div className="max-h-[60vh] overflow-y-auto px-2 py-2">
              {historyPayments.map((payment: any) => {
                const isPending = payment.status === "INITIATED";

                return (
                  <div
                    key={payment._id}
                    className="flex items-center justify-between gap-3 rounded-md px-2 py-2 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {isPending ? (
                        <Clock3 className="w-4 h-4 shrink-0 text-amber-500" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                      )}

                      <div className="min-w-0">
                        <p className="text-sm font-medium tabular-nums text-gray-900">
                          ₹{Number(payment.amount).toFixed(2)}
                        </p>
                        <p
                          className={`text-xs mt-0.5 ${
                            isPending ? "text-amber-600" : "text-emerald-600"
                          }`}
                        >
                          {isPending
                            ? "Awaiting confirmation"
                            : "Payment confirmed"}
                        </p>
                      </div>
                    </div>

                    <span className="text-xs text-gray-400 shrink-0">
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