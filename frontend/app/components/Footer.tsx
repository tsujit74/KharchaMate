import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 px-6 md:px-16 py-12">
      <div className="max-w-6xl mx-auto grid gap-10 md:grid-cols-4">
        {/* Brand */}
        <div>
          <h3 className="text-xl font-semibold text-black">KharchaMate</h3>
          <p className="mt-3 text-sm text-gray-600 leading-relaxed">
            KharchaMate is a real-world expense splitting Progressive Web App
            built for friends, roommates, trips, and shared living - focused on
            clarity, fairness, and easy settlements.
          </p>
        </div>

        {/* Product */}
        <div>
          <h4 className="text-sm font-semibold text-black uppercase tracking-wide">
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

        {/* Quick Links (Internal → Link) */}
        <div>
          <h4 className="text-sm font-semibold text-black uppercase tracking-wide">
            Quick Links
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-gray-600">
            <li>
              <Link href="/" className="hover:text-black">
                Home
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="hover:text-black">
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/groups" className="hover:text-black">
                Groups
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-black">
                Login
              </Link>
            </li>
            <li>
              <Link href="/signup" className="hover:text-black">
                Sign Up
              </Link>
            </li>
          </ul>
        </div>

        {/* Developer (External → <a>) */}
        <div>
          <h4 className="text-sm font-semibold text-black uppercase tracking-wide">
            Developer
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-gray-600">
            <li>
              <a
                href="https://github.com/tsujit74"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-black"
              >
                GitHub
              </a>
            </li>
            <li>
              <a
                href="https://sujit-porttfolio.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-black"
              >
                Portfolio
              </a>
            </li>
            <li>
              <a href="https://www.linkedin.com/in/sujit-thakur-463b45229/" className="hover:text-black">
                LinkedIn
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-black">
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-12 pt-6 border-t border-gray-100 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} KharchaMate • Built by Sujit Thakur
      </div>
    </footer>
  );
}
