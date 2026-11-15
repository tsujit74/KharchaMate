"use client";

import React, { useState } from "react";
import { AuthMode } from "./types/auth";
import AuthLayout from "./components/AuthLayout";
import AuthCard from "./components/AuthCard";
import AuthHeader from "./components/AuthHeader";
import AuthToggle from "./components/AuthToggle";
import AuthForm from "./components/AuthForm";
import AuthDivider from "./components/AuthDivider";
import SocialLogin from "./components/SocialLogin";
import AuthFooter from "./components/AuthFooter";
import { ChartBar, Coins, Sparkles, CheckCircle2 } from "lucide-react";

const AuthPage = () => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleToggle = (newMode: AuthMode) => {
    if (newMode === mode) return; // Edge case: prevent duplicate toggles

    setIsTransitioning(true);
    setTimeout(() => {
      setMode(newMode);
      setTimeout(() => setIsTransitioning(false), 150);
    }, 150);
  };

  return (
    <AuthLayout>
      {/* LEFT PANEL - Authentication Information */}
      <section className="hidden lg:flex lg:w-1/2 bg-[#FAF8F4] relative items-center justify-center overflow-hidden">
        

        <div className="relative z-10 text-center px-16 max-w-xl">
          {/* Authentication Heading */}
          <div className="mb-8">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              Your expenses,
              <br />
              all in one place.
            </h1>

            <p className="mt-5 text-lg text-slate-600 leading-relaxed max-w-md mx-auto">
              Sign in to access your groups, manage shared expenses, and keep
              track of every settlement.
            </p>
          </div>

          {/* Authentication Benefits */}
          <div className="space-y-4 mb-14 text-left max-w-sm mx-auto">
            <div className="flex items-center gap-4 text-slate-800">
              <div className="flex-shrink-0 w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-slate-900" />
              </div>
              <span className="font-semibold text-base">
                Access your expense groups
              </span>
            </div>

            <div className="flex items-center gap-4 text-slate-800">
              <div className="flex-shrink-0 w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-slate-900" />
              </div>
              <span className="font-semibold text-base">
                View balances and transactions
              </span>
            </div>

            <div className="flex items-center gap-4 text-slate-800">
              <div className="flex-shrink-0 w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-slate-900" />
              </div>
              <span className="font-semibold text-base">
                Manage settlements with ease
              </span>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="relative h-48">
            <div className="absolute top-0 left-12 animate-[bounce_4s_infinite]">
              <div className="w-20 h-20 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center">
                <ChartBar className="w-10 h-10 text-slate-700" />
              </div>
            </div>

            <div className="absolute top-8 right-16 animate-[bounce_4s_infinite_500ms]">
              <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center">
                <Coins className="w-9 h-9 text-slate-700" />
              </div>
            </div>

            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 animate-[bounce_4s_infinite_1000ms]">
              <div className="w-20 h-20 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center">
                <ChartBar className="w-10 h-10 text-slate-700" />
              </div>
            </div>

            <div className="absolute top-20 left-1/3 animate-[bounce_4s_infinite_1500ms]">
              <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-slate-600" />
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/50 to-transparent" />
      </section>

      {/* RIGHT PANEL Premium Auth Card */}
      <section className="w-full lg:w-1/2 relative flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-zinc-50 opacity-30" />

        <div
          className={`relative z-10 w-full px-1 max-w-md transition-all duration-300 ${
            isTransitioning ? "opacity-50 scale-98" : "opacity-100 scale-100"
          }`}
        >
          <AuthCard>
            <AuthHeader mode={mode} />
            <AuthToggle mode={mode} onToggle={handleToggle} />
            <AuthForm mode={mode} />
            <AuthDivider />
            <SocialLogin />
            <AuthFooter mode={mode} />
          </AuthCard>
        </div>
      </section>
    </AuthLayout>
  );
};

export default AuthPage;
