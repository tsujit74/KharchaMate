"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/app/context/authContext";
import {
  User2,
  Bell,
  Plus,
  Users,
  ChevronDown,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  CircleUserRound,
  Receipt,
  Menu,
  X,
  ArrowUpRight,
} from "lucide-react";
import CreateGroupModal from "../dashboard/components/CreateGroupModal";
import { useRouter } from "next/navigation";

const publicLinks = [
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Features", href: "/#features" },
  { label: "FAQ", href: "/#faq" },
  { label: "About", href: "/#founder" },
];

export default function Navbar() {
  const {
    user,
    unreadNotifications,
    pendingPaymentRequests,
    isAuthenticated,
    logout,
    loading,
  } = useAuth();

  const isAdmin = user?.role === "admin";

  const [openMenu, setOpenMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [createGroupOpen, setCreateGroupOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const getInitials = (name?: string) => {
    if (!name) return "";

    const parts = name.trim().split(/\s+/);

    return parts.length === 1
      ? parts[0][0]?.toUpperCase() || ""
      : `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(false);
      }
    };

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenMenu(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-[#EAE6DE] bg-[#FAF8F4]/95 shadow-sm shadow-slate-900/[0.02] backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          {/* Brand */}
          <Link
            href={isAuthenticated ? (isAdmin ? "/admin" : "/dashboard") : "/"}
            onClick={closeMobileMenu}
            className="group flex shrink-0 items-center gap-2.5"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F0ECE4] text-sm font-extrabold text-slate-900 ring-1 ring-[#E5DED2] transition-transform group-hover:scale-105">
              KM
            </span>

            <span className="text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">
              KharchaMate
            </span>
          </Link>

          {/* Public navigation */}
          {!loading && !isAuthenticated && (
            <div className="hidden items-center gap-1 lg:flex">
              {publicLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="rounded-full px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-[#F0ECE4] hover:text-slate-950"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}

          {/* Authenticated navigation */}
          {!loading && isAuthenticated && (
            <div className="hidden items-center gap-1 text-sm md:flex lg:gap-2">
              <NavLink href="/dashboard" icon={<Users size={16} />}>
                Groups
              </NavLink>

              <NavLink href="/settlement-requests" icon={<Receipt size={16} />}>
                <span className="flex items-center gap-1.5">
                  Payments
                  {pendingPaymentRequests > 0 && (
                    <CountBadge count={pendingPaymentRequests} limit={4} />
                  )}
                </span>
              </NavLink>

              <NavLink
                href="/dashboard/insights"
                icon={<LayoutDashboard size={16} />}
              >
                Insights
              </NavLink>

              <NavLink href="/dashboard/support" icon={<LifeBuoy size={16} />}>
                Support
              </NavLink>

              <button
                type="button"
                onClick={() => setCreateGroupOpen(true)}
                className="ml-1 inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-4 py-2.5 font-semibold text-white transition-colors hover:bg-slate-800 active:scale-[0.98]"
              >
                <Plus size={16} />
                Add Group
              </button>

              {isAdmin && (
                <Link
                  href="/admin"
                  className="rounded-full bg-[#FCEDE9] px-3.5 py-2.5 font-semibold text-[#A33A28] transition-colors hover:bg-[#F8DFD8]"
                >
                  Admin
                </Link>
              )}
            </div>
          )}

          {/* Right side */}
          <div className="flex shrink-0 items-center gap-2">
            {loading ? (
              <div
                className="h-8 w-20 animate-pulse rounded-full bg-[#F0ECE4]"
                aria-label="Loading account"
              />
            ) : isAuthenticated && user ? (
              <>
                {/* Notifications */}
                <Link
                  href="/notifications"
                  aria-label={`Notifications${
                    unreadNotifications > 0
                      ? `, ${unreadNotifications} unread`
                      : ""
                  }`}
                  className="relative rounded-full p-2.5 text-slate-600 transition-colors hover:bg-[#F0ECE4] hover:text-slate-950"
                >
                  <Bell size={20} />

                  {unreadNotifications > 0 && (
                    <span className="absolute right-0.5 top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-bold text-white">
                      {unreadNotifications > 9 ? "9+" : unreadNotifications}
                    </span>
                  )}
                </Link>

                {/* Profile dropdown */}
                <div ref={menuRef} className="relative">
                  <button
                    type="button"
                    aria-expanded={openMenu}
                    aria-haspopup="menu"
                    onClick={() => setOpenMenu((prev) => !prev)}
                    className="flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-2 transition-colors hover:bg-[#F0ECE4]"
                  >
                    <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-slate-900 text-sm font-semibold text-white">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name || "User"}
                          className="h-full w-full object-cover"
                        />
                      ) : user.name ? (
                        getInitials(user.name)
                      ) : (
                        <User2 size={18} />
                      )}
                    </span>

                    <span className="hidden max-w-[120px] text-left leading-tight sm:block">
                      <span className="block truncate text-sm font-semibold text-slate-900">
                        {user.name || "Account"}
                      </span>
                      <span className="block text-xs text-slate-500">
                        {isAdmin ? "Admin" : "Member"}
                      </span>
                    </span>

                    <ChevronDown
                      size={15}
                      className={`text-slate-500 transition-transform ${
                        openMenu ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <div
                    role="menu"
                    aria-label="Account menu"
                    className={`absolute right-0 mt-3 w-60 origin-top-right overflow-hidden rounded-2xl border border-[#EAE6DE] bg-white shadow-xl shadow-slate-900/[0.06] transition-all duration-200 ${
                      openMenu
                        ? "translate-y-0 scale-100 opacity-100"
                        : "pointer-events-none -translate-y-1 scale-95 opacity-0"
                    }`}
                  >
                    <div className="border-b border-slate-100 bg-[#FAF8F4]/70 px-4 py-3">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {user.name || "Account"}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {user.email}
                      </p>
                    </div>

                    <DropdownItem
                      href="/profile"
                      icon={<CircleUserRound size={16} />}
                      onClick={() => setOpenMenu(false)}
                    >
                      Profile
                    </DropdownItem>

                    <DropdownItem
                      href="/dashboard"
                      icon={<LayoutDashboard size={16} />}
                      onClick={() => setOpenMenu(false)}
                    >
                      Dashboard
                    </DropdownItem>

                    <DropdownItem
                      href="/settlement-requests"
                      icon={<Receipt size={16} />}
                      onClick={() => setOpenMenu(false)}
                    >
                      <span className="flex w-full items-center justify-between gap-2">
                        Payment Requests
                        {pendingPaymentRequests > 0 && (
                          <CountBadge
                            count={pendingPaymentRequests}
                            limit={4}
                          />
                        )}
                      </span>
                    </DropdownItem>

                    <DropdownItem
                      href="/notifications"
                      icon={<Bell size={16} />}
                      onClick={() => setOpenMenu(false)}
                    >
                      Notifications
                    </DropdownItem>

                    <DropdownItem
                      href="/dashboard/insights"
                      icon={<LayoutDashboard size={16} />}
                      onClick={() => setOpenMenu(false)}
                    >
                      Insights
                    </DropdownItem>

                    <DropdownItem
                      href="/dashboard/support"
                      icon={<LifeBuoy size={16} />}
                      onClick={() => setOpenMenu(false)}
                    >
                      Support
                    </DropdownItem>

                    {isAdmin && (
                      <DropdownItem
                        href="/admin"
                        icon={<Users size={16} />}
                        onClick={() => setOpenMenu(false)}
                      >
                        Admin Panel
                      </DropdownItem>
                    )}

                    <div className="border-t border-slate-100 p-1.5">
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setOpenMenu(false);
                          logout();
                        }}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50"
                      >
                        <LogOut size={16} />
                        Log out
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/auth"
                  className="hidden rounded-full px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-[#F0ECE4] sm:inline-flex"
                >
                  Log in
                </Link>

                <Link
                  href="/auth"
                  className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 sm:px-5"
                >
                  Get Started
                  <ArrowUpRight size={15} />
                </Link>
              </>
            )}

            {/* Mobile menu toggle for public visitors */}
            {!loading && !isAuthenticated && (
              <button
                type="button"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileMenuOpen}
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="rounded-full p-2 text-slate-700 transition-colors hover:bg-[#F0ECE4] lg:hidden"
              >
                {mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
              </button>
            )}

            {/* Mobile menu toggle for authenticated users */}
            {!loading && isAuthenticated && (
              <button
                type="button"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileMenuOpen}
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="rounded-full p-2 text-slate-700 transition-colors hover:bg-[#F0ECE4] md:hidden"
              >
                {mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile navigation panel */}
        <div
          className={`overflow-hidden border-t border-[#EAE6DE] bg-[#FAF8F4] transition-[max-height,opacity] duration-200 lg:hidden ${
            mobileMenuOpen
              ? "max-h-[80vh] overflow-y-auto opacity-100"
              : "max-h-0 border-t-transparent opacity-0"
          }`}
        >
          <div className="mx-auto max-w-7xl space-y-1 px-4 py-4 sm:px-6">
            {!isAuthenticated ? (
              <>
                <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  Explore KharchaMate
                </p>

                {publicLinks.map((item) => (
                  <MobileLink
                    key={item.label}
                    href={item.href}
                    onClick={closeMobileMenu}
                  >
                    {item.label}
                  </MobileLink>
                ))}

                <div className="pt-2">
                  <Link
                    href="/auth"
                    onClick={closeMobileMenu}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                  >
                    Get Started
                    <ArrowUpRight size={16} />
                  </Link>
                </div>
              </>
            ) : (
              <>
                <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  Workspace
                </p>

                <MobileLink
                  href="/dashboard"
                  onClick={closeMobileMenu}
                  icon={<Users size={17} />}
                >
                  Groups
                </MobileLink>

                <MobileLink
                  href="/settlement-requests"
                  onClick={closeMobileMenu}
                  icon={<Receipt size={17} />}
                  trailing={
                    pendingPaymentRequests > 0 ? (
                      <CountBadge count={pendingPaymentRequests} limit={4} />
                    ) : undefined
                  }
                >
                  Payment Requests
                </MobileLink>

                <MobileLink
                  href="/dashboard/insights"
                  onClick={closeMobileMenu}
                  icon={<LayoutDashboard size={17} />}
                >
                  Insights
                </MobileLink>

                <MobileLink
                  href="/notifications"
                  onClick={closeMobileMenu}
                  icon={<Bell size={17} />}
                  trailing={
                    unreadNotifications > 0 ? (
                      <CountBadge count={unreadNotifications} limit={9} />
                    ) : undefined
                  }
                >
                  Notifications
                </MobileLink>

                <MobileLink
                  href="/profile"
                  onClick={closeMobileMenu}
                  icon={<CircleUserRound size={17} />}
                >
                  Profile
                </MobileLink>

                <MobileLink
                  href="/dashboard/support"
                  onClick={closeMobileMenu}
                  icon={<LifeBuoy size={17} />}
                >
                  Support
                </MobileLink>

                {isAdmin && (
                  <MobileLink
                    href="/admin"
                    onClick={closeMobileMenu}
                    icon={<LayoutDashboard size={17} />}
                  >
                    Admin Panel
                  </MobileLink>
                )}

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setCreateGroupOpen(true);
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                  >
                    <Plus size={17} />
                    Create a Group
                  </button>
                </div>

                <div className="border-t border-[#E5DED2] pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-3 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50"
                  >
                    <LogOut size={17} />
                    Log out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Spacer prevents page content from sitting under the fixed navbar. */}
      <div aria-hidden="true" className="h-[72px]" />

      <CreateGroupModal
        isOpen={createGroupOpen}
        onClose={() => setCreateGroupOpen(false)}
        onCreated={(groupId) => {
          setCreateGroupOpen(false);
          router.push(`/groups/${groupId}`);
        }}
      />
    </>
  );
}

function CountBadge({ count, limit }: { count: number; limit: number }) {
  return (
    <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-slate-900 px-1 text-[10px] font-bold text-white">
      {count > limit ? `${limit}+` : count}
    </span>
  );
}

function NavLink({
  href,
  children,
  icon,
}: {
  href: string;
  children: React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 font-medium text-slate-600 transition-colors hover:bg-[#F0ECE4] hover:text-slate-950"
    >
      {icon}
      {children}
    </Link>
  );
}

function DropdownItem({
  href,
  children,
  icon,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  icon: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      role="menuitem"
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-3 text-sm text-slate-700 transition-colors hover:bg-[#FAF8F4]"
    >
      {icon}
      {children}
    </Link>
  );
}

function MobileLink({
  href,
  children,
  icon,
  trailing,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  trailing?: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center justify-between gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-[#F0ECE4] hover:text-slate-950"
    >
      <span className="flex items-center gap-3">
        {icon && <span className="text-slate-500">{icon}</span>}
        {children}
      </span>

      {trailing}
    </Link>
  );
}
