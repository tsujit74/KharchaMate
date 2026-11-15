import { Check, ScanLine, Users, Wallet } from "lucide-react";

const people = [
  { name: "Aisha", initial: "A", color: "bg-rose-100 text-rose-700" },
  { name: "Rahul", initial: "R", color: "bg-sky-100 text-sky-700" },
  { name: "Maya", initial: "M", color: "bg-amber-100 text-amber-700" },
];

function Avatar({
  initial,
  color,
  size = "h-8 w-8",
}: {
  initial: string;
  color: string;
  size?: string;
}) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full text-xs font-bold ${size} ${color}`}
    >
      {initial}
    </span>
  );
}

function CreateGroupVisual() {
  return (
    <div className="rounded-2xl border border-slate-300/80 bg-white p-5 shadow-sm shadow-slate-900/[0.03]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500">Your new group</p>
          <h4 className="mt-1 text-lg font-bold tracking-tight text-slate-900">
            Flat 402
          </h4>
        </div>

        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
          <Users className="h-5 w-5" />
        </span>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        {people.map((person) => (
          <Avatar
            key={person.name}
            initial={person.initial}
            color={person.color}
          />
        ))}

        <span className="flex h-8 items-center rounded-full border border-dashed border-slate-300 px-3 text-xs font-medium text-slate-500">
          + Add flatmate
        </span>
      </div>

      <div className="mt-5 rounded-xl bg-slate-50 p-3">
        <p className="text-xs font-medium text-slate-500">
          Choose your group type
        </p>

        <div className="mt-2 grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-slate-900 px-3 py-2.5 text-white">
            <p className="text-xs font-semibold">Ongoing home</p>
            <p className="mt-1 text-[11px] text-slate-300">
              Rent, bills, groceries
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white px-3 py-2.5">
            <p className="text-xs font-semibold text-slate-800">
              Trip or event
            </p>
            <p className="mt-1 text-[11px] text-slate-500">Travel, outings</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AddExpenseVisual() {
  return (
    <div className="rounded-2xl border border-slate-300/80 bg-white p-5 shadow-sm shadow-slate-900/[0.03]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">Add an expense</p>
          <p className="mt-1 text-xs text-slate-500">
            Record a shared purchase
          </p>
        </div>

        <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1.5 text-xs font-semibold text-blue-700">
          <ScanLine className="h-3.5 w-3.5" />
          Scan bill
        </span>
      </div>

      <div className="mt-5 space-y-2.5 text-sm">
        <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-3">
          <span className="text-slate-500">Description</span>
          <span className="font-semibold text-slate-900">Monthly Wi-Fi</span>
        </div>

        <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-3">
          <span className="text-slate-500">Total amount</span>
          <span className="font-bold text-slate-900">₹999.00</span>
        </div>

        <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-3">
          <span className="text-slate-500">Paid by</span>
          <span className="flex items-center gap-2 font-medium text-slate-900">
            <Avatar
              initial="A"
              color="bg-rose-100 text-rose-700"
              size="h-6 w-6"
            />
            Aisha
          </span>
        </div>

        <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-3 py-3">
          <span className="text-slate-500">Split method</span>
          <span className="font-semibold text-slate-900">Equal split</span>
        </div>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-slate-500">
        Split the cost fairly, without calculating everyone's share yourself.
      </p>
    </div>
  );
}

function SplitVisual() {
  return (
    <div className="rounded-2xl border border-slate-300/80 bg-white p-5 shadow-sm shadow-slate-900/[0.03]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">Monthly Wi-Fi</p>
          <p className="mt-1 text-xs text-slate-500">
            Paid by Aisha · Split equally
          </p>
        </div>

        <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-sm font-bold text-slate-900">
          ₹999
        </span>
      </div>

      <div className="my-4 border-t border-slate-100" />

      <div className="space-y-1">
        {people.map((person, index) => (
          <div
            key={person.name}
            className="flex items-center justify-between gap-3 rounded-xl px-2 py-2.5"
          >
            <span className="flex min-w-0 items-center gap-2.5">
              <Avatar initial={person.initial} color={person.color} />
              <span className="min-w-0">
                <span className="block text-sm font-medium text-slate-800">
                  {person.name}
                  {index === 0 ? " (you paid)" : ""}
                </span>
                <span className="block text-xs text-slate-500">
                  {index === 0 ? "Paid ₹999 · Share ₹333" : "Your share"}
                </span>
              </span>
            </span>

            <span className="shrink-0 text-sm font-bold text-slate-900">
              ₹333
            </span>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-start gap-2 rounded-xl bg-blue-50 px-3 py-3">
        <Wallet className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />
        <p className="text-xs leading-relaxed text-blue-800">
          Aisha covered the bill. Rahul and Maya each owe Aisha ₹333 for this
          expense.
        </p>
      </div>
    </div>
  );
}

function SettleVisual() {
  return (
    <div className="rounded-2xl border border-slate-300/80 bg-white p-5 shadow-sm shadow-slate-900/[0.03]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">
            Settle a balance
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Flat 402 · Expense repayment
          </p>
        </div>

        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
          <Check className="h-5 w-5" />
        </span>
      </div>

      <div className="mt-5 rounded-xl bg-slate-50 p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Avatar initial="R" color="bg-sky-100 text-sky-700" />
            <div>
              <p className="text-sm font-semibold text-slate-900">Rahul</p>
              <p className="text-xs text-slate-500">Pays</p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-lg font-bold tracking-tight text-slate-900">
              ₹333
            </p>
            <p className="text-xs text-slate-500">to Aisha</p>
          </div>
        </div>

        <div className="my-4 border-t border-slate-200" />

        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white">
            <Wallet className="h-4 w-4" />
          </span>
          Payment method
          <span className="ml-auto font-semibold text-slate-900">UPI</span>
        </div>
      </div>

      <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-3">
        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
        <div>
          <p className="text-sm font-semibold text-emerald-800">
            Settlement recorded
          </p>
          <p className="mt-1 text-xs leading-relaxed text-emerald-700">
            Once the payment is confirmed in the app, the group's outstanding
            balance is updated.
          </p>
        </div>
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
        Payments are made through your chosen payment method. KharchaMate
        records settlement status; it does not independently verify bank
        transfers.
      </p>
    </div>
  );
}

const steps = [
  {
    number: "01",
    title: "Create your shared space",
    text: "Bring your flatmates, partner, friends, or travel group together. Choose an ongoing home for everyday expenses or a trip group for one-time plans.",
    visual: <CreateGroupVisual />,
  },
  {
    number: "02",
    title: "Record what you spend",
    text: "Add rent, Wi-Fi, groceries, travel, or any shared purchase. Enter the details manually or scan a bill, then choose an equal or custom split.",
    visual: <AddExpenseVisual />,
  },
  {
    number: "03",
    title: "Know who owes whom",
    text: "Everyone can see who paid, how the expense was divided, and what they owe. Keep shared expenses organized without scattered screenshots or spreadsheets.",
    visual: <SplitVisual />,
  },
  {
    number: "04",
    title: "Settle up and move on",
    text: "Repay the person you owe using your preferred payment method. Record the settlement in KharchaMate and keep balances and payment history organized.",
    visual: <SettleVisual />,
  },
];

export default function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-title"
      className="scroll-mt-24 bg-white px-5 py-20 sm:px-6 md:px-16 md:py-24"
    >
      <div className="mx-auto max-w-5xl">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold tracking-wide text-slate-500">
            HOW KHARCHAMATE WORKS
          </p>

          <h2
            id="how-it-works-title"
            className="mt-3 max-w-xl text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-[2.75rem] md:leading-tight"
          >
            From shared expenses to settled balances, in four simple steps.
          </h2>

          <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600">
            One place for your shared spending, clear balances, and hassle-free
            settlements — whether you live together or travel together.
          </p>
        </div>

        <div className="mt-12 space-y-12 md:mt-16 md:space-y-20">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="grid items-center gap-6 md:grid-cols-2 md:gap-14"
            >
              <div
                className={`flex gap-4 md:gap-5 ${
                  index % 2 === 1 ? "md:order-2" : ""
                }`}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-sm font-bold text-slate-900 shadow-sm">
                  {step.number}
                </span>

                <div className="pt-1">
                  <h3 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                    {step.title}
                  </h3>

                  <p className="mt-3 max-w-md text-sm leading-7 text-slate-600 sm:text-base">
                    {step.text}
                  </p>
                </div>
              </div>

              <div
                className={`w-full min-w-0 md:max-w-md ${
                  index % 2 === 1
                    ? "md:order-1 md:justify-self-start"
                    : "md:justify-self-end"
                }`}
              >
                {step.visual}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
