import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="bg-white text-gray-800">
      {/* HERO */}
      <section className="min-h-screen flex items-center px-6 md:px-16">
        <div className="grid md:grid-cols-2 gap-14 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              KharchaMate <br />
              <span className="text-gray-600">
                Split Expenses. Stay Sorted.
              </span>
            </h1>

            <p className="mt-6 text-lg text-gray-600 max-w-xl">
              A simple expense-splitting app designed for real-life group
              spending - trips, roommates, friends, and shared living.
            </p>

            <div className="mt-8 flex gap-4">
              <Link
                href="/signup"
                className="px-6 py-3 bg-black text-white shadow"
              >
                Get Started
              </Link>
              <Link
                href="/login"
                className="px-6 py-3 border border-gray-300"
              >
                Login
              </Link>
            </div>
          </div>

          <div className="relative w-full h-[380px]">
            <Image
              src="/images/hero3.jpg"
              alt="KharchaMate dashboard preview"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="py-24 px-6 md:px-16 bg-gray-50">
        <div className="grid md:grid-cols-2 gap-14 items-center">
          <div className="relative w-full h-[320px]">
            <Image
              src="/images/problem1.jpg"
              alt="Problem illustration"
              fill
              className="object-contain"
            />
          </div>

          <div>
            <h2 className="text-3xl font-semibold">
              The Problem With Group Expenses
            </h2>

            <p className="mt-5 text-gray-600">
              Group spending often leads to confusion — people forget who paid,
              splits feel unfair, and reminders become awkward.
            </p>

            <p className="mt-3 text-gray-600">
              Most tools are either too complex or not designed for everyday,
              casual group expenses.
            </p>
          </div>
        </div>
      </section>

      {/* SOLUTION */}
      <section className="py-24 px-6 md:px-16">
        <div className="grid md:grid-cols-2 gap-14 items-center">
          <div>
            <h2 className="text-3xl font-semibold">
              A Simple and Practical Solution
            </h2>

            <p className="mt-5 text-gray-600">
              KharchaMate focuses on clarity. No unnecessary features — just
              clean expense tracking and fair splitting.
            </p>

            <ul className="mt-6 space-y-3 text-gray-700">
              <li>• Create groups in seconds</li>
              <li>• Automatically split expenses</li>
              <li>• See balances clearly</li>
              <li>• Avoid manual calculations</li>
            </ul>
          </div>

          <div className="relative w-full h-[320px]">
            <Image
              src="/images/solution.jpg"
              alt="Solution illustration"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 px-6 md:px-16 bg-gray-50">
        <div className="grid md:grid-cols-2 gap-14 items-center">
          <div className="relative w-full h-[320px]">
            <Image
              src="/images/flow1.jpg"
              alt="User flow"
              fill
              className="object-contain"
            />
          </div>

          <div>
            <h2 className="text-3xl font-semibold">
              How KharchaMate Works
            </h2>

            <ol className="mt-6 space-y-3 text-gray-700 list-decimal list-inside">
              <li>Create a group</li>
              <li>Add shared expenses</li>
              <li>Expenses are split automatically</li>
              <li>View who owes whom</li>
              <li>Settle without confusion</li>
            </ol>
          </div>
        </div>
      </section>

      {/* VALUE / GOAL */}
      <section className="py-24 px-6 md:px-16">
        <div className="grid md:grid-cols-2 gap-14 items-center">
         <div>
             <h2 className="text-3xl font-semibold">
            Why KharchaMate Exists
          </h2>

          <p className="mt-5 text-white-100">
            This project is built to solve a real-world problem while showcasing
            clean architecture, thoughtful UX, and strong full-stack skills.
          </p>

          <p className="mt-3 text-white-100">
            It demonstrates how simple ideas, when executed well, create
            meaningful products.
          </p>
         </div>

          <div className="relative w-full h-[320px]">
            <Image
              src="/images/flow.jpg"
              alt="Solution illustration"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
