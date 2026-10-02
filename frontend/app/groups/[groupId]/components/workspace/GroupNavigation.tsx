"use client";

import {
  BarChart3,
  LayoutDashboard,
  MoreHorizontal,
  Receipt,
  Users,
  WalletCards,
  type LucideIcon,
} from "lucide-react";

export type Section =
  | "overview"
  | "expenses"
  | "settlement"
  | "insights"
  | "members"
  | "more";

type NavigationItem = {
  id: Section;
  label: string;
  icon: LucideIcon;
  showOnMobile: boolean;
};

export const navigationItems: NavigationItem[] = [
  {
    id: "overview",
    label: "Overview",
    icon: LayoutDashboard,
    showOnMobile: true,
  },
  { id: "expenses", label: "Expenses", icon: Receipt, showOnMobile: true },
  {
    id: "settlement",
    label: "Settlement",
    icon: WalletCards,
    showOnMobile: true,
  },
  { id: "insights", label: "Insights", icon: BarChart3, showOnMobile: true },
  { id: "members", label: "Members", icon: Users, showOnMobile: false },
];

export const moreItem: NavigationItem = {
  id: "more",
  label: "More",
  icon: MoreHorizontal,
  showOnMobile: true,
};

type Props = {
  activeSection: Section;
  onSectionChange: (section: Section) => void;
};

type GroupNavigationProps = Props & {
  groupName?: string;
};

type ButtonProps = Props & {
  item: NavigationItem;
};

function SidebarButton({ item, activeSection, onSectionChange }: ButtonProps) {
  const active = activeSection === item.id;
  const Icon = item.icon;

  return (
    <button
      type="button"
      onClick={() => onSectionChange(item.id)}
      aria-current={active ? "page" : undefined}
      className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 ${
        active
          ? "bg-slate-900 text-white shadow-sm"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      }`}
    >
      <Icon
        className={`h-4 w-4 shrink-0 ${
          active ? "text-white" : "text-slate-400 group-hover:text-slate-700"
        }`}
      />
      <span>{item.label}</span>
    </button>
  );
}

export default function GroupNavigation({
  groupName = "Group",
  activeSection,
  onSectionChange,
}: GroupNavigationProps) {
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 self-start border-r border-slate-200 bg-white md:block">
      <div className="flex h-full flex-col overflow-y-auto px-3 py-5">
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-sm font-semibold uppercase text-white">
            {groupName.charAt(0)}
          </span>

          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Group workspace
            </p>
            <h2
              title={groupName}
              className="truncate text-sm font-semibold text-slate-900"
            >
              {groupName}
            </h2>
          </div>
        </div>

        <nav className="space-y-1">
          {navigationItems.map((item) => (
            <SidebarButton
              key={item.id}
              item={item}
              activeSection={activeSection}
              onSectionChange={onSectionChange}
            />
          ))}
        </nav>

        <div className="my-4 border-t border-slate-200" />

        <SidebarButton
          item={moreItem}
          activeSection={activeSection}
          onSectionChange={onSectionChange}
        />
      </div>
    </aside>
  );
}