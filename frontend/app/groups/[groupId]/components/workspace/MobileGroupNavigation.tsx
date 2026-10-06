"use client";

import { ArrowLeft } from "lucide-react";
import { moreItem, navigationItems, type Section } from "./GroupNavigation";
import { useRouter } from "next/navigation";

type Props = {
  activeSection: Section;
  onSectionChange: (section: Section) => void;
};

const mobileItems = [
  ...navigationItems.filter((item) => item.showOnMobile),
  moreItem,
];

export default function MobileGroupNavigation({
  activeSection,
  onSectionChange,
}: Props) {

  const router = useRouter();

  const isTabActive = (id: Section) =>
    id === "more"
      ? !navigationItems.some(
          (item) => item.showOnMobile && item.id === activeSection,
        )
      : id === activeSection;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 flex border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
      <button
        type="button"
        onClick={() => router.push("/dashboard")}
        className="flex min-w-0 flex-1 flex-col items-center gap-1 px-1 py-2 text-[11px] font-medium text-slate-500 transition-colors hover:text-slate-900"
      >
        <span className="flex h-7 w-12 items-center justify-center rounded-full">
          <ArrowLeft className="h-[18px] w-[18px]" />
        </span>

        <span className="truncate">All Groups</span>
      </button>
      {mobileItems.map((item) => {
        const active = isTabActive(item.id);
        const Icon = item.icon;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSectionChange(item.id)}
            aria-current={active ? "page" : undefined}
            className={`flex min-w-0 flex-1 flex-col items-center gap-1 px-1 py-2 text-[11px] font-medium transition-colors ${
              active ? "text-slate-900" : "text-slate-500"
            }`}
          >
            <span
              className={`flex h-7 w-12 items-center justify-center rounded-full transition-colors ${
                active ? "bg-slate-900 text-white" : ""
              }`}
            >
              <Icon className="h-[18px] w-[18px]" />
            </span>
            <span className="truncate">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
