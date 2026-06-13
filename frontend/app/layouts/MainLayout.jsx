import { Outlet } from 'react-router-dom';
import Footer from '../../shared/components/layout/Footer.jsx';
import Navbar from '../../shared/components/layout/Navbar.jsx';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="page-shell py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
