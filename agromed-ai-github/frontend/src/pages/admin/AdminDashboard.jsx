import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import {
  Users,
  ClipboardList,
  AlertCircle,
  Activity,
  BookOpen,
  FlaskConical,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Loader2
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentAssessments, setRecentAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdminStats() {
      try {
        const res = await api.get('/admin/dashboard');
        if (res.data.success) {
          setStats(res.data.stats);
          setRecentAssessments(res.data.recentAssessments || []);
        }
      } catch (err) {
        console.error('Failed to load admin dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    }

    loadAdminStats() ;
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Loader2 className="w-10 h-10 text-health-600 animate-spin mb-3" />
        <p className="text-sm font-medium text-slate-500">Loading admin command center...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* Top Banner */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-health-400 bg-health-950/60 px-3 py-1 rounded-full border border-health-800">
            System Administration
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-2">
            Admin Command Center
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time occupational health surveillance, farmer directory management, and educational database administration.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-slate-300">Live Surveillance Active</span>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Total Farmers */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Total Farmers</span>
            <div className="w-8 h-8 rounded-xl bg-agri-50 text-agri-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{stats?.totalFarmers ?? 0}</div>
          <p className="text-[11px] text-slate-500">Registered agricultural users</p>
        </div>

        {/* Total Assessments */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Assessments</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ClipboardList className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{stats?.totalAssessments ?? 0}</div>
          <p className="text-[11px] text-slate-500">Evaluated exposure reports</p>
        </div>

        {/* High Risk Flags */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-red-500 uppercase">High Risk Cases</span>
            <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-red-600">{stats?.highRiskAssessments ?? 0}</div>
          <p className="text-[11px] text-red-500 font-medium">Critical hazard alerts flagged</p>
        </div>

        {/* Average Safety Score */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Avg Safety Index</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{stats?.averageSafetyScore ?? 80} / 100</div>
          <p className="text-[11px] text-slate-500">Across all farm activities</p>
        </div>

      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Link
          to="/admin/farmers"
          className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-health-500 hover:shadow-sm transition flex items-center justify-between"
        >
          <div className="flex items-center space-x-3">
            <Users className="w-5 h-5 text-health-600" />
            <span className="text-xs font-bold text-slate-800">Manage Farmers</span>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400" />
        </Link>

        <Link
          to="/admin/assessments"
          className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-health-500 hover:shadow-sm transition flex items-center justify-between"
        >
          <div className="flex items-center space-x-3">
            <ClipboardList className="w-5 h-5 text-health-600" />
            <span className="text-xs font-bold text-slate-800">Audit Assessments</span>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400" />
        </Link>

        <Link
          to="/admin/articles"
          className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-health-500 hover:shadow-sm transition flex items-center justify-between"
        >
          <div className="flex items-center space-x-3">
            <BookOpen className="w-5 h-5 text-health-600" />
            <span className="text-xs font-bold text-slate-800">Knowledge Articles</span>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400" />
        </Link>

        <Link
          to="/admin/chemicals"
          className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-health-500 hover:shadow-sm transition flex items-center justify-between"
        >
          <div className="flex items-center space-x-3">
            <FlaskConical className="w-5 h-5 text-health-600" />
            <span className="text-xs font-bold text-slate-800">Chemical Database</span>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400" />
        </Link>
      </div>

      {/* Recent Health Assessments Live Feed */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Exposure Audit Feed</h2>
            <p className="text-xs text-slate-500">Live incoming assessments from active farmers.</p>
          </div>
          <Link
            to="/admin/assessments"
            className="text-xs font-bold text-health-600 hover:underline"
          >
            View All Assessments →
          </Link>
        </div>

        {recentAssessments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase">
                  <th className="pb-3">Farmer</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Activity</th>
                  <th className="pb-3">Chemical</th>
                  <th className="pb-3 text-center">Score</th>
                  <th className="pb-3 text-center">Risk</th>
                  <th className="pb-3 text-right">Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentAssessments.map((ass) => (
                  <tr key={ass.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 font-bold text-slate-900">
                      {ass.farmer?.user?.name || 'Anonymous Farmer'}
                    </td>
                    <td className="py-3 text-slate-500">
                      {new Date(ass.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 font-medium text-slate-700">
                      {ass.activityType}
                    </td>
                    <td className="py-3 text-slate-600 max-w-[130px] truncate">
                      {ass.chemicalUsed || 'None'}
                    </td>
                    <td className="py-3 text-center font-black text-slate-800">
                      {ass.safetyScore}
                    </td>
                    <td className="py-3 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          ass.riskLevel === 'HIGH'
                            ? 'bg-red-100 text-red-800'
                            : ass.riskLevel === 'MEDIUM'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-agri-100 text-agri-800'
                        }`}
                      >
                        {ass.riskLevel}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        to="/admin/assessments"
                        className="font-bold text-health-600 hover:text-health-700"
                      >
                        Inspect
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10 text-slate-400 text-xs">
            No recent assessments submitted yet.
          </div>
        )}
      </div>

    </div>
  );
}
