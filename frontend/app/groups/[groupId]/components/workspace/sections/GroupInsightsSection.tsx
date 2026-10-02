"use client";

import { BarChart3 } from "lucide-react";

export default function GroupInsightsSection() {
  return (
    <section className="px-4 py-6 md:px-8 lg:px-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Insights
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Understand spending patterns and group activity.
        </p>
      </div>

      <div className="flex min-h-[360px] w-full max-w-4xl items-center justify-center rounded-xl border bg-white p-6">
        <div className="max-w-md text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
            <BarChart3 className="h-6 w-6 text-slate-500" />
          </div>

          <h2 className="mt-4 text-lg font-semibold text-slate-900">
            Group Insights are coming soon
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Spending trends, category breakdowns, member analysis,
            and other group insights will be available here.
          </p>
        </div>
      </div>
    </section>
  );
}