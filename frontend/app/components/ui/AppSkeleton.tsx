"use client";

type AppSkeletonProps = {
  variant?: "dashboard" | "details" | "profile";
};

export default function AppSkeleton({ variant = "dashboard" }: AppSkeletonProps) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-6 md:px-16 py-8 animate-pulse">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-10 pb-8 border-b border-gray-100">
        <div className="h-8 w-56 bg-slate-200 rounded-lg mb-3" />
        <div className="h-4 w-72 bg-slate-200 rounded-lg" />
      </div>

      <div className="max-w-7xl mx-auto space-y-10">

        {/* Dashboard Layout */}
        {variant === "dashboard" && (
          <>
            {/* Cards Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="p-6 bg-white rounded-3xl border border-slate-100 space-y-4"
                >
                  <div className="h-5 w-24 bg-slate-200 rounded-full" />
                  <div className="h-6 w-40 bg-slate-200 rounded-lg" />
                  <div className="h-3 w-28 bg-slate-200 rounded-lg" />

                  <div className="flex -space-x-3 mt-4">
                    {[1, 2, 3, 4].map((j) => (
                      <div
                        key={j}
                        className="h-8 w-8 rounded-full bg-slate-200 border-2 border-white"
                      />
                    ))}
                  </div>

                  <div className="h-3 w-24 bg-slate-200 rounded-lg mt-4" />
                </div>
              ))}
            </div>

            {/* List Section */}
            <div className="bg-white rounded-2xl border divide-y">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 flex justify-between">
                  <div className="space-y-2">
                    <div className="h-4 w-40 bg-slate-200 rounded-lg" />
                    <div className="h-3 w-24 bg-slate-200 rounded-lg" />
                  </div>
                  <div className="space-y-2 text-right">
                    <div className="h-4 w-16 bg-slate-200 rounded-lg" />
                    <div className="h-3 w-20 bg-slate-200 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Group Details Layout */}
        {variant === "details" && (
          <>
            <div className="bg-white p-6 rounded-3xl border space-y-6">
              <div className="h-6 w-48 bg-slate-200 rounded-lg" />
              <div className="h-4 w-72 bg-slate-200 rounded-lg" />

              <div className="grid sm:grid-cols-2 gap-6 mt-6">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="p-4 bg-slate-50 rounded-2xl space-y-3"
                  >
                    <div className="h-4 w-32 bg-slate-200 rounded-lg" />
                    <div className="h-4 w-24 bg-slate-200 rounded-lg" />
                    <div className="h-3 w-20 bg-slate-200 rounded-lg" />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Profile Layout */}
        {variant === "profile" && (
          <>
            <div className="bg-white p-8 rounded-3xl border flex flex-col items-center space-y-6">
              <div className="h-24 w-24 rounded-full bg-slate-200" />
              <div className="h-6 w-40 bg-slate-200 rounded-lg" />
              <div className="h-4 w-56 bg-slate-200 rounded-lg" />

              <div className="w-full space-y-4 mt-6">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-12 bg-slate-200 rounded-xl"
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
