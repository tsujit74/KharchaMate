const steps = [
  {
    step: "01",
    label: "Create Group",
    text: "Add your flatmates or friends.",
  },
  {
    step: "02",
    label: "Add Expense",
    text: "Add rent, food, or bills in one tap.",
  },
  {
    step: "03",
    label: "Split Automatically",
    text: "Everyone’s share is calculated instantly.",
  },
  {
    step: "04",
    label: "Settle Easily",
    text: "Settle via UPI, bank, or cash — we track it.",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-28 px-6 md:px-16">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold mb-6 text-center">
          How it works in 4 steps
        </h2>

        <p className="text-lg text-gray-500 text-center max-w-2xl mx-auto mb-12">
          KharchaMate does the math; you just add the amount and who was there.
        </p>

        <div className="grid md:grid-cols-4 gap-10">
          {steps.map((item, index) => (
            <div key={index} className="text-center">
              <span className="text-6xl font-black text-gray-100">
                {item.step}
              </span>

              <p className="mt-2 font-semibold text-slate-900">
                {item.label}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}