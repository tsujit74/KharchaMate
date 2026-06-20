"use client";

import Link from "next/link";
import { ShieldCheck, Star } from "lucide-react";
import { useAuth } from "@/app/context/authContext";
import AppMockup from "./AppMockup";

export default function HeroSection() {
  const { isAuthenticated } = useAuth();

  return (
    <section className="relative min-h-[85vh] flex items-center px-6 md:px-16 pt-10 bg-white overflow-hidden">
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-600 text-sm font-medium">
            <ShieldCheck className="w-4 h-4 text-green-600" />
            Built with security & privacy first
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-slate-900">
            Track, Split, and
            <br />
            <span className="text-blue-600">Settle Up — No Drama.</span>
          </h1>

          <p className="text-base text-slate-500 max-w-xl leading-relaxed">
            KharchaMate helps flatmates, couples, and friends split shared
            expenses clearly — from rent and dinners to trips and subscriptions.
            No messy chats. No math stress.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link
              href={isAuthenticated ? "/dashboard" : "/auth"}
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all text-sm"
            >
              {isAuthenticated ? "Open Dashboard" : "Get Started Free"}
            </Link>

            {!isAuthenticated && (
              <Link
                href="/auth"
                className="px-8 py-3 bg-white border border-slate-200 text-slate-700 font-semibold rounded-2xl hover:bg-slate-50 transition-all text-sm"
              >
                Log in
              </Link>
            )}
          </div>

          <div className="pt-4 text-sm text-slate-500 flex items-center gap-2">
            <Star className="text-yellow-500 w-4 h-4" />
            <span className="font-medium">
              Flatmates in Bengaluru use it daily.
            </span>
          </div>

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

        <AppMockup />
      </div>
    </section>
  );
}