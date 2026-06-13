import { BrainCircuit, Github, Linkedin, Mail } from 'lucide-react';

const footerLinks = ['Product', 'Security', 'Roadmap', 'Pricing'];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950 text-white">
      <div className="page-shell grid gap-8 py-10 md:grid-cols-[1.4fr_1fr] md:items-center">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 via-blue-500 to-violet-500">
              <BrainCircuit size={20} />
            </span>
            <span className="font-semibold">InterviewIQ AI</span>
          </div>
          <p className="mt-4 max-w-xl text-sm leading-6 text-slate-400">
            Premium AI interview practice, readiness prediction, and performance analytics for candidates who want a
            measurable path to stronger interviews.
          </p>
        </div>

        <div className="flex flex-col gap-5 md:items-end">
          <div className="flex flex-wrap gap-4 text-sm text-slate-300">
            {footerLinks.map((link) => (
              <a key={link} className="transition hover:text-white" href="/">
                {link}
              </a>
            ))}
          </div>
          <div className="flex gap-2">
            {[Mail, Linkedin, Github].map((Icon) => (
              <a
                key={Icon.displayName || Icon.name}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-slate-300 transition hover:bg-white/10 hover:text-white"
                href="/"
                aria-label={Icon.displayName || Icon.name}
              >
                <Icon size={17} />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} InterviewIQ AI. Practice with purpose.
      </div>
    </footer>
  );
}
