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
import {
  ChartBar,
  Coins,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

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
      {/* LEFT PANEL- Premium White Brand Panel */}
      <section className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-white via-gray-50 to-gray-100 relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100/40 via-transparent to-blue-100/40" />

        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-20 w-2 h-2 bg-red-400 rounded-full animate-ping delay-0 opacity-40" />
          <div className="absolute top-40 right-30 w-3 h-3 bg-blue-400 rounded-full animate-ping delay-300 opacity-35" />
          <div className="absolute bottom-20 left-1/3 w-2 h-2 bg-indigo-400 rounded-full animate-ping delay-700 opacity-40" />
          <div className="absolute bottom-40 right-1/4 w-2.5 h-2.5 bg-purple-400 rounded-full animate-ping delay-1000 opacity-35" />
        </div>

        <div className="relative z-10 text-center px-16 max-w-xl">
          <div className="mb-10">
            <div className="inline-flex items-center gap-4 group">
              <div className="relative">
                <div className="absolute inset-0 bg-purple-200 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Coins className="w-16 h-16 text-purple-600" />
              </div>
              <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">
                KharchaMate
              </h1>
            </div>
          </div>

          <p className="text-2xl text-gray-600 mb-10 font-medium leading-relaxed">
            Split expenses. Track money.
            <span className="text-purple-600 font-bold"> Stay stress-free.</span>
          </p>

          <div className="space-y-4 mb-14">
            <div className="flex items-center gap-4 text-gray-800 group hover:translate-x-2 transition-transform duration-300">
              <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <CheckCircle2 className="w-5 h-5 text-purple-600" />
              </div>
              <span className="font-semibold text-lg">Track group expenses</span>
            </div>
            <div className="flex items-center gap-4 text-gray-800 group hover:translate-x-2 transition-transform duration-300">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
              </div>
              <span className="font-semibold text-lg">Split bills instantly</span>
            </div>
            <div className="flex items-center gap-4 text-gray-800 group hover:translate-x-2 transition-transform duration-300">
              <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                <CheckCircle2 className="w-5 h-5 text-indigo-600" />
              </div>
              <span className="font-semibold text-lg">No confusion in payments</span>
            </div>
          </div>

          <div className="relative h-56">
            <div className="absolute top-0 left-12 animate-[bounce_3s_infinite]">
              <div className="relative">
                <div className="absolute inset-0 bg-purple-200/50 rounded-full blur-xl" />
                <ChartBar className="w-20 h-20 text-purple-500/80" />
              </div>
            </div>
            <div className="absolute top-8 right-16 animate-[bounce_3s_infinite_500ms]">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-200/50 rounded-full blur-xl" />
                <Coins className="w-16 h-16 text-blue-500/80" />
              </div>
            </div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 animate-[bounce_3s_infinite_1000ms]">
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-200/50 rounded-full blur-xl" />
                <ChartBar className="w-18 h-18 text-indigo-500/80" />
              </div>
            </div>
            <div className="absolute top-20 left-1/3 animate-[bounce_3s_infinite_1500ms]">
              <div className="relative">
                <div className="absolute inset-0 bg-purple-200/40 rounded-full blur-xl" />
                <Sparkles className="w-12 h-12 text-purple-500/70" />
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-purple-300/50 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/60 to-transparent" />
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