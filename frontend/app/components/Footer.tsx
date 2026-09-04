import Link from "next/link";

export default function Footer() {
  const quickLinks = [
    { label: "Home", href: "/" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Groups", href: "/groups" },
    { label: "Login", href: "/auth" },
    { label: "Sign Up", href: "/auth" },
  ];

  const productFeatures = [
    "Group Expenses",
    "Equal & Custom Split",
    "UPI Settlements",
    "Settlement Tracking",
    "PWA Support",
  ];

  return (
    <footer className="border-t border-slate-200 bg-white px-4 py-10 sm:px-6 sm:py-12 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50">
                <span className="text-sm font-extrabold text-indigo-600">
                  K
                </span>
              </div>

              <h3 className="text-lg font-extrabold tracking-tight text-slate-900">
                KharchaMate
              </h3>
            </div>

            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-500">
              A simple expense-sharing app for friends, roommates, trips, and
              shared living — built for clarity, fairness, and easy settlements.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
              Product
            </h4>

            <ul className="mt-4 space-y-2.5">
              {productFeatures.map((feature) => (
                <li key={feature} className="text-sm text-slate-500">
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
              Quick Links
            </h4>

            <ul className="mt-4 space-y-2.5">
              {quickLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-slate-500 transition-colors hover:text-indigo-600"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Developer */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
              Developer
            </h4>

            <ul className="mt-4 space-y-2.5">
              <li>
                <a
                  href="https://github.com/tsujit74"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-slate-500 transition-colors hover:text-indigo-600"
                >
                  GitHub
                </a>
              </li>

              <li>
                <a
                  href="https://sujit-porttfolio.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-slate-500 transition-colors hover:text-indigo-600"
                >
                  Portfolio
                </a>
              </li>

              <li>
                <a
                  href="https://www.linkedin.com/in/sujit-thakur-463b45229/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-slate-500 transition-colors hover:text-indigo-600"
                >
                  LinkedIn
                </a>
              </li>

              <li>
                <a
                  href="mailto:kharchemate27@gmail.com"
                  className="text-sm text-slate-500 transition-colors hover:text-indigo-600"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 flex flex-col gap-2 border-t border-slate-100 pt-6 text-center text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p>© {new Date().getFullYear()} KharchaMate. All rights reserved.</p>

          <p>
            Built with care by{" "}
            <span className="font-medium text-slate-500">Sujit Thakur</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
