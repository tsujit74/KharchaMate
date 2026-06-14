import React from "react";
import { Activity } from "lucide-react";

type Props = {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  subtext: string;
  iconStyle?: string;
};

export default function StatCard({
  icon,
  label,
  value,
  subtext,
  iconStyle,
}: Props) {
  return (
    <div className="group flex items-center justify-between rounded-2xl border border-slate-200/70 bg-white/80 backdrop-blur-md p-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.02)] hover:border-slate-300">
      
      {/* Left */}
      <div className="flex items-center gap-2">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-colors ${iconStyle}`}
        >
          {icon}
        </div>

        <div className="flex flex-col space-y-0.5">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            {label}
          </p>

          <h4 className="text-xl font-bold text-slate-800 tracking-tight leading-none">
            {value}
          </h4>
        </div>
      </div>

      {/* Right */}
      <div className="flex flex-col items-end space-y-2">
        <Activity className="h-3.5 w-3.5 text-slate-300 group-hover:text-indigo-400 transition-colors" />
        <p className="text-[11px] font-medium text-slate-400 whitespace-nowrap">
          {subtext}
        </p>
      </div>
    </div>
  );
}