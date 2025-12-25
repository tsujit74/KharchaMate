export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 px-6 md:px-16 py-12">
      <div className="max-w-6xl mx-auto grid gap-10 md:grid-cols-4">
        
        {/* Brand */}
        <div>
          <h3 className="text-xl font-semibold text-black">KharchaMate</h3>
          <p className="mt-3 text-sm text-gray-600 leading-relaxed">
            A simple, real-world expense splitting Progressive Web App built
            for friends, roommates, trips, and shared living.
          </p>
        </div>

        {/* Product */}
        <div>
          <h4 className="text-sm font-semibold text-black uppercase tracking-wide">
            Product
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-gray-600">
            <li>Group Expenses</li>
            <li>Manual & Auto Split</li>
            <li>UPI Settlements</li>
            <li>WhatsApp Reminders</li>
            <li>PWA Support</li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-sm font-semibold text-black uppercase tracking-wide">
            Quick Links
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-gray-600">
            <li className="hover:text-black cursor-pointer">Home</li>
            <li className="hover:text-black cursor-pointer">Dashboard</li>
            <li className="hover:text-black cursor-pointer">Groups</li>
            <li className="hover:text-black cursor-pointer">Login</li>
            <li className="hover:text-black cursor-pointer">Sign Up</li>
          </ul>
        </div>

       
        <div>
          <h4 className="text-sm font-semibold text-black uppercase tracking-wide">
            Developer
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-gray-600">
            <li className="hover:text-black cursor-pointer">
              GitHub
            </li>
            <li className="hover:text-black cursor-pointer">
              Portfolio
            </li>
            <li className="hover:text-black cursor-pointer">
              LinkedIn
            </li>
            <li className="hover:text-black cursor-pointer">
              Contact
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-12 pt-6 border-t border-gray-100 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} KharchaMate. Built with for real-world use.
      </div>
    </footer>
  );
}
