import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import Topbar from '../components/Topbar';

const ADMIN_PAGE_TITLES = {
  '/admin/dashboard': 'Admin Command Center',
  '/admin/farmers': 'Farmer Management Directory',
  '/admin/assessments': 'Health Assessment Audit & Monitoring',
  '/admin/articles': 'Safety Knowledge Base Manager',
  '/admin/chemicals': 'Chemical Safety Database'
};

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const currentTitle = ADMIN_PAGE_TITLES[location.pathname] || 'Admin Management Portal';

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar onMenuClick={() => setMobileOpen(true)} title={currentTitle} />
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
