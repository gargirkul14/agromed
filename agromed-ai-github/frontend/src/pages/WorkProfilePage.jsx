import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { FARMING_TYPES, PPE_LIST } from '../utils/constants';
import { Briefcase, ShieldAlert, Sprout, Clock, CheckCircle2, AlertCircle, Loader2, Save } from 'lucide-react';

export default function WorkProfilePage() {
  const { refreshProfile } = useAuth();

  const [formData, setFormData] = useState({
    cropName: '',
    farmingType: 'Conventional (Chemical)',
    farmSize: '',
    averageWorkingHours: 8,
    daysWorkedPerWeek: 6,
    usesPesticides: true,
    usesFertilizers: true,
    commonPesticides: '',
    commonFertilizers: '',
    ppeUsed: ['Gloves', 'Boots']
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    async function loadWorkProfile() {
      try {
        const res = await api.get('/work-profile');
        if (res.data.success && res.data.workProfile) {
          const w = res.data.workProfile;
          let parsedPesticides = w.commonPesticides;
          if (typeof parsedPesticides === 'string') {
            try {
              const arr = JSON.parse(parsedPesticides);
              if (Array.isArray(arr)) parsedPesticides = arr.join(', ');
            } catch {
              // keep as string
            }
          }

          let parsedFertilizers = w.commonFertilizers;
          if (typeof parsedFertilizers === 'string') {
            try {
              const arr = JSON.parse(parsedFertilizers);
              if (Array.isArray(arr)) parsedFertilizers = arr.join(', ');
            } catch {
              // keep as string
            }
          }

          let parsedPPE = [];
          if (Array.isArray(w.ppeUsed)) {
            parsedPPE = w.ppeUsed;
          } else if (typeof w.ppeUsed === 'string') {
            try {
              parsedPPE = JSON.parse(w.ppeUsed);
            } catch {
              parsedPPE = w.ppeUsed.split(',').map(s => s.trim());
            }
          }

          setFormData({
            cropName: w.cropName || '',
            farmingType: w.farmingType || 'Conventional (Chemical)',
            farmSize: w.farmSize || '',
            averageWorkingHours: w.averageWorkingHours || 8,
            daysWorkedPerWeek: w.daysWorkedPerWeek || 6,
            usesPesticides: Boolean(w.usesPesticides),
            usesFertilizers: Boolean(w.usesFertilizers),
            commonPesticides: parsedPesticides || '',
            commonFertilizers: parsedFertilizers || '',
            ppeUsed: parsedPPE.length > 0 ? parsedPPE : ['None']
          });
        }
      } catch (err) {
        console.error('Failed to load work profile:', err);
      } finally {
        setLoading(false);
      }
    }

    loadWorkProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handlePPEToggle = (item) => {
    let current = [...formData.ppeUsed];

    if (item === 'None') {
      current = ['None'];
    } else {
      current = current.filter(p => p !== 'None');
      if (current.includes(item)) {
        current = current.filter(p => p !== item);
        if (current.length === 0) current = ['None'];
      } else {
        current.push(item);
      }
    }

    setFormData({ ...formData, ppeUsed: current });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    setSaving(true);

    try {
      // Split comma separated pesticides and fertilizers into arrays
      const pesticidesArray = formData.commonPesticides
        ? formData.commonPesticides.split(',').map(s => s.trim()).filter(Boolean)
        : [];
      const fertilizersArray = formData.commonFertilizers
        ? formData.commonFertilizers.split(',').map(s => s.trim()).filter(Boolean)
        : [];

      const payload = {
        ...formData,
        commonPesticides: pesticidesArray,
        commonFertilizers: fertilizersArray
      };

      const res = await api.post('/work-profile', payload);
      if (res.data.success) {
        setSuccessMsg('Farming work profile saved successfully! Personalized recommendations updated.');
        await refreshProfile();
      } else {
        setErrorMsg(res.data.message || 'Failed to save work profile.');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Error saving work profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Loader2 className="w-10 h-10 text-agri-600 animate-spin mb-3" />
        <p className="text-sm font-medium text-slate-500">Loading work profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-agri-700 bg-agri-100 px-3 py-1 rounded-full">
            Occupational Working Environment
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            My Work Profile
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Specify your daily agricultural conditions, chemical usage, and active protective equipment.
          </p>
        </div>

        <div className="shrink-0 text-right">
          <div className="text-xs font-semibold text-slate-400">STATUS</div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-agri-700 bg-agri-50 px-3 py-1.5 rounded-full border border-agri-200 mt-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-agri-600" />
            <span>Hazard Mapping Ready</span>
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
        
        {/* SECTION 1: Farming Information */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-5">
          <div className="flex items-center space-x-2.5 pb-4 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-agri-50 text-agri-600 flex items-center justify-center">
              <Sprout className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Farming Information</h2>
              <p className="text-xs text-slate-500">Crops cultivated and scale of farming operations.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Main Crop Name *
              </label>
              <input
                type="text"
                name="cropName"
                required
                value={formData.cropName}
                onChange={handleChange}
                placeholder="e.g. Paddy (Rice), Cotton, Wheat"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-agri-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Type of Farming
              </label>
              <select
                name="farmingType"
                value={formData.farmingType}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-agri-500 text-sm bg-white"
              >
                {FARMING_TYPES.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Farm Size (Optional)
              </label>
              <input
                type="text"
                name="farmSize"
                value={formData.farmSize}
                onChange={handleChange}
                placeholder="e.g. 4.5 Acres"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-agri-500 text-sm"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: Work Duration */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-5">
          <div className="flex items-center space-x-2.5 pb-4 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Work Schedule & Fatigue Indicators</h2>
              <p className="text-xs text-slate-500">Long working shifts compound heat exhaustion and chemical risks.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Average Working Hours Per Day ({formData.averageWorkingHours} hrs)
              </label>
              <input
                type="range"
                name="averageWorkingHours"
                min="2"
                max="16"
                step="0.5"
                value={formData.averageWorkingHours}
                onChange={handleChange}
                className="w-full accent-agri-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>2 hours</span>
                <span>8 hours (Standard)</span>
                <span>16 hours</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Days Worked Per Week ({formData.daysWorkedPerWeek} days)
              </label>
              <input
                type="range"
                name="daysWorkedPerWeek"
                min="1"
                max="7"
                step="1"
                value={formData.daysWorkedPerWeek}
                onChange={handleChange}
                className="w-full accent-agri-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>1 day</span>
                <span>5 days</span>
                <span>7 days (No rest)</span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: Chemical & Agrochemical Usage */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-5">
          <div className="flex items-center space-x-2.5 pb-4 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Agrochemical Usage Details</h2>
              <p className="text-xs text-slate-500">Document the specific chemical types you routinely apply.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Pesticides */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-800">Do you use pesticides / insecticides?</span>
                <div className="flex items-center space-x-3 text-xs font-bold">
                  <label className="inline-flex items-center space-x-1 cursor-pointer">
                    <input
                      type="radio"
                      name="usesPesticides"
                      checked={formData.usesPesticides === true}
                      onChange={() => setFormData({ ...formData, usesPesticides: true })}
                      className="accent-agri-600"
                    />
                    <span>Yes</span>
                  </label>
                  <label className="inline-flex items-center space-x-1 cursor-pointer">
                    <input
                      type="radio"
                      name="usesPesticides"
                      checked={formData.usesPesticides === false}
                      onChange={() => setFormData({ ...formData, usesPesticides: false })}
                      className="accent-agri-600"
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>

              {formData.usesPesticides && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Common Pesticides Used (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="commonPesticides"
                    value={formData.commonPesticides}
                    onChange={handleChange}
                    placeholder="e.g. Chlorpyrifos, Monocrotophos, Imidacloprid"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-agri-500 text-xs bg-white"
                  />
                </div>
              )}
            </div>

            {/* Fertilizers */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-800">Do you use chemical fertilizers?</span>
                <div className="flex items-center space-x-3 text-xs font-bold">
                  <label className="inline-flex items-center space-x-1 cursor-pointer">
                    <input
                      type="radio"
                      name="usesFertilizers"
                      checked={formData.usesFertilizers === true}
                      onChange={() => setFormData({ ...formData, usesFertilizers: true })}
                      className="accent-agri-600"
                    />
                    <span>Yes</span>
                  </label>
                  <label className="inline-flex items-center space-x-1 cursor-pointer">
                    <input
                      type="radio"
                      name="usesFertilizers"
                      checked={formData.usesFertilizers === false}
                      onChange={() => setFormData({ ...formData, usesFertilizers: false })}
                      className="accent-agri-600"
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>

              {formData.usesFertilizers && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Common Fertilizers Used (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="commonFertilizers"
                    value={formData.commonFertilizers}
                    onChange={handleChange}
                    placeholder="e.g. Urea, DAP, MOP Potash"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-agri-500 text-xs bg-white"
                  />
                </div>
              )}
            </div>

          </div>
        </div>

        {/* SECTION 4: Current PPE Usage */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-5">
          <div className="flex items-center space-x-2.5 pb-4 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Current PPE (Personal Protective Equipment)</h2>
              <p className="text-xs text-slate-500">Select all gear you currently own and utilize during farming activities.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {PPE_LIST.map((item) => {
              const isSelected = formData.ppeUsed.includes(item);
              return (
                <button
                  type="button"
                  key={item}
                  onClick={() => handlePPEToggle(item)}
                  className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition ${
                    isSelected
                      ? 'bg-agri-50 border-agri-500 text-agri-900 font-bold shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span className="text-xs sm:text-sm">{item}</span>
                  <div className={`w-4 h-4 rounded-md flex items-center justify-center border ${
                    isSelected ? 'bg-agri-600 border-agri-600 text-white' : 'border-slate-300 bg-white'
                  }`}>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                </button>
              );
            })}
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
                <span>Saving Work Profile...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Work Profile</span>
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
}
