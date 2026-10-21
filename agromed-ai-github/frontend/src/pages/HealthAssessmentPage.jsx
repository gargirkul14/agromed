import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { EXPOSURE_DURATIONS, FARMING_ACTIVITIES, SYMPTOMS_LIST, PPE_LIST } from '../utils/constants';
import {
  Activity,
  AlertTriangle,
  ShieldAlert,
  Clock,
  FlaskConical,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight
} from 'lucide-react';

export default function HealthAssessmentPage() {
  const [formData, setFormData] = useState({
    chemicalUsed: '',
    exposureDuration: '1–3 hours',
    activityType: 'Pesticide Spraying',
    symptoms: ['No Symptoms'],
    ppeUsed: ['Gloves', 'Boots']
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleSymptomToggle = (symptom) => {
    let current = [...formData.symptoms];

    if (symptom === 'No Symptoms') {
      current = ['No Symptoms'];
    } else {
      current = current.filter(s => s !== 'No Symptoms');
      if (current.includes(symptom)) {
        current = current.filter(s => s !== symptom);
        if (current.length === 0) current = ['No Symptoms'];
      } else {
        current.push(symptom);
      }
    }

    setFormData({ ...formData, symptoms: current });
  };

  const handlePPEToggle = (ppe) => {
    let current = [...formData.ppeUsed];

    if (ppe === 'None') {
      current = ['None'];
    } else {
      current = current.filter(p => p !== 'None');
      if (current.includes(ppe)) {
        current = current.filter(p => p !== ppe);
        if (current.length === 0) current = ['None'];
      } else {
        current.push(ppe);
      }
    }

    setFormData({ ...formData, ppeUsed: current });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (formData.symptoms.length === 0) {
      setErrorMsg('Please select at least one symptom option (or select "No Symptoms").');
      return;
    }

    if (formData.ppeUsed.length === 0) {
      setErrorMsg('Please select at least one PPE option (or select "None").');
      return;
    }

    setLoading(true);

    try {
      const res = await api.post('/health-assessment', formData);
      if (res.data.success) {
        navigate(`/assessment/result/${res.data.assessment.id}`, {
          state: { result: res.data.assessment }
        });
      } else {
        setErrorMsg(res.data.message || 'Assessment evaluation failed.');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to submit health assessment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-agri-700 bg-agri-100 px-3 py-1 rounded-full">
            Core Evaluation Engine
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            Health & Safety Risk Assessment
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Answer the questions regarding your recent agricultural task to calculate your occupational risk.
          </p>
        </div>

        <div className="shrink-0 p-3 rounded-2xl bg-agri-50 border border-agri-100 text-center">
          <Activity className="w-6 h-6 text-agri-600 mx-auto" />
          <span className="text-[11px] font-bold text-agri-800 block mt-1">Rule Engine Ready</span>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* SECTION 1: Chemical & Activity Details */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-5">
          <div className="flex items-center space-x-2.5 pb-4 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-agri-50 text-agri-600 flex items-center justify-center">
              <FlaskConical className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Task & Agrochemical Details</h2>
              <p className="text-xs text-slate-500">Specify the operation performed and active chemical name.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Farming Activity *
              </label>
              <select
                value={formData.activityType}
                onChange={(e) => setFormData({ ...formData, activityType: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-agri-500 text-sm bg-white"
              >
                {FARMING_ACTIVITIES.map((act) => (
                  <option key={act} value={act}>{act}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Chemical or Pesticide Used
              </label>
              <input
                type="text"
                value={formData.chemicalUsed}
                onChange={(e) => setFormData({ ...formData, chemicalUsed: e.target.value })}
                placeholder="e.g. Chlorpyrifos 20% EC or DAP"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-agri-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Exposure Duration *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {EXPOSURE_DURATIONS.map((dur) => {
                const isSelected = formData.exposureDuration === dur;
                return (
                  <button
                    type="button"
                    key={dur}
                    onClick={() => setFormData({ ...formData, exposureDuration: dur })}
                    className={`py-3 px-3 rounded-2xl border text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
                      isSelected
                        ? 'bg-agri-600 text-white border-agri-600 shadow-sm shadow-agri-600/30'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5 shrink-0" />
                    <span>{dur}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* SECTION 2: Symptoms Checklist */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center space-x-2.5 pb-4 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Symptoms Experienced Post-Activity</h2>
              <p className="text-xs text-slate-500">Select any discomfort or bodily symptoms noticed during or after work.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {SYMPTOMS_LIST.map((sym) => {
              const isSelected = formData.symptoms.includes(sym);
              const isCritical = sym === 'Breathing Difficulty';
              return (
                <button
                  type="button"
                  key={sym}
                  onClick={() => handleSymptomToggle(sym)}
                  className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition ${
                    isSelected
                      ? isCritical
                        ? 'bg-red-50 border-red-500 text-red-900 font-bold'
                        : 'bg-agri-50 border-agri-500 text-agri-900 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span className="text-xs sm:text-sm">{sym}</span>
                  <div className={`w-4 h-4 rounded-md flex items-center justify-center border ${
                    isSelected
                      ? isCritical
                        ? 'bg-red-600 border-red-600 text-white'
                        : 'bg-agri-600 border-agri-600 text-white'
                      : 'border-slate-300 bg-white'
                  }`}>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION 3: PPE Used During Activity */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center space-x-2.5 pb-4 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">PPE Worn During This Specific Activity</h2>
              <p className="text-xs text-slate-500">Personal Protective Equipment significantly reduces toxic absorption scores.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {PPE_LIST.map((ppe) => {
              const isSelected = formData.ppeUsed.includes(ppe);
              return (
                <button
                  type="button"
                  key={ppe}
                  onClick={() => handlePPEToggle(ppe)}
                  className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition ${
                    isSelected
                      ? 'bg-agri-50 border-agri-500 text-agri-900 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span className="text-xs sm:text-sm">{ppe}</span>
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

        {/* Submit Action Bar */}
        <div className="p-4 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400">
            <span className="font-bold text-slate-200">Rule-Based Evaluation:</span> Instant calculation of risk level, safety score & emergency precautions.
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 rounded-2xl bg-agri-500 hover:bg-agri-600 text-slate-950 font-black text-sm shadow-lg transition disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Running Risk Engine...</span>
              </>
            ) : (
              <>
                <span>Calculate Risk & Safety Score</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
}
