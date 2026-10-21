import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import RiskMeter from '../components/RiskMeter';
import ScoreTrendChart from '../components/ScoreTrendChart';
import {
  Activity,
  Lightbulb,
  ShieldCheck,
  Bot,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Calendar,
  Clock,
  CheckCircle,
  TrendingUp,
  Droplets,
  AlertTriangle,
  Loader2
} from 'lucide-react';

const DAILY_SAFETY_TIPS = [
  "Always wash your hands and arms thoroughly with clean water and soap immediately after handling pesticides.",
  "Take proactive hydration breaks: drink at least one cup of clean water every 20 minutes under intense farm heat.",
  "Never mix or pour chemical concentrates indoors or against the direction of natural wind breeze.",
  "Wash your pesticide spraying clothes separately from your family's daily laundry.",
  "Triple-rinse empty chemical containers into the sprayer tank before properly puncturing and disposing of them."
];

export default function FarmerDashboard() {
  const { user, farmerProfile, workProfile, refreshProfile } = useAuth();
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTipIndex, setActiveTipIndex] = useState(0);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const res = await api.get('/health-assessment');
        if (res.data.success) {
          setAssessments(res.data.assessments);
        }
      } catch (err) {
        console.error('Failed to load dashboard assessments:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
    refreshProfile();
  }, []);

  const latestAssessment = assessments[0] || null;
  const currentSafetyScore = latestAssessment ? latestAssessment.safetyScore : 85;
  const currentRiskLevel = latestAssessment ? latestAssessment.riskLevel : 'LOW';

  // Profile completion indicator logic
  const hasPersonal = Boolean(farmerProfile?.age && farmerProfile?.village && farmerProfile?.state);
  const hasWork = Boolean(workProfile?.cropName);
  let completionPercent = 0;
  if (hasPersonal && hasWork) completionPercent = 100;
  else if (hasPersonal || hasWork) completionPercent = 60;
  else completionPercent = 25;

  let missingStep = '';
  if (!hasPersonal) missingStep = 'Personal Profile Details';
  else if (!hasWork) missingStep = 'Farming Work & Chemical Profile';

  // Feedback message based on score
  let safetyMessage = 'Your safety practices are good, but improving PPE usage can further reduce your occupational health risks.';
  if (currentSafetyScore < 50 || currentRiskLevel === 'HIGH') {
    safetyMessage = 'High occupational hazard detected in your recent activity. Review immediate safety precautions and discontinue direct exposure.';
  } else if (currentSafetyScore >= 80) {
    safetyMessage = 'Excellent adherence to farm safety protocols. Continue maintaining proper protective equipment and scheduled hydration.';
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Loader2 className="w-10 h-10 text-agri-600 animate-spin mb-3" />
        <p className="text-sm font-medium text-slate-500">Loading farmer dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* 1. WELCOME BANNER */}
      <div className="rounded-3xl bg-gradient-to-r from-agri-700 via-agri-800 to-health-900 text-white p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-agri-300">
            Occupational Health Command Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-1">
            Welcome back, {user?.name || 'Farmer'}
          </h1>
          <p className="text-sm text-slate-200 mt-2 max-w-2xl leading-relaxed">
            {safetyMessage}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link
              to="/assessment"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-white text-agri-800 font-bold text-xs sm:text-sm hover:bg-slate-100 transition shadow"
            >
              <Activity className="w-4 h-4 text-agri-600" />
              <span>Take Health Assessment</span>
            </Link>
            <Link
              to="/chatbot"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-agri-600/80 hover:bg-agri-600 text-white font-semibold text-xs sm:text-sm border border-agri-400/40 transition"
            >
              <Bot className="w-4 h-4" />
              <span>Ask AgroMed AI</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. PROFILE COMPLETION BANNER (If incomplete) */}
      {completionPercent < 100 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                Profile Incomplete ({completionPercent}%)
              </span>
            </div>
            <p className="text-xs text-amber-800">
              Missing: <span className="font-bold">{missingStep}</span>. Complete your profile for 100% accurate health and PPE recommendations.
            </p>
          </div>
          <Link
            to={!hasPersonal ? '/profile' : '/work-profile'}
            className="shrink-0 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition shadow-sm"
          >
            Complete Now
          </Link>
        </div>
      )}

      {/* 3. CORE METRICS & RECENT ASSESSMENT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Safety Score Meter */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-2">
            Current Safety Status
          </h3>
          <RiskMeter score={currentSafetyScore} riskLevel={currentRiskLevel} />
          <p className="text-xs text-slate-500 mt-4 leading-relaxed">
            Calculated from chemical toxicity, exposure length, reported symptoms, and PPE coverage.
          </p>
        </div>

        {/* Latest Health Assessment Summary */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                Latest Assessment
              </h3>
              {latestAssessment && (
                <span className="text-[11px] font-semibold text-slate-400 flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(latestAssessment.createdAt).toLocaleDateString()}</span>
                </span>
              )}
            </div>

            {latestAssessment ? (
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-[11px] font-medium text-slate-400 uppercase">Activity & Chemical</p>
                  <p className="text-sm font-bold text-slate-800">{latestAssessment.activityType}</p>
                  <p className="text-xs text-slate-600 mt-0.5 truncate">{latestAssessment.chemicalUsed || 'General farm work'}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block text-[10px] font-semibold">DURATION</span>
                    <span className="font-bold text-slate-700">{latestAssessment.exposureDuration}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block text-[10px] font-semibold">RISK LEVEL</span>
                    <span className={`font-black ${latestAssessment.riskLevel === 'HIGH' ? 'text-red-600' : latestAssessment.riskLevel === 'MEDIUM' ? 'text-amber-600' : 'text-agri-600'}`}>
                      {latestAssessment.riskLevel}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-slate-400 text-xs">
                No health assessment taken yet.
              </div>
            )}
          </div>

          <Link
            to={latestAssessment ? `/assessment/result/${latestAssessment.id}` : '/assessment'}
            className="mt-4 inline-flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-xs font-bold transition"
          >
            <span>{latestAssessment ? 'View Assessment Breakdown' : 'Start First Assessment'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Daily Safety Tip Card */}
        <div className="bg-gradient-to-br from-agri-50 to-health-50 rounded-3xl p-6 border border-agri-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-agri-800 mb-3">
              <Sparkles className="w-4 h-4 text-agri-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider">
                Farmer Safety Tip #{activeTipIndex + 1}
              </h3>
            </div>
            <p className="text-sm text-slate-700 font-medium leading-relaxed mt-2">
              "{DAILY_SAFETY_TIPS[activeTipIndex]}"
            </p>
          </div>

          <div className="mt-6 flex items-center justify-between pt-4 border-t border-agri-200/60">
            <button
              onClick={() => setActiveTipIndex((prev) => (prev + 1) % DAILY_SAFETY_TIPS.length)}
              className="text-xs font-bold text-agri-700 hover:text-agri-900 transition"
            >
              Next Safety Tip →
            </button>
            <span className="text-[10px] text-slate-400">
              {activeTipIndex + 1} of {DAILY_SAFETY_TIPS.length}
            </span>
          </div>
        </div>

      </div>

      {/* 4. QUICK ACTIONS GRID */}
      <div>
        <h2 className="text-base font-bold text-slate-800 mb-3">Quick Safety Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          
          <Link
            to="/assessment"
            className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 hover:border-agri-500 hover:shadow-md transition text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-agri-50 text-agri-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Activity className="w-5 h-5" />
            </div>
            <p className="text-sm font-bold text-slate-900">Take Assessment</p>
            <p className="text-xs text-slate-500 mt-1">Check today's exposure risk</p>
          </Link>

          <Link
            to="/recommendations"
            className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 hover:border-health-500 hover:shadow-md transition text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-health-50 text-health-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Lightbulb className="w-5 h-5" />
            </div>
            <p className="text-sm font-bold text-slate-900">Safety Tips</p>
            <p className="text-xs text-slate-500 mt-1">Personalized precautions</p>
          </Link>

          <Link
            to="/ppe-guide"
            className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 hover:border-amber-500 hover:shadow-md transition text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <p className="text-sm font-bold text-slate-900">PPE Guide</p>
            <p className="text-xs text-slate-500 mt-1">Check gear & missing items</p>
          </Link>

          <Link
            to="/chatbot"
            className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 hover:border-purple-500 hover:shadow-md transition text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Bot className="w-5 h-5" />
            </div>
            <p className="text-sm font-bold text-slate-900">Ask AgroMed AI</p>
            <p className="text-xs text-slate-500 mt-1">Instant safety answers</p>
          </Link>

        </div>
      </div>

      {/* 5. SCORE TREND & RECENT ASSESSMENTS TABLE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Safety Score Timeline */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm lg:col-span-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-800">Safety Score Trend</h3>
              <span className="text-xs text-agri-700 font-semibold flex items-center space-x-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>History</span>
              </span>
            </div>
            <ScoreTrendChart assessments={assessments} />
          </div>
          <Link
            to="/history"
            className="text-xs font-bold text-agri-700 hover:text-agri-900 mt-4 inline-flex items-center space-x-1"
          >
            <span>View complete history table</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Latest 5 Assessments Table */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-800">Recent Health Assessments</h3>
            <Link to="/assessment" className="text-xs font-bold text-agri-700 hover:underline">
              + New Assessment
            </Link>
          </div>

          {assessments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase">
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Activity</th>
                    <th className="pb-3">Chemical</th>
                    <th className="pb-3 text-center">Score</th>
                    <th className="pb-3 text-center">Risk</th>
                    <th className="pb-3 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {assessments.slice(0, 5).map((ass) => (
                    <tr key={ass.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 font-medium text-slate-700">
                        {new Date(ass.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 font-bold text-slate-800">
                        {ass.activityType}
                      </td>
                      <td className="py-3 text-slate-600 max-w-[120px] truncate">
                        {ass.chemicalUsed || 'None reported'}
                      </td>
                      <td className="py-3 text-center font-bold text-slate-800">
                        {ass.safetyScore} / 100
                      </td>
                      <td className="py-3 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
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
                          to={`/assessment/result/${ass.id}`}
                          className="font-bold text-agri-700 hover:text-agri-900"
                        >
                          View →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">
              No health assessments recorded yet. Click "Take Health Assessment" above to record your first one!
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
