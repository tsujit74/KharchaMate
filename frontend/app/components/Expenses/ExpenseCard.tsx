"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { formatDateTime } from "@/app/utils/formatDateTime";

export default function ExpenseCard({
  expense,
  currentUserId,
}: {
  expense: any;
  currentUserId?: string;
}) {
  const [open, setOpen] = useState(false);
  const { dateLabel } = formatDateTime(expense.createdAt);

  return (
    <div className="bg-white border rounded-lg mb-3">
      {/* HEADER */}
      <div
        className="p-4 flex justify-between items-center cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <div>
          <p className="font-medium">{expense.description}</p>
          <p className="text-xs text-gray-500">
            Paid by{" "}
            {expense.paidBy._id === currentUserId
              ? "You"
              : expense.paidBy.name}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="font-semibold">₹{expense.amount}</p>
            <p className="text-xs text-gray-500">{dateLabel}</p>
          </div>
          {open ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </div>

      {/* DROPDOWN */}
      {open && (
        <div className="border-t px-4 py-3 bg-gray-50">
          <p className="text-xs font-semibold text-gray-500 mb-2">
            Split Details
          </p>

          {expense.splitBetween.map((s: any) => {
            const isYou = s.user._id === currentUserId;

            return (
              <div
                key={s._id}
                className="flex justify-between text-sm mb-1"
              >
                <span className={isYou ? "font-semibold" : ""}>
                  {s.user.name} {isYou && "(You)"}
                </span>
                <span>₹{s.amount}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
