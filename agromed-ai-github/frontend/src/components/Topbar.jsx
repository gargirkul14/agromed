import React from 'react';
import { Menu, Bell, ShieldAlert, HeartPulse, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Topbar({ onMenuClick, title = "Dashboard" }) {
  const { user, isAdmin } = useAuth();

  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
      {/* Left side: Hamburger + Page Title */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100"
          aria-label="Open Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold text-slate-800 tracking-tight">{title}</h1>
      </div>

      {/* Right side: Emergency info + User badge */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Emergency Quick Pill */}
        <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-red-50 text-red-700 border border-red-200 text-xs font-semibold">
          <HeartPulse className="w-3.5 h-3.5 text-red-600 animate-pulse" />
          <span>Emergency: Dial 108 / 112</span>
        </div>

        {/* User Pill */}
        <div className="flex items-center space-x-2.5 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-agri-100 text-agri-800 flex items-center justify-center font-bold text-xs uppercase border border-agri-200">
            {user?.name ? user.name.charAt(0) : 'U'}
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-semibold text-slate-800 leading-tight">{user?.name}</p>
            <p className="text-[10px] text-slate-500 capitalize">{user?.role ? user.role.toLowerCase() : 'user'}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
