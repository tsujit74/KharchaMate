"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

import ReminderButton from "@/app/components/ui/Reminder/ReminderButton";

type Props = {
  settlement: any;
  userId?: string;
  groupId: string;
};

export default function GroupSettlementSection({
  settlement,
  userId,
  groupId,
}: Props) {
  const router = useRouter();

  const settlements = settlement?.settlements ?? [];
  const balances = settlement?.balances ?? [];

  const handlePay = (toId: string, amount: number) => {
    router.push(`/groups/${groupId}/settle?to=${toId}&amount=${amount}`);
  };

  if (!settlements.length) {
    return (
      <div className="max-w-6xl mx-auto bg-white rounded-xl border p-6 mb-10">
        <h2 className="font-semibold mb-4">Settlement</h2>
        <p className="text-gray-500 text-sm">
          Everyone is settled 🎉
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-xl border p-6 mb-10">
      <h2 className="font-semibold mb-4">Settlement</h2>

      {settlements
        .slice()
        .sort(
          (a: any, b: any) =>
            Number(b.from === userId) - Number(a.from === userId)
        )
        .map((s: any) => {
          const youOwe = s.from === userId;
          const someoneOwesYou = s.to === userId;

          const debtor = balances.find(
            (b: any) => b.id === s.from
          );

          return (
            <div
              key={`${s.from}-${s.to}`}
              className={`flex justify-between items-center rounded-lg p-3 mb-2 border ${
                youOwe
                  ? "bg-red-50 border-red-200"
                  : someoneOwesYou
                  ? "bg-green-50 border-green-200"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">{s.fromName}</span>

                <ArrowRight className="w-4 h-4 text-gray-400" />

                <span className="font-medium">{s.toName}</span>
              </div>

              <div className="flex items-center gap-2">
                {youOwe && (
                  <button
                    onClick={() => handlePay(s.to, s.amount)}
                    className="px-3 py-1 bg-green-600 text-white rounded-md text-sm"
                  >
                    Pay ₹{s.amount}
                  </button>
                )}

                {someoneOwesYou && (
                  <>
                    <span className="text-sm font-semibold text-gray-700">
                      ₹{s.amount}
                    </span>

                    <ReminderButton
                      groupId={groupId}
                      toUserId={debtor?.id}
                      amount={s.amount}
                    />
                  </>
                )}

                {!youOwe && !someoneOwesYou && (
                  <span className="text-sm font-semibold text-gray-500">
                    ₹{s.amount}
                  </span>
                )}
              </div>
            </div>
          );
        })}
    </div>
  );
}