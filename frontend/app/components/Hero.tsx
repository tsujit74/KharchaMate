"use client";

import Link from "next/link";

import {
  ArrowRight,
  Plus,
  Users,
  Calculator,
  CheckCircle2,
  ShieldCheck,
  Star,
  CreditCard,
  LayoutDashboard,
  ReceiptText,
} from "lucide-react";

import { useAuth } from "@/app/context/authContext";

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <main className="bg-[#FCFCFD] text-[#1A1A1E] overflow-x-hidden">
      {/* HERO */}
      <section className="relative min-h-[85vh] flex items-center px-6 md:px-16 pt-10 bg-white overflow-hidden">
        {/* Soft Fintech Background */}
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full -z-10" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[50 knex] bg-indigo-500/10 blur-[120px] rounded-full -z-10" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* LEFT SIDE */}
          <div className="space-y-6">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-600 text-sm font-medium">
              <ShieldCheck className="w-4 h-4 text-green-600" />
              Built with security & privacy first
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-slate-900">
              Track, Split, and<br />
              <span className="text-blue-600">Settle Up — No Drama.</span>
            </h1>

            {/* Subtext */}
            <p className="text-base text-slate-500 max-w-xl leading-relaxed">
              KharchaMate helps flatmates, couples, and friends split shared expenses
              clearly — from rent and dinners to trips and subscriptions. No messy chats.
              No math stress.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href={isAuthenticated ? "/dashboard" : "/signup"}
                className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all text-sm"
              >
                {isAuthenticated ? "Open Dashboard" : "Get Started Free"}
              </Link>

              {!isAuthenticated && (
                <Link
                  href="/login"
                  className="px-8 py-3 bg-white border border-slate-200 text-slate-700 font-semibold rounded-2xl hover:bg-slate-50 transition-all text-sm"
                >
                  Log in
                </Link>
              )}
            </div>

            {/* Tiny testimonial / social proof */}
            <div className="pt-4 text-sm text-slate-500 flex items-center gap-2">
              <Star className="text-yellow-500 w-4 h-4" />
              <span className="font-medium">Flatmates in Bengaluru use it daily.</span>
            </div>

            {/* Trust Stats */}
            <div className="pt-6 grid grid-cols-3 gap-6 border-t border-slate-100 max-w-md">
              <div>
                <p className="text-xl font-bold text-slate-900">₹0</p>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                  Hidden Fees
                </p>
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900">99.99%</p>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                  Secure
                </p>
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900">24/7</p>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                  Access
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE – App mock */}
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
                <aside className="border-r border-slate-200 bg-slate-50 flex flex-col items-center py-5 gap-5">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                    KM
                  </div>
                  <LayoutDashboard className="w-5 h-5 text-blue-600" />
                  <ReceiptText className="w-5 h-5 text-slate-400" />
                  <Users className="w-5 h-5 text-slate-400" />
                  <ShieldCheck className="w-5 h-5 text-slate-400" />
                </aside>

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

                    <div className="rounded-2xl border border-slate-200 p-4">
                      <p className="font-semibold mb-3">Balances</p>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span>Aisha owes</span>
                          <span className="font-semibold text-red-500">₹1150</span>
                        </div>
                        <div className="flex justify-between">
                          <span>You owe Rahul</span>
                          <span className="font-semibold text-green-600">₹420</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Maya owes</span>
                          <span className="font-semibold text-red-500">₹890</span>
                        </div>
                      </div>
                    </div>
                  </div>

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
        </div>
      </section>

      {/* PROBLEM – Strengthened copy */}
      <section className="py-28 px-6 md:px-16">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-4xl font-bold">
              Shared expenses{" "}
              <span className="text-gray-400">ruin friendships.</span>
            </h2>
            <p className="mt-6 text-lg text-gray-500">
              Forgetting who paid, splitting manually, and constant follow‑ups
              turn small amounts into big tension.
            </p>
            <p className="mt-4 text-base text-gray-500">
              Most people solve this with WhatsApp notes, screenshots, and trust —
              which doesn’t scale when you live with more than 2 people.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 bg-white border rounded-xl shadow-sm">
              <Users className="mb-4 text-red-500" />
              <h3 className="font-semibold">Awkward Reminders</h3>
              <p className="text-sm text-gray-500 mt-1">
                “Hey, did you pay the bill?” turned into “I told you already.”
              </p>
            </div>
            <div className="p-6 bg-white border rounded-xl shadow-sm">
              <Calculator className="mb-4 text-orange-500" />
              <h3 className="font-semibold">Wrong Calculations</h3>
              <p className="text-sm text-gray-500 mt-1">
                One person ends up paying more over time and nobody notices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SOLUTION – Clear value props */}
      <section className="py-20 px-6 md:px-16 bg-black text-white mx-4 md:mx-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-6">
            Built for shared living.
          </h2>
          <p className="text-lg text-gray-300 text-center mb-12 max-w-2xl mx-auto">
            Not a full personal finance app — just the pieces that actually
            matter for flatmates, couples, and friends.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Plus />,
                title: "Create Groups",
                desc: "Split by people, not by receipts.",
              },
              {
                icon: <Calculator />,
                title: "Auto‑Split",
                desc: "Every expense is split fairly in seconds.",
              },
              {
                icon: <CheckCircle2 />,
                title: "Clear Balances",
                desc: "See who owes whom — no more guessing.",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="p-10 bg-zinc-900 border border-zinc-800 rounded-2xl"
              >
                <div className="w-14 h-14 bg-white text-black flex items-center justify-center mb-6 rounded-xl">
                  {f.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-gray-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS – slightly more detailed */}
      <section className="py-28 px-6 md:px-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-6 text-center">
            How it works in 4 steps
          </h2>
          <p className="text-lg text-gray-500 text-center max-w-2xl mx-auto mb-12">
            KharchaMate does the math; you just add the amount and who was there.
          </p>

          <div className="grid md:grid-cols-4 gap-10">
            {[
              { step: "01", label: "Create Group", text: "Add your flatmates or friends." },
              { step: "02", label: "Add Expense", text: "Add rent, food, or bills in one tap." },
              { step: "03", label: "Split Automatically", text: "Everyone’s share is calculated instantly." },
              { step: "04", label: "Settle Easily", text: "Settle via UPI, bank, or cash — we track it." },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <span className="text-6xl font-black text-gray-100">
                  {item.step}
                </span>
                <p className="mt-2 font-semibold text-slate-900">{item.label}</p>
                <p className="mt-1 text-sm text-gray-500">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF / INTERVIEWER‑HOOK */}
      <section className="py-20 px-6 md:px-16 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-6">
            Loved by paying users
          </h3>
          <p className="text-lg text-gray-500 text-center mb-12">
            Flatmates and couples use KharchaMate to stop arguments over “who paid last.”
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-white border rounded-2xl shadow-sm">
              <CreditCard className="mb-3 text-blue-600" />
              <p className="text-lg font-semibold">Flatmates in Bengaluru</p>
              <p className="text-sm text-gray-500 mt-2">
                “We stopped fighting over rent and bills. Now everyone knows
                what they owe.”
              </p>
            </div>

            <div className="p-6 bg-white border rounded-2xl shadow-sm">
              <Plus className="mb-3 text-green-600" />
              <p className="text-lg font-semibold">Couple managing meals</p>
              <p className="text-sm text-gray-500 mt-2">
                “Adds our expenses in real time and keeps us honest.”
              </p>
            </div>

            <div className="p-6 bg-white border rounded-2xl shadow-sm">
              <CheckCircle2 className="mb-3 text-purple-600" />
              <p className="text-lg font-semibold">College roommates</p>
              <p className="text-sm text-gray-500 mt-2">
                “No more ‘I forgot to pay’ excuses. Everyone owes only what they owe.”
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* STRONG CTA – “Investor / Recruiter” vibe */}
      <section className="py-28 px-6 md:px-16 bg-gray-50 text-center">
        <ShieldCheck className="mx-auto mb-6 text-green-500 w-14 h-14" />
        <h2 className="text-4xl font-bold mb-4">
          Built for real people, not just mockups
        </h2>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10">
          KharchaMate focuses on solving one problem exceptionally well:
          shared expenses between friends, couples, and flatmates.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href={isAuthenticated ? "/dashboard" : "/signup"}
            className="group px-8 py-4 bg-black text-white font-semibold shadow-xl shadow-black/10 hover:shadow-black/20 hover:-translate-y-1 transition-all flex items-center gap-2"
          >
            Start Free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* Optional: “For interviewers” CTA */}
          <Link
            href="/demo"
            className="group px-8 py-4 border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 hover:-translate-y-1 transition-all flex items-center gap-2"
          >
            View Product Demo
          </Link>
        </div>

        <p className="text-sm text-gray-500 mt-6">
          No card required. No long onboarding. Just login and start tracking.
        </p>
      </section>
    </main>
  );
}