"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { useAuth } from "@/app/context/authContext";

export default function CTASection() {
  const { isAuthenticated } = useAuth();

  return (
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
  );
}