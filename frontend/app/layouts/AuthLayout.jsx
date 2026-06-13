import { Outlet } from 'react-router-dom';
import { APP_NAME } from '../../shared/constants/appConstants.js';

export default function AuthLayout() {
  return (
    <main className="grid min-h-screen bg-slate-950 lg:grid-cols-[1fr_520px]">
      <section className="hidden bg-[linear-gradient(135deg,#0f172a,#1d4ed8_50%,#047857)] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="text-xl font-bold">{APP_NAME}</div>
        <div className="max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-100">Interview readiness platform</p>
          <h1 className="mt-4 text-5xl font-bold leading-tight">Practice sharper answers with measurable feedback.</h1>
          <p className="mt-5 text-lg text-blue-50">
            Build confidence across voice interviews, resume quality, and skill gaps before the real conversation starts.
          </p>
        </div>
        <p className="text-sm text-blue-100">Designed for candidates who want structured, repeatable preparation.</p>
      </section>
      <section className="flex items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </section>
    </main>
  );
}
