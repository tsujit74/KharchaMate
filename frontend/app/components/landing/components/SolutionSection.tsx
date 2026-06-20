import { Plus, Calculator, CheckCircle2 } from "lucide-react";

const features = [
  {
    icon: <Plus />,
    title: "Create Groups",
    desc: "Split by people, not by receipts.",
  },
  {
    icon: <Calculator />,
    title: "Auto-Split",
    desc: "Every expense is split fairly in seconds.",
  },
  {
    icon: <CheckCircle2 />,
    title: "Clear Balances",
    desc: "See who owes whom — no more guessing.",
  },
];

export default function SolutionSection() {
  return (
    <section className="py-20 px-6 md:px-16 bg-black text-white mx-4 md:mx-10">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-6">
          Built for shared living.
        </h2>

        <p className="text-lg text-gray-300 text-center mb-12 max-w-2xl mx-auto">
          Not a full personal finance app — just the pieces that actually
          matter for flatmates, couples, and friends.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-10 bg-zinc-900 border border-zinc-800 rounded-2xl"
            >
              <div className="w-14 h-14 bg-white text-black flex items-center justify-center mb-6 rounded-xl">
                {feature.icon}
              </div>

              <h3 className="text-xl font-semibold mb-2">
                {feature.title}
              </h3>

              <p className="text-sm text-gray-400">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}