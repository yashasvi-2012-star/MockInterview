import { BarChart3, FileText, History, LayoutDashboard, Mic, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { ROUTES } from '../../constants/routes.js';
import { cx } from '../../utils/helpers.js';

const links = [
  { to: ROUTES.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
  { to: ROUTES.INTERVIEW_SETUP, label: 'Practice', icon: Mic },
  { to: ROUTES.INTERVIEW_HISTORY, label: 'History', icon: History },
  { to: ROUTES.REPORTS, label: 'Reports', icon: BarChart3 },
  { to: ROUTES.RESUME_UPLOAD, label: 'Resume', icon: FileText },
  { to: ROUTES.PROFILE, label: 'Profile', icon: User },
];

export default function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white p-4 lg:block">
      <nav className="space-y-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cx(
                'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100',
                isActive && 'bg-brand-50 text-brand-700',
              )
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
