import { ArrowRight, BrainCircuit, LogIn } from 'lucide-react';
import { APP_NAME } from '../../constants/appConstants.js';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/85 text-white backdrop-blur-xl">
      <div className="page-shell flex h-16 items-center justify-between gap-4">
        <a className="flex items-center gap-3 text-base font-semibold tracking-tight" href="/">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 via-blue-500 to-violet-500 text-white shadow-lg shadow-blue-950/30">
            <BrainCircuit size={20} />
          </span>
          {APP_NAME}
        </a>

        <nav className="hidden items-center gap-7 text-sm text-slate-300 md:flex">
          <a className="transition hover:text-white" href="/#features">
            Features
          </a>
          <a className="transition hover:text-white" href="/#workflow">
            Workflow
          </a>
          <a className="transition hover:text-white" href="/#prediction">
            Prediction
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <a
            className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10 sm:inline-flex"
            href="/login"
          >
            <LogIn size={16} />
            Login
          </a>
          <a
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100"
            href="/register"
          >
            Get started
            <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </header>
  );
}
