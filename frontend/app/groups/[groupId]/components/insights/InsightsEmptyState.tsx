"use client";

import { BarChart3 } from "lucide-react";

type Props = {
  title?: string;
  description?: string;
};

export default function InsightsEmptyState({
  title = "No insights available yet",
  description = "Add some expenses to this group and spending insights will appear here.",
}: Props) {
  return (
    <section className="px-4 py-6 md:px-8 lg:px-10">
      <div className="flex min-h-[360px] w-full max-w-4xl items-center justify-center rounded-2xl border border-slate-200 bg-white p-6">
        <div className="max-w-md text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
            <BarChart3 className="h-7 w-7 text-slate-500" />
          </div>

          <h2 className="mt-5 text-lg font-semibold text-slate-900">{title}</h2>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
