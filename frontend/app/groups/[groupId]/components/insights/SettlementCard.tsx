import type { GroupInsights } from "../../types/insights.types";
import { cardClass, cardTitleClass, formatAmount } from "../insights/shared";

type Props = {
  settlement: GroupInsights["settlement"];
  currentUserId?: string;
  onOpen: () => void;
};

export default function SettlementCard({ settlement, currentUserId, onOpen }: Props) {
  const { balance, pendingCount, pendingIn, pendingOut, suggestedTransfers } =
    settlement;

  const mine = suggestedTransfers.filter(
    (t) => t.fromUserId === currentUserId || t.toUserId === currentUserId,
  );

  const headline =
    balance > 0
      ? `You are owed ${formatAmount(balance)}`
      : balance < 0
        ? `You owe ${formatAmount(-balance)}`
        : "You are all settled up";

  const tone =
    balance > 0
      ? "text-emerald-600"
      : balance < 0
        ? "text-red-500"
        : "text-slate-900";

  return (
    <div className={cardClass}>
      <h2 className={cardTitleClass}>Settlement</h2>

      <p className={`mt-3 text-xl font-semibold ${tone}`}>{headline}</p>

      {pendingCount > 0 && (
        <div className="mt-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
          <p className="font-medium text-slate-700">
            {pendingCount} pending {pendingCount === 1 ? "payment" : "payments"}
          </p>
          {pendingOut > 0 && <p>You are paying {formatAmount(pendingOut)}</p>}
          {pendingIn > 0 && <p>You will receive {formatAmount(pendingIn)}</p>}
        </div>
      )}

      {mine.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-slate-700">
            Suggested payments
          </h3>
          <ul className="mt-2 divide-y divide-slate-100">
            {mine.map((t) => {
              const youPay = t.fromUserId === currentUserId;
              return (
                <li
                  key={`${t.fromUserId}-${t.toUserId}`}
                  className="flex items-center justify-between gap-3 py-2 text-sm"
                >
                  <span className="truncate text-slate-600">
                    {youPay ? `You pay ${t.toName}` : `${t.fromName} pays you`}
                  </span>
                  <span
                    className={`shrink-0 font-medium ${
                      youPay ? "text-red-500" : "text-emerald-600"
                    }`}
                  >
                    {formatAmount(t.amount)}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <button
        type="button"
        onClick={onOpen}
        className="mt-4 text-sm font-medium text-slate-600 hover:text-slate-900"
      >
        Open settlement
      </button>
    </div>
  );
}