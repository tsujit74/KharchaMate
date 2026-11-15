import Link from "next/link";
import { ArrowUpRight, Github, Heart, Linkedin, Wallet } from "lucide-react";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Groups", href: "/groups" },
  { label: "Log in", href: "/auth" },
  { label: "Create an account", href: "/auth" },
];

const features = [
  "Group expense tracking",
  "Equal & custom splits",
  "Budgets & spending insights",
  "Receipt scanning (OCR)",
  "Settlement requests & history",
  "UPI payment support",
  "Installable PWA",
];

const developerLinks = [
  {
    label: "GitHub",
    href: "https://github.com/tsujit74",
    icon: Github,
  },
  {
    label: "Portfolio",
    href: "https://sujit-porttfolio.vercel.app/",
    icon: ArrowUpRight,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/sujit-thakur-463b45229/",
    icon: Linkedin,
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#FAF8F4] px-5 pb-6 pt-14 sm:px-8 sm:pt-16 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:gap-12">
          <div className="max-w-sm">
            <Link
              href="/"
              aria-label="KharchaMate home"
              className="group inline-flex items-center gap-3"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F0ECE4] text-sm font-extrabold text-slate-900 ring-1 ring-[#E5DED2] transition-transform group-hover:scale-105">
                KM
              </span>

              <span className="text-xl font-extrabold tracking-tight text-slate-900">
                KharchaMate
              </span>
            </Link>

            <p className="mt-5 text-sm leading-7 text-slate-500">
              Shared expenses, without the awkward calculations. Track group
              spending, split fairly, and keep settlements organized with the
              people you live, travel, and share life with.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-slate-900">
              Product
            </h3>

            <ul className="mt-5 space-y-3.5">
              {features.map((feature) => (
                <li key={feature} className="text-sm leading-5 text-slate-500">
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-slate-900">
              Explore
            </h3>

            <ul className="mt-5 space-y-3.5">
              {quickLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-1 text-sm text-slate-500 transition-colors duration-200 hover:text-slate-900"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-slate-900">
              Connect
            </h3>

            <p className="mt-5 text-sm leading-6 text-slate-500">
              Have feedback or an idea to make shared expenses simpler?
              Let&apos;s connect.
            </p>

            <div className="mt-4 space-y-3.5">
              {developerLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-slate-900"
                >
                  <Icon
                    size={16}
                    strokeWidth={1.8}
                    className="text-slate-400 transition-colors group-hover:text-slate-900"
                  />
                  {label}
                  <ArrowUpRight
                    size={13}
                    className="opacity-0 transition-opacity group-hover:opacity-100"
                  />
                </a>
              ))}

              <a
                href="mailto:kharchemate27@gmail.com"
                className="inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-slate-900"
              >
                Contact & feedback
                <ArrowUpRight size={13} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col gap-4 border-t border-slate-100 pt-6 sm:mt-14 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-slate-400">
            © {new Date().getFullYear()} KharchaMate. All rights reserved.
          </p>

          <p className="inline-flex items-center gap-1.5 text-xs text-slate-400">
            Built with by{" "}
            <a
              href="https://sujit-porttfolio.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-slate-600 transition-colors hover:text-slate-900"
            >
              Sujit Thakur
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
