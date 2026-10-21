import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ScoreTrendChart from '../components/ScoreTrendChart';
import {
  History,
  Activity,
  Calendar,
  Filter,
  ArrowRight,
  TrendingUp,
  Loader2,
  AlertCircle
} from 'lucide-react';

export default function HealthHistoryPage() {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRisk, setFilterRisk] = useState('ALL');

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await api.get('/health-assessment');
        if (res.data.success) {
          setAssessments(res.data.assessments || []);
        }
      } catch (err) {
        console.error('Failed to load history:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, []);

  const filteredAssessments = assessments.filter((a) => {
    if (filterRisk === 'ALL') return true;
    return a.riskLevel === filterRisk;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Loader2 className="w-10 h-10 text-agri-600 animate-spin mb-3" />
        <p className="text-sm font-medium text-slate-500">Loading your health history records...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-agri-700 bg-agri-100 px-3 py-1 rounded-full">
            Historical Exposure Tracking
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            Health Assessment History
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review past chemical exposure assessments, symptom patterns, and safety scores over time.
          </p>
        </div>

        <div className="shrink-0">
          <Link
            to="/assessment"
            className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-agri-600 hover:bg-agri-700 text-white text-xs font-bold shadow-md shadow-agri-600/30 transition"
          >
            <Activity className="w-4 h-4" />
            <span>Take New Assessment</span>
          </Link>
        </div>
      </div>

      {/* Safety Score Trend Chart Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-agri-600" />
            <h2 className="text-base font-bold text-slate-900">Safety Score Trajectory</h2>
          </div>
          <span className="text-xs text-slate-400 font-semibold">
            {assessments.length} Lifetime Evaluations
          </span>
        </div>

        <ScoreTrendChart assessments={assessments} />
      </div>

      {/* Table & Filter Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
        
        {/* Risk Filter Bar */}
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">All Past Assessments</h2>
          <div className="flex items-center space-x-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-agri-500"
            >
              <option value="ALL">All Risk Levels</option>
              <option value="HIGH">High Risk</option>
              <option value="MEDIUM">Medium Risk</option>
              <option value="LOW">Low Risk</option>
            </select>
          </div>
        </div>

        {filteredAssessments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase">
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Activity</th>
                  <th className="pb-3">Chemical</th>
                  <th className="pb-3">Symptoms Reported</th>
                  <th className="pb-3">PPE Used</th>
                  <th className="pb-3 text-center">Score</th>
                  <th className="pb-3 text-center">Risk</th>
                  <th className="pb-3 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAssessments.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 font-medium text-slate-700 whitespace-nowrap">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 font-bold text-slate-900">
                      {item.activityType}
                    </td>
                    <td className="py-3.5 text-slate-600 max-w-[130px] truncate">
                      {item.chemicalUsed || 'None reported'}
                    </td>
                    <td className="py-3.5 text-slate-600 max-w-[140px] truncate">
                      {item.symptoms?.join(', ') || 'None'}
                    </td>
                    <td className="py-3.5 text-slate-600 max-w-[120px] truncate">
                      {item.ppeUsed?.join(', ') || 'None'}
                    </td>
                    <td className="py-3.5 text-center font-black text-slate-800">
                      {item.safetyScore}
                    </td>
                    <td className="py-3.5 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          item.riskLevel === 'HIGH'
                            ? 'bg-red-100 text-red-800'
                            : item.riskLevel === 'MEDIUM'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-agri-100 text-agri-800'
                        }`}
                      >
                        {item.riskLevel}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <Link
                        to={`/assessment/result/${item.id}`}
                        className="font-bold text-agri-700 hover:text-agri-900 inline-flex items-center space-x-1"
                      >
                        <span>View</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400 text-xs">
            No health assessment records match your filter.
          </div>
        )}

      </div>

    </div>
  );
}
