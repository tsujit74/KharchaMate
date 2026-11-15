import { Github, Linkedin } from "lucide-react";

export default function FounderNote() {
  return (
    <section className="bg-[#FAF8F4] px-6 py-24 md:px-16">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-slate-400">
          Why I built this
        </p>

        <div className="mt-5 space-y-4 text-lg leading-relaxed text-slate-700">
          <p>
            Splitting rent and bills over a group chat never worked for me.
            Someone always forgot who paid, and the numbers were never the same
            for everyone.
          </p>
          <p>
            So I built KharchaMate: one shared ledger where everyone sees the
            same balances, and settling up takes a minute.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
              S
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Sujit Thakur
              </p>
              <p className="text-xs text-slate-500">
                Builder of KharchaMate
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://github.com/tsujit74"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="rounded-full border border-slate-200 bg-white p-2.5 text-slate-600 transition hover:text-slate-900"
            >
              <Github className="h-4 w-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/sujit-thakur-463b45229/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="rounded-full border border-slate-200 bg-white p-2.5 text-slate-600 transition hover:text-slate-900"
            >
              <Linkedin className="h-4 w-4" />
            </a>
          </div>
        </div>

        <p className="mt-10 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-600">
          <span className="font-semibold text-slate-900">Working on next: </span>
          payment reminders and automatic month-end reports.
        </p>
      </div>
    </section>
  );
}