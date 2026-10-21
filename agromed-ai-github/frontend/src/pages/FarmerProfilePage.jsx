import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { User, MapPin, Briefcase, Save, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function FarmerProfilePage() {
  const { user, farmerProfile, refreshProfile } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    age: '',
    gender: 'Male',
    village: '',
    district: '',
    state: '',
    yearsOfFarming: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await api.get('/farmer/profile');
        if (res.data.success) {
          const p = res.data.profile;
          setFormData({
            name: p.user?.name || user?.name || '',
            phone: p.user?.phone || user?.phone || '',
            age: p.age || '',
            gender: p.gender || 'Male',
            village: p.village || '',
            district: p.district || '',
            state: p.state || '',
            yearsOfFarming: p.yearsOfFarming !== null && p.yearsOfFarming !== undefined ? p.yearsOfFarming : ''
          });
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    setSaving(true);

    try {
      const res = await api.put('/farmer/profile', formData);
      if (res.data.success) {
        setSuccessMsg('Your personal & farming profile has been updated successfully.');
        await refreshProfile();
      } else {
        setErrorMsg(res.data.message || 'Failed to update profile.');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Error updating profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Loader2 className="w-10 h-10 text-agri-600 animate-spin mb-3" />
        <p className="text-sm font-medium text-slate-500">Loading farmer profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-agri-700 bg-agri-100 px-3 py-1 rounded-full">
            Farmer Profile Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            Personal & Location Profile
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Keep your personal and agricultural background updated to receive accurate health guidance.
          </p>
        </div>

        <div className="shrink-0 text-right">
          <div className="text-xs font-semibold text-slate-400">STATUS</div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-agri-700 bg-agri-50 px-3 py-1.5 rounded-full border border-agri-200 mt-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-agri-600" />
            <span>Profile Registered</span>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-agri-50 border border-agri-200 text-agri-800 text-sm font-medium flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-agri-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* SECTION 1: Personal Information */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-5">
          <div className="flex items-center space-x-2.5 pb-4 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-agri-50 text-agri-600 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Personal Information</h2>
              <p className="text-xs text-slate-500">Essential demographic details for occupational health context.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Ramesh Patel"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-agri-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-agri-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Age (Years)
              </label>
              <input
                type="number"
                name="age"
                min="14"
                max="100"
                value={formData.age}
                onChange={handleChange}
                placeholder="e.g. 42"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-agri-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-agri-500 text-sm bg-white"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other / Prefer not to say</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 2: Location Information */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-5">
          <div className="flex items-center space-x-2.5 pb-4 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-health-50 text-health-600 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Location Information</h2>
              <p className="text-xs text-slate-500">Helps localize regional crop patterns and climate risks.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Village / Town
              </label>
              <input
                type="text"
                name="village"
                value={formData.village}
                onChange={handleChange}
                placeholder="e.g. Kisanpur"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-agri-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                District
              </label>
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                placeholder="e.g. Salem"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-agri-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                State / Province
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="e.g. Tamil Nadu"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-agri-500 text-sm"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: Farming Experience */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-5">
          <div className="flex items-center space-x-2.5 pb-4 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Farming Experience</h2>
              <p className="text-xs text-slate-500">Cumulative years of agricultural field labor.</p>
            </div>
          </div>

          <div className="max-w-xs">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Years of Farming Experience
            </label>
            <input
              type="number"
              name="yearsOfFarming"
              min="0"
              max="80"
              value={formData.yearsOfFarming}
              onChange={handleChange}
              placeholder="e.g. 15"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-agri-500 text-sm"
            />
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-end space-x-3">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-agri-600 hover:bg-agri-700 text-white font-bold text-sm shadow-md shadow-agri-600/30 transition disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Profile...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Profile Information</span>
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
}
