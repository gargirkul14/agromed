import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

const PAGE_TITLES = {
  '/dashboard': 'Farmer Health Dashboard',
  '/profile': 'Personal & Location Profile',
  '/work-profile': 'Farming & Chemical Work Profile',
  '/assessment': 'Health & Safety Risk Assessment',
  '/recommendations': 'Personalized Safety Precautions',
  '/ppe-guide': 'PPE Safety Guide & Gap Analysis',
  '/chatbot': 'Ask AgroMed AI Assistant',
  '/knowledge': 'Safety Knowledge Center',
  '/history': 'Health Assessment History'
};

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Determine current page title
  const currentTitle = PAGE_TITLES[location.pathname] || 'Farmer Health Portal';

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar onMenuClick={() => setMobileOpen(true)} title={currentTitle} />
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
