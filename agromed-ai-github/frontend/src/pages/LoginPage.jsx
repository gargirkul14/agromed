import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, LogIn, AlertCircle, Loader2, Sparkles, CheckCircle } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const isExpired = queryParams.get('expired') === 'true';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    const result = await login(email.trim(), password);
    setLoading(false);

    if (result.success) {
      if (result.user.role === 'ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } else {
      setError(result.message);
    }
  };

  // Quick fill for teachers & evaluators
  const quickFill = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/50">
        
        {/* Header */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-agri-600 to-health-600 flex items-center justify-center text-white mx-auto shadow-md shadow-agri-600/30">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="mt-4 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Welcome to AgroMed AI
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Sign in to access your farmer health records and safety tools.
          </p>
        </div>

        {/* Demo Quick Fill for Teachers / Presentation */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700">
            <Sparkles className="w-3.5 h-3.5 text-agri-600" />
            <span>Academic Presentation Quick-Fill:</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => quickFill('farmer@agromed.ai', 'Farmer@123')}
              className="px-2.5 py-1.5 rounded-lg bg-agri-100/70 hover:bg-agri-100 text-agri-800 text-xs font-semibold border border-agri-200 transition text-left"
            >
              🌾 Demo Farmer
            </button>
            <button
              type="button"
              onClick={() => quickFill('admin@agromed.ai', 'Admin@123')}
              className="px-2.5 py-1.5 rounded-lg bg-slate-200/70 hover:bg-slate-200 text-slate-800 text-xs font-semibold border border-slate-300 transition text-left"
            >
              🛡️ Demo Admin
            </button>
          </div>
        </div>

        {isExpired && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium">
            Your previous session has expired. Please log in again.
          </div>
        )}

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="farmer@agromed.ai"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-agri-500 focus:border-transparent text-sm transition"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Password
              </label>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-agri-500 focus:border-transparent text-sm transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 py-3.5 px-4 rounded-xl text-white bg-agri-600 hover:bg-agri-700 font-bold text-sm shadow-md shadow-agri-600/30 transition disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-agri-700 hover:text-agri-800 underline">
            Register as a Farmer
          </Link>
        </div>

      </div>
    </div>
  );
}
