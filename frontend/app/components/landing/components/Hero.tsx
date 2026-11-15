"use client";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { useAuth } from "@/app/context/authContext";

const chat = [
  { name: "Rahul", text: "who paid for the wifi this month??", mine: false },
  { name: "Aisha", text: "me. 999. last week. i literally told you", mine: false },
  { name: "Maya", text: "wait did i send rahul 500 or you?", mine: true },
  { name: "Rahul", text: "idk scroll up lol", mine: false },
  { name: "Aisha", text: "i'm done tracking this 🙃", mine: false },
];

const expenses = [
  { label: "Rent", paidBy: "Aisha", amount: "₹24,000" },
  { label: "Wi-Fi", paidBy: "Aisha", amount: "₹999" },
  { label: "Groceries", paidBy: "Rahul", amount: "₹1,500" },
];

export default function HeroSection() {
  const { isAuthenticated } = useAuth();

  return (
    <section className="bg-[#FAF8F4] px-6 pb-20 pt-8 md:px-16 lg:pt-16">
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <p className="text-sm font-semibold tracking-wide text-slate-500">
            For flatmates, couples and trips
          </p>

          <h1 className="mt-4 text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
            Rent is due.
            <br />
            Who paid for the Wi-Fi?
          </h1>

          <p className="mt-6 max-w-lg text-base leading-relaxed text-slate-600 md:text-lg">
            KharchaMate keeps one shared ledger for your flat, your trip or your
            couple. Add what you spent, everyone sees who owes whom, and you
            settle over UPI. No scrolling up through the group chat.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href={isAuthenticated ? "/dashboard" : "/auth"}
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              {isAuthenticated ? "Open dashboard" : "Start your first group"}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>

            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center rounded-xl px-5 py-3.5 text-sm font-semibold text-slate-700 underline decoration-slate-300 underline-offset-4 transition hover:decoration-slate-700"
            >
              See how it works
            </a>
          </div>

          <ul className="mt-6 flex flex-wrap gap-x-2 gap-y-2 text-sm text-slate-500">
            {["Free", "No card needed", "Works on your phone"].map((item) => (
              <li key={item} className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-emerald-600" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative flex flex-col gap-6 lg:block lg:h-[540px]">
          <div className="w-full max-w-xs lg:absolute lg:left-0 lg:top-0 lg:w-[270px] lg:-rotate-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
              Before: the group chat
            </p>

            <div className="border border-slate-200 bg-[#EFEAE2] p-3 shadow-sm">
              <div className="space-y-2">
                {chat.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.mine ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-xl px-3 py-2 text-[13px] leading-snug shadow-sm ${
                        message.mine
                          ? "bg-[#DCF8C6] text-slate-800"
                          : "bg-white text-slate-800"
                      }`}
                    >
                      {!message.mine && (
                        <p className="mb-0.5 text-[11px] font-semibold text-slate-500">
                          {message.name}
                        </p>
                      )}
                      {message.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full max-w-sm lg:absolute lg:right-0 lg:top-24 lg:z-10 lg:w-[350px]">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
              After: KharchaMate
            </p>

            <div className="border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.10)]">
              <div className="flex items-baseline justify-between">
                <div>
                  <p className="text-xs text-slate-500">Flat 402</p>
                  <p className="text-lg font-bold text-slate-900">October</p>
                </div>
                <p className="text-sm font-semibold text-slate-900">
                  ₹26,499
                  <span className="ml-1 text-xs font-normal text-slate-500">
                    total
                  </span>
                </p>
              </div>

              <ul className="mt-4 divide-y divide-slate-100 text-sm">
                {expenses.map((expense) => (
                  <li
                    key={expense.label}
                    className="flex items-center justify-between py-2.5"
                  >
                    <span className="text-slate-800">
                      {expense.label}
                      <span className="ml-2 text-xs text-slate-400">
                        paid by {expense.paidBy}
                      </span>
                    </span>
                    <span className="font-semibold text-slate-900">
                      {expense.amount}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 space-y-2 rounded-xl bg-slate-50 p-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Maya owes Aisha</span>
                  <span className="font-semibold text-slate-900">₹8,833</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Rahul owes Aisha</span>
                  <span className="font-semibold text-slate-900">₹7,333</span>
                </div>
              </div>

              <button
                type="button"
                tabIndex={-1}
                className="mt-4 w-full rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white"
              >
                Settle ₹8,833 via UPI
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}