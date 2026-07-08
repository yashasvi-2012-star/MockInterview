import { BrainCircuit, Github, Linkedin, Mail } from 'lucide-react';

const footerLinks = [
  { label: 'Product', href: '/#features' },
  { label: 'Security', href: '/#prediction' },
  { label: 'Roadmap', href: '/#workflow' },
  { label: 'Pricing', href: '/#features' },
];

const socialLinks = [
  { icon: Mail, href: 'mailto:hello@prepify.dev', label: 'Email' },
  { icon: Linkedin, href: 'https://www.linkedin.com', label: 'LinkedIn' },
  { icon: Github, href: 'https://github.com', label: 'GitHub' },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950 text-white">
      <div className="page-shell grid gap-8 py-10 md:grid-cols-[1.4fr_1fr] md:items-center">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 via-blue-500 to-violet-500">
              <BrainCircuit size={20} />
            </span>
            <span className="font-semibold"> Prepify</span>
          </div>
          <p className="mt-4 max-w-xl text-sm leading-6 text-slate-400">
            Premium AI interview practice, readiness prediction, and performance analytics for candidates who want a
            measurable path to stronger interviews.
          </p>
        </div>

        <div className="flex flex-col gap-5 md:items-end">
          <div className="flex flex-wrap gap-4 text-sm text-slate-300">
            {footerLinks.map((link) => (
              <a key={link.label} className="transition hover:text-white" href={link.href}>
                {link.label}
              </a>
            ))}
          </div>
          <div className="flex gap-2">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-slate-300 transition hover:bg-white/10 hover:text-white"
                href={href}
                aria-label={label}
                rel="noreferrer"
                target={href.startsWith('http') ? '_blank' : undefined}
              >
                <Icon size={17} />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} Prepify. Practice with purpose.
      </div>
    </footer>
  );
}
