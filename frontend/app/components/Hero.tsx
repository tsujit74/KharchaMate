"use client"

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
      <section className="relative min-h-screen flex items-center px-6 md:px-16">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-50/50 blur-[120px] -z-10" />
        <div className="absolute bottom-[10%] left-[-5%] w-[400px] h-[400px] bg-purple-50/50 blur-[120px] -z-10" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Split Expenses. <br />
              <span className="text-gray-400">Stay Sorted.</span>
            </h1>

            <p className="mt-8 text-xl text-gray-500 max-w-xl">
              KharchaMate helps groups track shared expenses clearly - no
              awkward reminders, no confusing math.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href={isAuthenticated ? "/dashboard" : "/signup"}
                className="group px-8 py-4 bg-black text-white font-semibold shadow-xl shadow-black/10 hover:shadow-black/20 hover:-translate-y-1 transition-all flex items-center gap-2"
              >
                Get Start
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href={isAuthenticated ? "/dashboard" : "/login"}
                className="px-8 py-4 bg-white border border-gray-200 text-gray-900 font-semibold hover:bg-gray-50 transition-all flex items-center gap-2"
              >
                {isAuthenticated ? "Dashboard":"Login"}
              </Link>
            </div>
          </div>

          <div className="relative lg:h-[450px] flex items-center justify-center mt-10">
            <div className="relative w-full max-w-[450px] aspect-[4/5] bg-white shadow-xl border border-gray-100 p-4 overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tr from-gray-50 to-transparent pointer-events-none" />
              <div className="h-full w-full bg-gray-50 rounded-[2rem] p-6 flex flex-col gap-6">
                <div className="flex justify-between items-center">
                  <div className="h-4 w-24 bg-gray-200 rounded-full" />
                  <div className="h-8 w-8 bg-black rounded-full" />
                </div>
                <div className="h-32 w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col justify-between">
                  <div className="h-3 w-1/3 bg-gray-100 rounded-full" />
                  <div className="h-8 w-1/2 bg-gray-900 rounded-lg" />
                </div>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 shadow-sm transition-all hover:scale-[1.02]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-50 rounded-lg" />
                        <div className="space-y-2">
                          <div className="h-2 w-16 bg-gray-200 rounded-full" />
                          <div className="h-2 w-10 bg-gray-100 rounded-full" />
                        </div>
                      </div>
                      <div className="h-3 w-12 bg-green-100 rounded-full" />
                    </div>
                  ))}
                </div>
              </div>
              {/* Floating elements for depth */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white rounded-3xl rounded-bl-none shadow-xl border border-gray-100 p-4 animate-bounce hover:pause">
                <Plus className="w-8 h-8 text-black mb-2" />
                <div className="h-2 w-12 bg-gray-100 rounded-full" />
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
