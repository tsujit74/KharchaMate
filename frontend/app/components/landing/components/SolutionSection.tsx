import { Lock, ScanLine } from "lucide-react";

const categories = [
  { label: "Rent", amount: "₹12,000", percent: 65 },
  { label: "Food", amount: "₹3,900", percent: 21 },
  { label: "Recharge", amount: "₹1,500", percent: 8 },
  { label: "Other", amount: "₹1,000", percent: 5 },
];

const customSplit = [
  { name: "Aisha", amount: "₹10,000", note: "bigger room" },
  { name: "Rahul", amount: "₹8,000", note: "" },
  { name: "Maya", amount: "₹6,000", note: "smaller room" },
];

function Card({
  className = "",
  title,
  text,
  children,
}: {
  className?: string;
  title: string;
  text: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`flex flex-col rounded-3xl border border-slate-200 bg-white p-6 md:p-7 ${className}`}
    >
      <h3 className="text-xl font-bold tracking-tight text-slate-900">
        {title}
      </h3>
      <p className="mt-2 max-w-md text-[15px] leading-relaxed text-slate-600">
        {text}
      </p>
      <div className="mt-6 flex-1">{children}</div>
    </div>
  );
}

export default function SolutionSection() {
  return (
    <section
      id="features"
      className="scroll-mt-24 bg-[#FAF8F4] px-6 py-24 md:px-16"
    >
      <div className="mx-auto max-w-6xl">
        <h2 className="max-w-2xl text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
          Built around how flats and trips actually run
        </h2>
        <p className="mt-4 max-w-xl text-base text-slate-600">
          Not a full personal finance app. Just the parts that stop arguments
          about money.
        </p>

        <div className="mt-12 grid gap-4 md:grid-cols-6">
          {/* Monthly snapshots */}
          <Card
            className="md:col-span-4"
            title="Close the month, keep the report"
            text="For homes that go on for months or years. Once a month is over, save it as a report: total spent, top category, who paid what. It stays the same even if things change later."
          >
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500">September 2026</p>
                  <p className="text-2xl font-bold text-slate-900">₹18,400</p>
                </div>
                <span className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
                  <Lock className="h-3 w-3" />
                  Closed
                </span>
              </div>

              <div className="mt-4 space-y-2.5">
                {categories.map((category) => (
                  <div key={category.label}>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-700">{category.label}</span>
                      <span className="font-semibold text-slate-900">
                        {category.amount}
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-slate-900"
                        style={{ width: `${category.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Bill scan */}
          <Card
            className="md:col-span-2"
            title="Scan the bill"
            text="Take a photo and the amount is filled in for you. You check it before saving."
          >
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm">
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-700">
                <ScanLine className="h-4 w-4" />
                Scanned from photo
              </div>
              <div className="mt-3 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Item</span>
                  <span className="font-medium text-slate-900">Groceries</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total</span>
                  <span className="font-medium text-slate-900">₹1,240</span>
                </div>
              </div>
              <p className="mt-3 rounded-lg bg-amber-50 px-2.5 py-2 text-xs text-amber-800">
                Please review before adding.
              </p>
            </div>
          </Card>

          {/* Custom split */}
          <Card
            className="md:col-span-2"
            title="Not everything is 50-50"
            text="Bigger room, bigger share. Set each person's amount yourself."
          >
            <ul className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm">
              {customSplit.map((row) => (
                <li
                  key={row.name}
                  className="flex items-center justify-between py-2.5"
                >
                  <span className="text-slate-800">
                    {row.name}
                    {row.note && (
                      <span className="ml-1.5 text-xs text-slate-400">
                        {row.note}
                      </span>
                    )}
                  </span>
                  <span className="font-semibold text-slate-900">
                    {row.amount}
                  </span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Two group modes */}
          <Card
            className="md:col-span-4"
            title="A home and a trip are not the same thing"
            text="Pick the kind of group you are making. A home keeps running, so it gets monthly reports. A trip ends, so it should end cleanly."
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-bold text-slate-900">Ongoing home</p>
                <p className="mt-1 text-xs text-slate-500">
                  Flatmates, couples
                </p>
                <ul className="mt-3 space-y-1.5 text-sm text-slate-700">
                  <li>Rent and bills every month</li>
                  <li>Monthly reports</li>
                  <li>Runs for months or years</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-bold text-slate-900">
                  Trip or event
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Goa, a wedding, a party
                </p>
                <ul className="mt-3 space-y-1.5 text-sm text-slate-700">
                  <li>A few days of spending</li>
                  <li>Settle up when it ends</li>
                  <li>No monthly reports needed</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
