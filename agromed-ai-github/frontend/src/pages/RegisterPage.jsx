import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Shield,
  UserPlus,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Mail,
  Phone,
  Lock,
  User
} from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  // Field validation - only checks that phone number is 10 digits
  const validateField = (name, value) => {
    let error = '';
    const trimmed = (value || '').trim();

    if (name === 'name') {
      if (!trimmed) error = 'Full Name is required.';
      else if (trimmed.length < 2) error = 'Name must be at least 2 characters.';
    }

    if (name === 'email') {
      if (!trimmed) error = 'Email address is required.';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
        error = 'Please enter a valid email address.';
      }
    }

    if (name === 'phone') {
      if (!trimmed) {
        error = 'Phone number is required.';
      } else {
        // Only check that digits are exactly 10 digits
        const digits = trimmed.replace(/\D/g, '');
        if (digits.length !== 10) {
          error = 'Mobile number must be exactly 10 digits.';
        }
      }
    }

    if (name === 'password') {
      if (!value || value.length < 6) error = 'Password must be at least 6 characters.';
    }

    if (name === 'confirmPassword') {
      if (value !== formData.password) error = 'Passwords do not match.';
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
    setGeneralError('');
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    if (error) {
      setFieldErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');

    // Validate all fields
    const errors = {};
    Object.keys(formData).forEach((key) => {
      const err = validateField(key, formData[key]);
      if (err) errors[key] = err;
    });

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setGeneralError('Please correct the highlighted errors before submitting.');
      return;
    }

    setLoading(true);
    const result = await register({
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim().replace(/\D/g, ''),
      password: formData.password
    });
    setLoading(false);

    if (result.success) {
      navigate('/dashboard', { replace: true });
    } else {
      setGeneralError(result.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/50">
        
        {/* Header */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-agri-600 to-health-600 flex items-center justify-center text-white mx-auto shadow-md shadow-agri-600/30">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="mt-4 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Farmer Registration
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-500">
            Create your account to access agricultural health & safety assessments.
          </p>
        </div>

        {/* Global Error Banner */}
        {generalError && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{generalError}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="e.g. Ramesh Patel"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition focus:outline-none focus:ring-2 ${
                  fieldErrors.name
                    ? 'border-red-300 focus:ring-red-500 bg-red-50/30'
                    : 'border-slate-300 focus:ring-agri-500 focus:border-transparent'
                }`}
              />
            </div>
            {fieldErrors.name && (
              <p className="mt-1 text-xs text-red-600 font-medium">{fieldErrors.name}</p>
            )}
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="ramesh@example.com"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition focus:outline-none focus:ring-2 ${
                  fieldErrors.email
                    ? 'border-red-300 focus:ring-red-500 bg-red-50/30'
                    : 'border-slate-300 focus:ring-agri-500 focus:border-transparent'
                }`}
              />
            </div>
            {fieldErrors.email && (
              <p className="mt-1 text-xs text-red-600 font-medium">{fieldErrors.email}</p>
            )}
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Mobile Number (10 Digits) *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="tel"
                name="phone"
                maxLength={10}
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="9876543210"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition focus:outline-none focus:ring-2 ${
                  fieldErrors.phone
                    ? 'border-red-300 focus:ring-red-500 bg-red-50/30'
                    : 'border-slate-300 focus:ring-agri-500 focus:border-transparent'
                }`}
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Enter your 10-digit mobile number.</p>
            {fieldErrors.phone && (
              <p className="mt-1 text-xs text-red-600 font-medium">{fieldErrors.phone}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Password (min. 6 characters) *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="••••••••"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition focus:outline-none focus:ring-2 ${
                  fieldErrors.password
                    ? 'border-red-300 focus:ring-red-500 bg-red-50/30'
                    : 'border-slate-300 focus:ring-agri-500 focus:border-transparent'
                }`}
              />
            </div>
            {fieldErrors.password && (
              <p className="mt-1 text-xs text-red-600 font-medium">{fieldErrors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Confirm Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="••••••••"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition focus:outline-none focus:ring-2 ${
                  fieldErrors.confirmPassword
                    ? 'border-red-300 focus:ring-red-500 bg-red-50/30'
                    : 'border-slate-300 focus:ring-agri-500 focus:border-transparent'
                }`}
              />
            </div>
            {fieldErrors.confirmPassword && (
              <p className="mt-1 text-xs text-red-600 font-medium">{fieldErrors.confirmPassword}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 py-3.5 px-4 rounded-xl text-white bg-agri-600 hover:bg-agri-700 font-bold text-sm shadow-md shadow-agri-600/30 transition disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Register Farmer Account</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer Link */}
        <div className="text-center pt-2 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-agri-600 hover:text-agri-700 transition">
              Sign In
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
