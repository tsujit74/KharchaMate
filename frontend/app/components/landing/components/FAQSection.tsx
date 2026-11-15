import { Plus } from "lucide-react";

const faqs = [
  {
    question: "Is KharchaMate free?",
    answer:
      "Yes. You can create groups, add expenses and settle up without paying anything, and there is no card to enter.",
  },
  {
    question: "Does the money move through the app?",
    answer:
      "No. KharchaMate keeps the record of who owes whom. You pay the person directly by UPI, bank transfer or cash, then mark it as paid so everyone's balances update.",
  },
  {
    question: "What is the difference between an ongoing home and a trip?",
    answer:
      "An ongoing home is for flatmates or couples whose shared costs keep running, so it gets monthly reports. A trip or event is for a few days of spending, where you settle up once at the end.",
  },
  {
    question: "How accurate is the bill scan?",
    answer:
      "It reads the amount and description from a photo, but scans can be wrong, especially on crumpled or faded bills. The form is filled in for you and you check it before saving.",
  },
  {
    question: "Can I split things unequally?",
    answer:
      "Yes. Split equally, or enter each person's amount yourself, for example when one room is bigger. The amounts must add up to the total before you can save.",
  },
  {
    question: "Does it work on my phone?",
    answer:
      "Yes. It works in your phone's browser, and you can install it to your home screen like an app.",
  },
  {
    question: "Who can see my group's expenses?",
    answer: "Only the members of that group can see its expenses and balances.",
  },
];

export default function FAQSection() {
  return (
    <section id="faq" className="scroll-mt-24 bg-white px-6 py-24 md:px-16">
      <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-[1fr_1.6fr] md:gap-16">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
            Questions people ask
          </h2>
          <p className="mt-4 text-base text-slate-600">
            Something missing? Write to{" "}
            <a
              href="mailto:kharchemate27@gmail.com"
              className="font-medium text-slate-900 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-900"
            >
              kharchemate27@gmail.com
            </a>
            .
          </p>
        </div>

        <div className="divide-y divide-slate-200 border-y border-slate-200">
          {faqs.map((item) => (
            <details key={item.question} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-base font-semibold text-slate-900 [&::-webkit-details-marker]:hidden">
                {item.question}
                <Plus className="h-5 w-5 shrink-0 text-slate-400 transition-transform group-open:rotate-45" />
              </summary>
              <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-slate-600">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
