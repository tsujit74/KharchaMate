"use client";

import { useState } from "react";
import type { GroupInsights } from "../../types/insights.types";
import { cardClass, cardTitleClass, formatAmount } from "../insights/shared";

const LIMIT = 5;

type Props = {
  members: GroupInsights["members"];
  currentUserId?: string;
};

export default function MemberContribution({ members, currentUserId }: Props) {
  const [showAll, setShowAll] = useState(false);

  const maxPaid = Math.max(...members.map((m) => m.paid), 1);

  let visible = members;

  if (!showAll && members.length > LIMIT) {
    visible = members.slice(0, LIMIT);

    const me = members.find((m) => m.userId === currentUserId);
    if (me && !visible.includes(me)) {
      visible = [...visible.slice(0, LIMIT - 1), me];
    }
  }

  return (
    <div className={cardClass}>
      <h2 className={cardTitleClass}>Member contribution</h2>

      <div className="mt-4 space-y-4">
        {visible.map((member) => (
          <div key={member.userId}>
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="truncate font-medium text-slate-700">
                {member.name}
                {member.userId === currentUserId && (
                  <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-normal text-slate-600">
                    You
                  </span>
                )}
              </span>
              <span className="shrink-0 text-slate-500">
                Paid {formatAmount(member.paid)}
              </span>
            </div>

            <div className="mt-1.5 h-2 rounded-full bg-slate-100">
              <div
                className="h-2 rounded-full bg-slate-700"
                style={{ width: `${(member.paid / maxPaid) * 100}%` }}
              />
            </div>

            <p className="mt-1 text-xs text-slate-400">
              Share {formatAmount(member.share)}
            </p>
          </div>
        ))}
      </div>

      {members.length > LIMIT && (
        <button
          type="button"
          onClick={() => setShowAll(!showAll)}
          className="mt-4 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          {showAll ? "Show less" : `Show all ${members.length} members`}
        </button>
      )}
    </div>
  );
}