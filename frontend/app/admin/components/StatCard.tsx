import { ReactNode } from "react";
import Link from "next/link";

type StatCardProps = {
  title: string;
  value: number | string;
  subtitle?: string;
  icon?: ReactNode;
  href?: string;
};

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  href,
}: StatCardProps) {
  const content = (
    <div className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            {title}
          </p>

          <p className="mt-2 text-xl font-black leading-tight tracking-tight text-slate-950">
            {value}
          </p>

          {subtitle && (
            <p className="mt-1 text-xs text-slate-500">
              {subtitle}
            </p>
          )}
        </div>

        {icon && (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-600 ring-1 ring-slate-100 transition group-hover:bg-slate-950 group-hover:text-white">
            {icon}
          </div>
        )}
      </div>
    </div>
  );

  return href ? (
    <Link href={href} className="block">
      {content}
    </Link>
  ) : (
    content
  );
}