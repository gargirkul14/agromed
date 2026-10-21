import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Shield,
  LayoutDashboard,
  LogOut,
  User,
  Menu,
  X,
  BookOpen,
  ShieldCheck,
  PhoneCall
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Emergency Ribbon */}
      <div className="bg-red-600 text-white text-[11px] font-bold py-1 px-4 text-center flex items-center justify-center space-x-2">
        <PhoneCall className="w-3.5 h-3.5" />
        <span>Medical Emergency / Poison Control Helpline: Call <strong>108</strong> or <strong>112</strong></span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-agri-600 text-white flex items-center justify-center shadow-sm">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-slate-900 block leading-tight">
                AgroMed <span className="text-agri-600">AI</span>
              </span>
              <span className="text-[10px] text-slate-500 font-semibold block leading-none">
                Farmer Health & Safety Assistant
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6 text-xs font-bold text-slate-600">
            <Link to="/" className={`hover:text-agri-600 transition ${location.pathname === '/' ? 'text-agri-600' : ''}`}>
              Home
            </Link>
            <Link to="/knowledge" className={`hover:text-agri-600 transition flex items-center space-x-1 ${location.pathname.startsWith('/knowledge') ? 'text-agri-600' : ''}`}>
              <BookOpen className="w-3.5 h-3.5" />
              <span>Safety Knowledge</span>
            </Link>
            <Link to="/ppe-guide" className={`hover:text-agri-600 transition flex items-center space-x-1 ${location.pathname === '/ppe-guide' ? 'text-agri-600' : ''}`}>
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>PPE Guide</span>
            </Link>
          </nav>

          {/* Auth Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link
                  to={isAdmin ? '/admin/dashboard' : '/dashboard'}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-agri-600 hover:bg-agri-700 text-white text-xs font-bold shadow-sm transition"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>{isAdmin ? 'Admin Dashboard' : 'My Dashboard'}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-red-600 hover:border-red-200 transition"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-agri-600 hover:bg-slate-50 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl bg-agri-600 hover:bg-agri-700 text-white text-xs font-bold shadow-sm transition"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 text-xs font-bold text-slate-700">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block py-2">
            Home
          </Link>
          <Link to="/knowledge" onClick={() => setMobileMenuOpen(false)} className="block py-2">
            Safety Knowledge Center
          </Link>
          <Link to="/ppe-guide" onClick={() => setMobileMenuOpen(false)} className="block py-2">
            PPE Safety Guide
          </Link>
          <div className="pt-2 border-t border-slate-100 flex flex-col space-y-2">
            {isAuthenticated ? (
              <Link
                to={isAdmin ? '/admin/dashboard' : '/dashboard'}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-4 rounded-xl bg-agri-600 text-white text-center font-bold"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 px-4 rounded-xl border border-slate-200 text-center"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 px-4 rounded-xl bg-agri-600 text-white text-center"
                >
                  Register Farmer Account
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
