"use client";

import {
  BarChart3,
  LayoutDashboard,
  MoreHorizontal,
  Receipt,
  Users,
  WalletCards,
} from "lucide-react";

type Section =
  | "overview"
  | "expenses"
  | "settlement"
  | "insights"
  | "members"
  | "more";

type Props = {
  activeSection: Section;
  onSectionChange: (section: Section) => void;
};

const navigationItems = [
  {
    id: "overview" as Section,
    label: "Overview",
    icon: LayoutDashboard,
  },
  {
    id: "expenses" as Section,
    label: "Expenses",
    icon: Receipt,
  },
  {
    id: "settlement" as Section,
    label: "Settlement",
    icon: WalletCards,
  },
  {
    id: "insights" as Section,
    label: "Insights",
    icon: BarChart3,
  },
  {
    id: "members" as Section,
    label: "Members",
    icon: Users,
  },
];

export default function GroupNavigation({
  activeSection,
  onSectionChange,
}: Props) {
  return (
    <aside className="hidden min-h-screen w-64 shrink-0 border-r bg-white md:flex">
      <div className="flex w-full flex-col p-4">
        <div className="mb-6 px-2">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Group Workspace
          </p>

          <h2 className="mt-1 text-lg font-semibold text-slate-900">
            Manage Group
          </h2>
        </div>

        <nav className="space-y-1">
          {navigationItems.map((item) => {
            const active = activeSection === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSectionChange(item.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="my-5 border-t" />

        <button
          type="button"
          onClick={() => onSectionChange("more")}
          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
            activeSection === "more"
              ? "bg-slate-900 text-white"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          }`}
        >
          <MoreHorizontal className="h-4 w-4 shrink-0" />
          <span>More</span>
        </button>

        <div className="mt-auto border-t pt-4">
          <p className="px-2 text-xs leading-5 text-slate-400">
            Additional group tools will appear here.
          </p>
        </div>
      </div>
    </aside>
  );
}