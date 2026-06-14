import { CreditCard, Plus, CheckCircle2 } from "lucide-react";

const testimonials = [
  {
    icon: <CreditCard className="mb-3 text-blue-600" />,
    title: "Flatmates in Bengaluru",
    description:
      "We stopped fighting over rent and bills. Now everyone knows what they owe.",
  },
  {
    icon: <Plus className="mb-3 text-green-600" />,
    title: "Couple managing meals",
    description:
      "Adds our expenses in real time and keeps us honest.",
  },
  {
    icon: <CheckCircle2 className="mb-3 text-purple-600" />,
    title: "College roommates",
    description:
      "No more 'I forgot to pay' excuses. Everyone owes only what they owe.",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 px-6 md:px-16 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h3 className="text-3xl font-bold text-center mb-6">
          Loved by paying users
        </h3>

        <p className="text-lg text-gray-500 text-center mb-12">
          Flatmates and couples use KharchaMate to stop arguments over
          &nbsp;&ldquo;who paid last.&rdquo;
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="p-6 bg-white border rounded-2xl shadow-sm"
            >
              {testimonial.icon}

              <p className="text-lg font-semibold">
                {testimonial.title}
              </p>

              <p className="text-sm text-gray-500 mt-2">
                &ldquo;{testimonial.description}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}