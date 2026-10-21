import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  Lightbulb,
  Shield,
  ShieldAlert,
  Clock,
  Droplets,
  Sun,
  Coffee,
  Lock,
  Wind,
  Sparkles,
  HeartPulse,
  Eye,
  Footprints,
  AlertTriangle,
  Loader2,
  Filter
} from 'lucide-react';

const ICON_MAP = {
  Clock,
  Coffee,
  Wind,
  Lock,
  Sparkles,
  ShieldAlert,
  Shield,
  Eye,
  Footprints,
  Droplets,
  Sun,
  AlertTriangle,
  HeartPulse
};

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');

  useEffect(() => {
    async function loadRecommendations() {
      try {
        const res = await api.get('/recommendations');
        if (res.data.success) {
          setRecommendations(res.data.recommendations || []);
        }
      } catch (err) {
        console.error('Failed to load recommendations:', err);
      } finally {
        setLoading(false);
      }
    }

    loadRecommendations();
  }, []);

  const categories = ['All', ...new Set(recommendations.map(r => r.category))];
  const priorities = ['All', 'High', 'Medium', 'General'];

  const filtered = recommendations.filter(rec => {
    const matchCategory = selectedCategory === 'All' || rec.category === selectedCategory;
    const matchPriority = selectedPriority === 'All' || rec.priority === selectedPriority;
    return matchCategory && matchPriority;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Loader2 className="w-10 h-10 text-agri-600 animate-spin mb-3" />
        <p className="text-sm font-medium text-slate-500">Synthesizing personalized safety recommendations...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-agri-700 bg-agri-100 px-3 py-1 rounded-full">
            Context-Aware Precautions
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            My Safety Recommendations
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Synthesized dynamically from your crop profile, chemical handling habits, shift hours, and recent assessment symptoms.
          </p>
        </div>

        <div className="shrink-0">
          <span className="px-4 py-2 rounded-2xl bg-agri-50 border border-agri-200 text-agri-800 text-xs font-bold">
            {recommendations.length} Active Safety Directives
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 ml-1 mr-1" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition ${
                selectedCategory === cat
                  ? 'bg-agri-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Priority Filter */}
        <div className="flex items-center space-x-2 shrink-0">
          <span className="text-xs font-bold text-slate-400">PRIORITY:</span>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-agri-500"
          >
            {priorities.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Recommendations Cards Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((rec) => {
            const IconComponent = ICON_MAP[rec.icon] || Shield;
            const isHigh = rec.priority === 'High';
            const isMedium = rec.priority === 'Medium';

            let badgeBg = 'bg-slate-100 text-slate-700 border-slate-200';
            let iconBg = 'bg-slate-50 text-slate-600';
            let borderAccent = 'border-slate-200';

            if (isHigh) {
              badgeBg = 'bg-red-100 text-red-800 border-red-200';
              iconBg = 'bg-red-50 text-red-600';
              borderAccent = 'border-red-200 hover:border-red-300';
            } else if (isMedium) {
              badgeBg = 'bg-amber-100 text-amber-800 border-amber-200';
              iconBg = 'bg-amber-50 text-amber-600';
              borderAccent = 'border-amber-200 hover:border-amber-300';
            } else {
              badgeBg = 'bg-agri-100 text-agri-800 border-agri-200';
              iconBg = 'bg-agri-50 text-agri-600';
              borderAccent = 'border-agri-200 hover:border-agri-300';
            }

            return (
              <div
                key={rec.id}
                className={`bg-white rounded-3xl p-6 border ${borderAccent} shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4`}
              >
                <div>
                  {/* Card Header: Category + Priority Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      {rec.category}
                    </span>
                    <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${badgeBg}`}>
                      {rec.priority} Priority
                    </span>
                  </div>

                  {/* Icon & Title */}
                  <div className="flex items-start space-x-3 mb-3">
                    <div className={`w-10 h-10 rounded-2xl ${iconBg} flex items-center justify-center shrink-0`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {rec.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {rec.description}
                  </p>
                </div>

                {/* Actionable Tip Box */}
                {rec.actionableTip && (
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
                    <span className="font-bold text-slate-900 block mb-0.5">Actionable Step:</span>
                    <span>{rec.actionableTip}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-2">
          <Lightbulb className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">No matching recommendations found</h3>
          <p className="text-xs text-slate-400">Try adjusting your category or priority filters above.</p>
        </div>
      )}

    </div>
  );
}
