"use client";

export default function InsightsSkeleton() {
  return (
    <section
      className="px-4 py-6 md:px-8 lg:px-10"
      aria-busy="true"
      aria-label="Loading group insights"
    >
      <div className="mb-6">
        <div className="h-8 w-28 animate-pulse rounded-lg bg-slate-200" />

        <div className="mt-2 h-4 w-72 max-w-full animate-pulse rounded bg-slate-100" />
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-slate-200 bg-white p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="h-4 w-24 animate-pulse rounded bg-slate-100" />
                <div className="mt-3 h-8 w-32 animate-pulse rounded-lg bg-slate-200" />
              </div>

              <div className="h-10 w-10 shrink-0 animate-pulse rounded-xl bg-slate-100" />
            </div>
          </div>
        ))}
      </div>

      {/* Trend */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="h-5 w-36 animate-pulse rounded bg-slate-200" />
            <div className="mt-2 h-4 w-48 animate-pulse rounded bg-slate-100" />
          </div>

          <div className="h-10 w-10 animate-pulse rounded-xl bg-slate-100" />
        </div>

        <div className="mt-6 flex h-56 items-end gap-3">
          {[42, 65, 35, 78, 52, 90, 60, 72].map((height, index) => (
            <div
              key={index}
              className="flex h-full flex-1 items-end"
            >
              <div
                className="w-full animate-pulse rounded-t-lg bg-slate-100"
                style={{ height: `${height}%` }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Category + Budget */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-slate-200 bg-white p-5"
          >
            <div className="h-5 w-40 animate-pulse rounded bg-slate-200" />
            <div className="mt-2 h-4 w-56 animate-pulse rounded bg-slate-100" />

            <div className="mt-6 space-y-5">
              {Array.from({ length: 3 }).map((__, rowIndex) => (
                <div key={rowIndex}>
                  <div className="flex justify-between">
                    <div className="h-4 w-24 animate-pulse rounded bg-slate-100" />
                    <div className="h-4 w-20 animate-pulse rounded bg-slate-100" />
                  </div>

                  <div className="mt-2 h-2 animate-pulse rounded-full bg-slate-100" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Members */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
        <div className="h-5 w-44 animate-pulse rounded bg-slate-200" />
        <div className="mt-2 h-4 w-64 animate-pulse rounded bg-slate-100" />

        <div className="mt-6 space-y-5">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index}>
              <div className="flex justify-between">
                <div className="h-4 w-28 animate-pulse rounded bg-slate-100" />
                <div className="h-4 w-24 animate-pulse rounded bg-slate-100" />
              </div>

              <div className="mt-2 h-2 animate-pulse rounded-full bg-slate-100" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}