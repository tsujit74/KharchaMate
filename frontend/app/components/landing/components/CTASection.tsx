"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/app/context/authContext";

export default function CTASection() {
  const { isAuthenticated } = useAuth();

  return (
    <section className="bg-white px-6 py-24 md:px-16">
      <div className="mx-auto max-w-3xl rounded-3xl bg-[#F1ECE3] px-8 py-14 text-center md:px-14">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
          Make the next rent day boring.
        </h2>

        <p className="mx-auto mt-4 max-w-md text-base text-slate-600">
          Create a group, add your flatmates, and put the first expense in. It
          takes about a minute.
        </p>

        <Link
          href={isAuthenticated ? "/dashboard" : "/auth"}
          className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          {isAuthenticated ? "Open dashboard" : "Start your first group"}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>

        <p className="mt-4 text-xs text-slate-500">Free. No card needed.</p>
      </div>
    </section>
  );
}
