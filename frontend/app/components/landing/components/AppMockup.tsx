import {
  LayoutDashboard,
  ReceiptText,
  Users,
  ShieldCheck,
} from "lucide-react";

export default function AppMockup() {
  return (
    <div className="relative">
      <div className="absolute -top-8 -right-8 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-indigo-500/10 rounded-full blur-3xl" />

      <div className="relative bg-white rounded-[2rem] border border-slate-200 shadow-[0_20px_70px_rgba(15,23,42,0.12)] overflow-hidden">
        <div className="h-14 border-b border-slate-200 flex items-center justify-between px-5 bg-slate-50/70">
          <div className="font-semibold text-slate-800">KharchaMate</div>

          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
        </div>

        <div className="grid grid-cols-[72px_1fr] min-h-[420px]">
          {/* Sidebar */}
          <aside className="border-r border-slate-200 bg-slate-50 flex flex-col items-center py-5 gap-5">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              KM
            </div>

            <LayoutDashboard className="w-5 h-5 text-blue-600" />
            <ReceiptText className="w-5 h-5 text-slate-400" />
            <Users className="w-5 h-5 text-slate-400" />
            <ShieldCheck className="w-5 h-5 text-slate-400" />
          </aside>

          {/* Content */}
          <div className="p-5 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Group View</p>
                <h3 className="text-xl font-bold">Goa Trip 2024</h3>
              </div>

              <div className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
                All settled
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Recent Expenses */}
              <div className="rounded-2xl border border-slate-200 p-4">
                <p className="font-semibold mb-3">Recent Expenses</p>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Dinner</span>
                    <span className="font-semibold">₹2400</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Fuel</span>
                    <span className="font-semibold">₹1500</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Groceries</span>
                    <span className="font-semibold">₹980</span>
                  </div>
                </div>
              </div>

              {/* Balances */}
              <div className="rounded-2xl border border-slate-200 p-4">
                <p className="font-semibold mb-3">Balances</p>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Aisha owes</span>
                    <span className="font-semibold text-red-500">
                      ₹1150
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>You owe Rahul</span>
                    <span className="font-semibold text-green-600">
                      ₹420
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Maya owes</span>
                    <span className="font-semibold text-red-500">
                      ₹890
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Settle Up Card */}
            <div className="rounded-2xl bg-blue-600 text-white p-4">
              <p className="text-sm text-blue-100">Settle Up</p>

              <div className="mt-2 flex items-center justify-between">
                <span className="font-semibold">Rahul</span>
                <span className="font-semibold">- ₹420</span>
              </div>

              <button className="mt-4 w-full py-3 rounded-xl bg-white text-blue-600 font-semibold">
                Settle Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}