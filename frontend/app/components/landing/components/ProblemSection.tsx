import { Users, Calculator } from "lucide-react";

export default function ProblemSection() {
  return (
    <section className="py-28 px-6 md:px-16">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16">
        <div>
          <h2 className="text-4xl font-bold">
            Shared expenses{" "}
            <span className="text-gray-400">
              ruin friendships.
            </span>
          </h2>

          <p className="mt-6 text-lg text-gray-500">
            Forgetting who paid, splitting manually, and constant
            follow-ups turn small amounts into big tension.
          </p>

          <p className="mt-4 text-base text-gray-500">
            Most people solve this with WhatsApp notes,
            screenshots, and trust — which doesn’t scale
            when you live with more than 2 people.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-6 bg-white border rounded-xl shadow-sm">
            <Users className="mb-4 text-red-500" />

            <h3 className="font-semibold">
              Awkward Reminders
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              “Hey, did you pay the bill?” turned into
              “I told you already.”
            </p>
          </div>

          <div className="p-6 bg-white border rounded-xl shadow-sm">
            <Calculator className="mb-4 text-orange-500" />

            <h3 className="font-semibold">
              Wrong Calculations
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              One person ends up paying more over time and
              nobody notices.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}