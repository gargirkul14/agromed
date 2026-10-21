import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Loader2,
  Sparkles
} from 'lucide-react';

const ACTIVITIES = [
  'Pesticide Spraying',
  'Chemical Mixing',
  'Fertilizer Application',
  'Harvesting',
  'General Farm Work'
];

export default function PPEGuidePage() {
  const [selectedActivity, setSelectedActivity] = useState('Pesticide Spraying');
  const [ppeData, setPpeData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPPE() {
      setLoading(true);
      try {
        const res = await api.get(`/ppe-recommendations?activity=${encodeURIComponent(selectedActivity)}`);
        if (res.data?.success) {
          setPpeData(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching PPE data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchPPE();
  }, [selectedActivity]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-200">
            Safety Standards
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            PPE Safety Guide & Gap Analysis
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Match your farm task with standard occupational safety gear and check missing protection.
          </p>
        </div>

        {/* Activity Selector */}
        <div className="shrink-0">
          <label className="block text-xs font-bold text-slate-500 mb-1">Select Farm Activity:</label>
          <select
            value={selectedActivity}
            onChange={(e) => setSelectedActivity(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-xs text-slate-800 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-green-500"
          >
            {ACTIVITIES.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-green-600 animate-spin mb-2" />
          <p className="text-xs font-semibold text-slate-500">Comparing protective equipment standards...</p>
        </div>
      ) : ppeData ? (
        <div className="space-y-6">
          
          {/* Protection Readiness Card */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-3xl shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[11px] font-bold text-green-400 uppercase tracking-wider">
                  Personal Inventory Gap Analysis
                </span>
                <h3 className="text-lg font-black mt-0.5">Your Protection Readiness</h3>
              </div>

              <div className="text-right">
                <span className="text-2xl sm:text-3xl font-black text-green-400">
                  {ppeData.protectionPercentage}%
                </span>
                <span className="text-xs text-slate-400 block font-medium">
                  {ppeData.equippedCount} of {ppeData.totalRecommended} Recommended Items Equipped
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-700 h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  ppeData.protectionPercentage >= 80
                    ? 'bg-green-500'
                    : ppeData.protectionPercentage >= 50
                    ? 'bg-amber-500'
                    : 'bg-red-500'
                }`}
                style={{ width: `${ppeData.protectionPercentage}%` }}
              />
            </div>
          </div>

          {/* Side by side comparison checklist */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-slate-900">
              Required Protective Gear for: <span className="text-green-700 font-bold">{selectedActivity}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ppeData.comparison?.map((item, idx) => {
                const isEquipped = item.status === 'Equipped';
                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border transition flex items-start space-x-3 ${
                      isEquipped
                        ? 'bg-green-50/50 border-green-200 text-green-950'
                        : 'bg-red-50/50 border-red-200 text-red-950'
                    }`}
                  >
                    {isEquipped ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    )}

                    <div className="text-xs flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm">{item.name}</span>
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                          isEquipped ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                      <p className="mt-1 text-slate-600 font-medium">
                        {item.description || 'Essential equipment to reduce occupational chemical and aerosol exposure.'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Safety Rule Note */}
          <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl flex items-start space-x-3 text-xs text-amber-900 font-medium">
            <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-black block">Safety Recommendation:</span>
              <span>
                Standard cotton shirts and normal cloths do not stop chemical absorption. In fact, wet cloth holds toxic liquids against your skin, accelerating chemical uptake into the bloodstream. Always equip water-resistant PPE.
              </span>
            </div>
          </div>

        </div>
      ) : null}

    </div>
  );
}
