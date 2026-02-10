import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 px-4 sm:px-6 md:px-16 py-10 sm:py-12">
      <div className="max-w-6xl mx-auto grid gap-10 sm:grid-cols-2 md:grid-cols-4">
        {/* Brand */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900">KharchaMate</h3>
          <p className="mt-3 text-sm text-gray-600 leading-relaxed">
            KharchaMate is a real-world expense splitting Progressive Web App
            built for friends, roommates, trips, and shared living—focused on
            clarity, fairness, and easy settlements.
          </p>
        </div>

        {/* Product */}
        <div>
          <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
            Product
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-gray-600">
            <li>Group Expenses</li>
            <li>Equal & Custom Split</li>
            <li>UPI Settlements</li>
            <li>Settlement Tracking</li>
            <li>PWA Support</li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
            Quick Links
          </h4>
          <ul className="mt-4 space-y-2 text-sm">
            {[
              { label: "Home", href: "/" },
              { label: "Dashboard", href: "/dashboard" },
              { label: "Groups", href: "/groups" },
              { label: "Login", href: "/login" },
              { label: "Sign Up", href: "/signup" },
            ].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-gray-600 hover:text-gray-900 transition"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Developer */}
        <div>
          <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
            Developer
          </h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a
                href="https://github.com/tsujit74"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition"
              >
                GitHub
              </a>
            </li>
            <li>
              <a
                href="https://sujit-porttfolio.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition"
              >
                Portfolio
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/sujit-thakur-463b45229/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition"
              >
                LinkedIn
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-600 hover:text-gray-900 transition"
              >
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-10 pt-6 border-t border-gray-100 text-center text-xs sm:text-sm text-gray-500">
        © {new Date().getFullYear()} KharchaMate • Built by Sujit Thakur
      </div>
    </footer>
  );
}
