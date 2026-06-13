import { Outlet } from 'react-router-dom';
import Navbar from '../../shared/components/layout/Navbar.jsx';
import Sidebar from '../../shared/components/layout/Sidebar.jsx';

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="flex min-h-[calc(100vh-64px)]">
        <Sidebar />
        <main className="min-w-0 flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
