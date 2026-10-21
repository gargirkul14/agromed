import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  User,
  Briefcase,
  Activity,
  Lightbulb,
  ShieldCheck,
  Bot,
  BookOpen,
  History,
  LogOut,
  X,
  Shield
} from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'My Profile', path: '/profile', icon: User },
  { name: 'Work Profile', path: '/work-profile', icon: Briefcase },
  { name: 'Health Assessment', path: '/assessment', icon: Activity },
  { name: 'Safety Recommendations', path: '/recommendations', icon: Lightbulb },
  { name: 'PPE Guide', path: '/ppe-guide', icon: ShieldCheck },
  { name: 'Ask AgroMed AI', path: '/chatbot', icon: Bot },
  { name: 'Knowledge Center', path: '/knowledge', icon: BookOpen },
  { name: 'Health History', path: '/history', icon: History },
];

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200 w-64">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-5 h-16 border-b border-slate-200">
        <NavLink to="/dashboard" className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-agri-600 to-health-600 flex items-center justify-center text-white shadow-sm">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-bold text-slate-900 tracking-tight">AgroMed AI</span>
            <span className="block text-[10px] font-semibold text-agri-700 uppercase -mt-0.5">Farmer Portal</span>
          </div>
        </NavLink>
        {setMobileOpen && (
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Farmer Profile Badge */}
      <div className="p-4 mx-3 my-3 rounded-xl bg-gradient-to-br from-agri-50 to-health-50 border border-agri-100">
        <p className="text-xs font-medium text-slate-500">Welcome Farmer</p>
        <p className="text-sm font-bold text-slate-800 truncate">{user?.name || 'Farmer'}</p>
        <div className="flex items-center space-x-1.5 mt-1.5">
          <span className="w-2 h-2 rounded-full bg-agri-500 animate-pulse"></span>
          <span className="text-[11px] font-semibold text-agri-700">Health Guard Active</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto py-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen && setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? 'bg-agri-600 text-white shadow-sm shadow-agri-600/30'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Logout */}
      <div className="p-3 border-t border-slate-200">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 w-full px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 transition"
        >
          <LogOut className="w-4 h-4 text-slate-400 group-hover:text-red-600" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:block shrink-0 h-screen sticky top-0 z-30">
        {navContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-2xl">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
}
