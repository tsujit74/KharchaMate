import type { GroupInsights } from "../../types/insights.types";
import { cardClass, cardTitleClass, formatAmount } from "../insights/shared";

type Props = {
  settlement: GroupInsights["settlement"];
  currentUserId?: string;
  onOpen: () => void;
};

export default function SettlementCard({
  settlement,
  currentUserId,
  onOpen,
}: Props) {
  const { balance, pendingCount, suggestedTransfers } = settlement;

  const validBalance = Number.isFinite(balance);
  const validPendingCount = Number.isInteger(pendingCount) && pendingCount >= 0;
  const hasPending = validPendingCount && pendingCount > 0;
  const hasUser = Boolean(currentUserId);

  const isOwed = validBalance && balance > 0;
  const owes = validBalance && balance < 0;
  const isBalanced = validBalance && balance === 0;

  const mine = hasUser
    ? suggestedTransfers.filter(
        (t) => t.fromUserId === currentUserId || t.toUserId === currentUserId,
      )
    : [];

  const status = !validBalance
    ? {
        label: "Unavailable",
        color: "text-slate-600",
        dot: "bg-slate-400",
        surface: "bg-slate-50 border-slate-200",
      }
    : isOwed
      ? {
          label: "You are owed",
          color: "text-emerald-700",
          dot: "bg-emerald-500",
          surface: "bg-emerald-50/70 border-emerald-200",
        }
      : owes
        ? {
            label: "You owe",
            color: "text-red-700",
            dot: "bg-red-500",
            surface: "bg-red-50/70 border-red-200",
          }
        : {
            label: hasPending ? "Payments pending" : "Balanced",
            color: "text-slate-700",
            dot: "bg-slate-400",
            surface: "bg-slate-50 border-slate-200",
          };

  const headline = validBalance
    ? formatAmount(Math.abs(balance))
    : "Balance unavailable";

  return (
    <section className={`${cardClass} min-w-0`}>
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <h2 className={cardTitleClass}>Settlement</h2>
          <p className="mt-0.5 text-xs text-slate-500">Your payment position</p>
        </div>

        <span
          className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-1 text-[11px] font-medium ${status.color} ${status.surface}`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${status.dot}`}
            aria-hidden="true"
          />
          {status.label}
        </span>
      </div>

      <div className={`mt-3 rounded-lg border p-3 ${status.surface}`}>
        <p className="text-xs font-medium text-slate-600">
          {!validBalance
            ? "Your current balance"
            : isOwed
              ? "Net amount owed to you"
              : owes
                ? "Net amount you owe"
                : "Your net balance"}
        </p>

        <p
          className={`mt-0.5 break-words text-2xl font-semibold tracking-tight ${
            isOwed
              ? "text-emerald-700"
              : owes
                ? "text-red-700"
                : "text-slate-950"
          }`}
        >
          {headline}
        </p>

        <p className="mt-0.5 text-xs leading-4 text-slate-500">
          {!validBalance
            ? "Check the settlement details for more information."
            : isOwed
              ? "You should receive this amount overall."
              : owes
                ? "You should pay this amount overall."
                : hasPending
                  ? "Your net balance is zero, but some payment records are still pending."
                  : "You have no outstanding net balance."}
        </p>
      </div>

      <div className="mt-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-slate-900">
            Suggested payments
          </h3>
          <span className="text-xs text-slate-500">
            {mine.length} {mine.length === 1 ? "transfer" : "transfers"}
          </span>
        </div>

        {!hasUser ? (
          <p className="mt-2 rounded-lg bg-slate-50 p-2.5 text-xs text-slate-500">
            Sign in to view your suggested payments.
          </p>
        ) : mine.length > 0 ? (
          <ul className="mt-1 divide-y divide-slate-100">
            {mine.map((transfer) => {
              const youPay = transfer.fromUserId === currentUserId;

              return (
                <li
                  key={`${transfer.fromUserId}-${transfer.toUserId}`}
                  className="flex min-w-0 items-center gap-2 py-2"
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      youPay
                        ? "bg-red-50 text-red-700"
                        : "bg-emerald-50 text-emerald-700"
                    }`}
                    aria-hidden="true"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-4 w-4"
                    >
                      <path
                        d={
                          youPay
                            ? "M12 5v14m0 0-6-6m6 6 6-6"
                            : "M12 19V5m0 0-6 6m6-6 6 6"
                        }
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-800">
                      {youPay
                        ? `Pay ${transfer.toName}`
                        : `${transfer.fromName} pays you`}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {youPay ? "Outgoing transfer" : "Incoming transfer"}
                    </p>
                  </div>

                  <p
                    className={`shrink-0 text-sm font-semibold tabular-nums ${
                      youPay ? "text-red-700" : "text-emerald-700"
                    }`}
                  >
                    {formatAmount(transfer.amount)}
                  </p>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-2 rounded-lg border border-dashed border-slate-200 p-3 text-xs leading-4 text-slate-500">
            {isBalanced
              ? "No suggested transfers. Your net balance is zero."
              : "No suggested transfers are available for your account."}
          </p>
        )}
      </div>

      {hasPending && (
        <p
          role="status"
          className="mt-2 rounded-lg border border-amber-200 bg-amber-50 p-2.5 text-xs leading-4 text-amber-900"
        >
          {pendingCount} pending{" "}
          {pendingCount === 1 ? "payment needs" : "payments need"} attention.
          Review payment status before closing the group.
        </p>
      )}

      <button
        type="button"
        onClick={onOpen}
        className="mt-3 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2"
      >
        Open settlement
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <path
            d="M5 12h14m-6-6 6 6-6 6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </section>
  );
}
