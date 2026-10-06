import type { GroupInsights } from "../../types/insights.types";
import { cardClass, cardTitleClass, formatAmount } from "../insights/shared";
type Props = {
  settlement: GroupInsights["settlement"];
  onOpen: () => void;
};

export default function SettlementCard({ settlement, onOpen }: Props) {
  const { balance, pendingCount } = settlement;

  const settled = Math.abs(balance) <= 0.01;

  return (
    <div className={cardClass}>
      <h2 className={cardTitleClass}>Your settlement</h2>

      {settled ? (
        <p className="mt-3 text-lg font-semibold text-slate-900">
          You&apos;re settled up
        </p>
      ) : (
        <>
          <p className="mt-3 text-sm text-slate-500">
            {balance > 0 ? "You will receive" : "You need to pay"}
          </p>
          <p className="mt-1 text-xl font-semibold text-slate-900">
            {formatAmount(Math.abs(balance))}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            After confirmed payments
          </p>
        </>
      )}

      {pendingCount > 0 && (
        <p className="mt-3 text-sm text-slate-600">
          {pendingCount} {pendingCount === 1 ? "payment" : "payments"} awaiting
          confirmation
        </p>
      )}

      <button
        type="button"
        onClick={onOpen}
        className="mt-4 text-sm font-medium text-slate-700 hover:text-slate-900"
      >
        Open Settlement
      </button>
    </div>
  );
}
