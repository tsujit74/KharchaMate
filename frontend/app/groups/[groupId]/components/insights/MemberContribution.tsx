
"use client";

import { useState } from "react";
import type { GroupInsights } from "../../types/insights.types";
import {
  cardClass,
  cardTitleClass,
  formatAmount,
} from "../insights/shared";

const LIMIT = 5;

type Props = {
  members: GroupInsights["members"];
  currentUserId?: string;
};

function safeNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export default function MemberContribution({
  members,
  currentUserId,
}: Props) {
  const [showAll, setShowAll] = useState(false);

  const normalized = members.map((member) => ({
    ...member,
    paid: safeNumber(member.paid),
    share: safeNumber(member.share),
  }));

  const maxPaid = Math.max(
    0,
    ...normalized.map((member) => Math.max(0, member.paid)),
  );

  let visible = normalized;

  if (!showAll && normalized.length > LIMIT) {
    visible = normalized.slice(0, LIMIT);

    const currentUser = normalized.find(
      (member) => member.userId === currentUserId,
    );

    if (
      currentUser &&
      !visible.some((member) => member.userId === currentUser.userId)
    ) {
      visible = [...visible.slice(0, LIMIT - 1), currentUser];
    }
  }

  return (
    <section
      className={cardClass}
      aria-label="Member expense contributions"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className={cardTitleClass}>Member contribution</h2>
        <span className="shrink-0 text-xs text-slate-500">
          {members.length} {members.length === 1 ? "member" : "members"}
        </span>
      </div>

      {normalized.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-5 text-center">
          <p className="text-sm font-medium text-slate-700">
            No member data yet
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Contributions will appear when expense data is available.
          </p>
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          {visible.map((member) => {
            const width =
              maxPaid > 0
                ? (Math.max(0, member.paid) / maxPaid) * 100
                : 0;

            return (
              <div key={member.userId}>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="truncate text-sm font-medium text-slate-700">
                      {member.name || "Unknown member"}
                    </span>

                    {member.userId === currentUserId && (
                      <span className="shrink-0 rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-700">
                        You
                      </span>
                    )}
                  </div>

                  <span className="shrink-0 text-sm font-semibold tabular-nums text-slate-900">
                    {formatAmount(member.paid)}
                  </span>
                </div>

                <div
                  className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100"
                  role="progressbar"
                  aria-label={`${member.name || "Member"} contribution compared with the highest contributor`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(width)}
                >
                  <div
                    className="h-full rounded-full bg-teal-600 transition-[width] duration-300"
                    style={{ width: `${width}%` }}
                  />
                </div>

                <div className="mt-1.5 flex items-center justify-between gap-3 text-xs text-slate-500">
                  <span>Paid</span>
                  <span className="tabular-nums">
                    Share {formatAmount(member.share)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {normalized.length > LIMIT && (
        <button
          type="button"
          onClick={() => setShowAll((previous) => !previous)}
          aria-expanded={showAll}
          className="mt-4 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          {showAll ? "Show fewer members" : `View all ${normalized.length} members`}
        </button>
      )}
    </section>
  );
}
