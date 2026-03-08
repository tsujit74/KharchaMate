"use client";

import { ReactNode } from "react";
import Link from "next/link";

type StatCardProps = {
  title: string;
  value: number | string;
  subtitle?: string;
  icon?: ReactNode;
  href?: string; // optional link
};

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  href,
}: StatCardProps) {
  const cardContent = (
    <div className="group relative bg-white border border-slate-200 rounded-1xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-start justify-between cursor-pointer">
        <div className="space-y-2">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            {title}
          </p>

          <p className="text-2xl font-bold text-slate-900">{value}</p>

          {subtitle && (
            <p className="text-xs text-slate-400">{subtitle}</p>
          )}
        </div>

        {icon && (
          <div className="p-2 bg-slate-100 rounded-xl text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition">
            {icon}
          </div>
        )}
      </div>
    </div>
  );

  // Wrap with Link if href exists
  return href ? <Link href={href}>{cardContent}</Link> : cardContent;
}