"use client";

import cn from "clsx";

type Member = {
  id: string;
  name: string;
  email: string;
  balance: number;
  role?: "ADMIN" | "MEMBER";
};

type Props = {
  member: Member;
  currentUserId?: string;
};

export default function MemberCard({ member, currentUserId }: Props) {
  const { id, name, email, balance, role } = member;

  const isYou = id === currentUserId;
  const isOwed = balance > 0;
  const isAdmin = role === "ADMIN";

  const cardVariants = {
    admin:
      "bg-indigo-50/50 border-indigo-100 dark:bg-indigo-950/20 dark:border-indigo-900/50",
    owed: "bg-emerald-50/50 border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/50",
    owes: "bg-rose-50/50 border-rose-100 dark:bg-rose-950/20 dark:border-rose-900/50",
  };

  const currentVariant = isAdmin ? "admin" : isOwed ? "owed" : "owes";

  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-xl p-4 border transition-all duration-200",
        cardVariants[currentVariant],
      )}
    >
   
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
          <span>{name}</span>
          <div>
            <p className="text-sm font-medium">{isYou && "(You)"}</p>
          </div>
          {isAdmin && (
            <span className="inline-flex items-center rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-medium text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
              Admin
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">{email}</p>
      </div>

      <div className="text-right">
        <span
          className={cn(
            "text-sm font-bold tabular-nums",
            isOwed
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-rose-600 dark:text-rose-400",
          )}
        >
          {isOwed ? "+" : "-"}₹{Math.abs(balance).toLocaleString("en-IN")}
        </span>
      </div>
    </div>
  );
}
