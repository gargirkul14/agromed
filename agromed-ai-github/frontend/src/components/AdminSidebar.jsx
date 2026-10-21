import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  BookOpen,
  FlaskConical,
  LogOut,
  X,
  ShieldAlert
} from 'lucide-react';

const ADMIN_ITEMS = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Farmers', path: '/admin/farmers', icon: Users },
  { name: 'Health Assessments', path: '/admin/assessments', icon: ClipboardList },
  { name: 'Knowledge Articles', path: '/admin/articles', icon: BookOpen },
  { name: 'Chemical Safety', path: '/admin/chemicals', icon: FlaskConical },
];

export default function AdminSidebar({ mobileOpen, setMobileOpen }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300 border-r border-slate-800 w-64">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-5 h-16 border-b border-slate-800">
        <NavLink to="/admin/dashboard" className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-health-600 flex items-center justify-center text-white shadow-sm">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-bold text-white tracking-tight">AgroMed AI</span>
            <span className="block text-[10px] font-semibold text-health-400 uppercase -mt-0.5">Admin Portal</span>
          </div>
        </NavLink>
        {setMobileOpen && (
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Admin Info */}
      <div className="p-4 mx-3 my-3 rounded-xl bg-slate-800/70 border border-slate-700/60">
        <p className="text-xs font-semibold text-health-400 uppercase tracking-wider">System Administrator</p>
        <p className="text-sm font-medium text-white truncate mt-0.5">{user?.name || 'Administrator'}</p>
        <p className="text-xs text-slate-400 truncate">{user?.email}</p>
      </div>

      {/* Links */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto py-2">
        {ADMIN_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen && setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? 'bg-health-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Sign out */}
      <div className="p-3 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 w-full px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-slate-800 transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden md:block shrink-0 h-screen sticky top-0 z-30">
        {navContent}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-slate-900 shadow-2xl">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
}
