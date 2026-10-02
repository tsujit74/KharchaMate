"use client";

import {
  BarChart3,
  LayoutDashboard,
  MoreHorizontal,
  Receipt,
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
];

export default function MobileGroupNavigation({
  activeSection,
  onSectionChange,
}: Props) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-[9999] flex border-t bg-white md:hidden">
      <nav className="grid w-full grid-cols-5">
        {navigationItems.map((item) => {
          const active = activeSection === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSectionChange(item.id)}
              className={`flex flex-col items-center justify-center gap-1 px-2 py-3 text-xs font-medium transition ${
                active
                  ? "text-slate-900"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => onSectionChange("more")}
          className={`flex flex-col items-center justify-center gap-1 px-2 py-3 text-xs font-medium transition ${
            activeSection === "more" || activeSection === "members"
              ? "text-slate-900"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <MoreHorizontal className="h-5 w-5" />
          <span>More</span>
        </button>
      </nav>
    </div>
  );
}