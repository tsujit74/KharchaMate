"use client";

import Link from "next/link";

import {
  ArrowRight,
  Plus,
  Users,
  Calculator,
  CheckCircle2,
  ShieldCheck,
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
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full -z-10" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* LEFT SIDE */}
          <div className="space-y-6">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-600 text-sm font-medium">
              <ShieldCheck className="w-4 h-4 text-green-600" />
              Secure. Transparent. No awkward reminders.
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-slate-900">
              Split Smarter. <br />
              <span className="text-blue-600">Stay Friends.</span>
            </h1>

            {/* Subtext */}
            <p className="text-base text-slate-500 max-w-xl leading-relaxed">
              KharchaMate helps flatmates, couples, and friends split expenses
              clearly — from rent and dinners to trips and subscriptions. No
              confusion. No math stress.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href={isAuthenticated ? "/dashboard" : "/signup"}
                className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all text-sm"
              >
                {isAuthenticated ? "Go to Dashboard" : "Get Started Free"}
              </Link>

              {!isAuthenticated && (
                <Link
                  href="/login"
                  className="px-8 py-3 bg-white border border-slate-200 text-slate-700 font-semibold rounded-2xl hover:bg-slate-50 transition-all text-sm"
                >
                  Login
                </Link>
              )}
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

          {/* RIGHT SIDE */}
          <div className="relative flex items-center justify-center mt-10 lg:mt-0">
            <div className="w-full max-w-[400px] bg-white rounded-[2.5rem] border-[8px] border-slate-900 shadow-xl p-6 space-y-6">
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase">
                  Total Balance
                </p>
                <h2 className="text-3xl font-extrabold text-slate-900">
                  ₹18,420
                </h2>
              </div>

              <div className="bg-blue-600 rounded-2xl p-5 text-white">
                <p className="text-xs uppercase text-blue-200 font-bold">
                  Active Group
                </p>
                <h3 className="text-lg font-bold mt-1">
                  Flatmates
                </h3>
                <p className="text-sm mt-2 text-blue-100">
                  You are owed ₹2,450
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { name: "Zomato Dinner", amount: "-₹1,250" },
                  { name: "Uber Ride", amount: "-₹320" },
                  { name: "Electricity Bill", amount: "+₹2,100" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center p-3 bg-slate-50 rounded-xl"
                  >
                    <span className="text-sm font-medium text-slate-800">
                      {item.name}
                    </span>
                    <span
                      className={`font-semibold ${
                        item.amount.startsWith("+")
                          ? "text-green-600"
                          : "text-slate-900"
                      }`}
                    >
                      {item.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="py-28 px-6 md:px-16">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-4xl font-bold">
              Group expenses{" "}
              <span className="text-gray-400">break friendships</span>
            </h2>
            <p className="mt-6 text-lg text-gray-500">
              Forgetting who paid, splitting manually, and constant follow-ups
              create unnecessary tension.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 bg-white border">
              <Users className="mb-4 text-red-500" />
              <h3 className="font-semibold">Awkward Reminders</h3>
            </div>
            <div className="p-6 bg-white border">
              <Calculator className="mb-4 text-orange-500" />
              <h3 className="font-semibold">Wrong Calculations</h3>
            </div>
          </div>
        </div>
      </section>

      {/* SOLUTION */}
      <section className="py-20 px-6 md:px-16 bg-black text-white mx-4 md:mx-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Simple. Clear. Reliable.
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Plus />, title: "Create Groups" },
              { icon: <Calculator />, title: "Auto Split" },
              { icon: <CheckCircle2 />, title: "Clear Balances" },
            ].map((f, i) => (
              <div key={i} className="p-10 bg-zinc-900 border border-zinc-800">
                <div className="w-14 h-14 bg-white text-black  flex items-center justify-center mb-6">
                  {f.icon}
                </div>
                <h3 className="text-xl font-semibold">{f.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-28 px-6 md:px-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-16">How it works</h2>

          <div className="grid md:grid-cols-4 gap-10">
            {[
              "Create Group",
              "Add Expense",
              "Split Automatically",
              "Settle Easily",
            ].map((step, i) => (
              <div key={i}>
                <span className="text-6xl font-black text-gray-100">
                  {`0${i + 1}`}
                </span>
                <p className="mt-2 font-semibold">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 px-6 md:px-16 bg-gray-50 text-center">
        <ShieldCheck className="mx-auto mb-6 text-green-500 w-14 h-14" />
        <h2 className="text-4xl font-bold mb-6">Built for real - world use</h2>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10">
          KharchaMate focuses on solving one problem well - shared expenses.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href={isAuthenticated ? "/dashboard" : "/signup"}
            className="group px-8 py-4 bg-black text-white font-semibold shadow-xl shadow-black/10 hover:shadow-black/20 hover:-translate-y-1 transition-all flex items-center gap-2"
          >
            Start Free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </main>
  );
}
