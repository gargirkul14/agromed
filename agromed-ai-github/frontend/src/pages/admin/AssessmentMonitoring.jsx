import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Modal from '../../components/Modal';
import {
  ClipboardList,
  Filter,
  Eye,
  AlertCircle,
  ShieldCheck,
  Calendar,
  Loader2,
  Clock,
  User
} from 'lucide-react';

export default function AssessmentMonitoring() {
  const [assessments, setAssessments] = useState([]);
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [selectedAssessment, setSelectedAssessment] = useState(null);

  useEffect(() => {
    async function fetchAssessments() {
      setLoading(true);
      try {
        const query = riskFilter !== 'ALL' ? `?riskLevel=${riskFilter}` : '';
        const res = await api.get(`/admin/assessments${query}`);
        if (res.data.success) {
          setAssessments(res.data.assessments || []);
        }
      } catch (err) {
        console.error('Failed to load assessments:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchAssessments();
  }, [riskFilter]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-health-700 bg-health-100 px-3 py-1 rounded-full">
            Surveillance & Audit
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            Health Assessment Auditing
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time feed of farmer exposure submissions, symptom occurrences, and high hazard alerts.
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center space-x-2 shrink-0">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-health-500"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="HIGH">High Risk Cases Only</option>
            <option value="MEDIUM">Medium Risk</option>
            <option value="LOW">Low Risk</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-health-600 animate-spin mb-2" />
            <p className="text-xs font-medium text-slate-500">Querying assessment reports...</p>
          </div>
        ) : assessments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6">Farmer</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6">Activity Type</th>
                  <th className="py-4 px-6">Chemical Used</th>
                  <th className="py-4 px-6">Reported Symptoms</th>
                  <th className="py-4 px-6 text-center">Score</th>
                  <th className="py-4 px-6 text-center">Risk Level</th>
                  <th className="py-4 px-6 text-right">Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {assessments.map((ass) => (
                  <tr key={ass.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900">{ass.farmer?.user?.name || 'Anonymous Farmer'}</div>
                      <div className="text-[11px] text-slate-400">{ass.farmer?.user?.email}</div>
                    </td>
                    <td className="py-4 px-6 text-slate-500 whitespace-nowrap">
                      {new Date(ass.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-800">
                      {ass.activityType}
                    </td>
                    <td className="py-4 px-6 text-slate-600 max-w-[130px] truncate">
                      {ass.chemicalUsed || 'None'}
                    </td>
                    <td className="py-4 px-6 text-slate-600 max-w-[140px] truncate">
                      {ass.symptoms?.join(', ') || 'No symptoms'}
                    </td>
                    <td className="py-4 px-6 text-center font-black text-slate-900 text-sm">
                      {ass.safetyScore}
                    </td>
                    <td className="py-4 px-6 text-center">
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
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => setSelectedAssessment(ass)}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-400 text-xs">
            No assessment records found matching this filter.
          </div>
        )}
      </div>

      {/* Assessment Inspection Modal */}
      {selectedAssessment && (
        <Modal
          isOpen={Boolean(selectedAssessment)}
          onClose={() => setSelectedAssessment(null)}
          title={`Assessment Audit: ${selectedAssessment.farmer?.user?.name || 'Farmer Record'}`}
        >
          <div className="space-y-5 text-xs sm:text-sm">
            
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div>
                <span className="text-slate-400 text-[10px] font-bold uppercase block">HEALTH SAFETY SCORE</span>
                <span className="text-2xl font-black text-slate-900">{selectedAssessment.safetyScore} / 100</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                selectedAssessment.riskLevel === 'HIGH' ? 'bg-red-100 text-red-800' : selectedAssessment.riskLevel === 'MEDIUM' ? 'bg-amber-100 text-amber-800' : 'bg-agri-100 text-agri-800'
              }`}>
                {selectedAssessment.riskLevel} RISK
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[10px] font-bold">ACTIVITY TYPE</span>
                <span className="font-bold text-slate-800">{selectedAssessment.activityType}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[10px] font-bold">CHEMICAL</span>
                <span className="font-bold text-slate-800">{selectedAssessment.chemicalUsed || 'None'}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[10px] font-bold">EXPOSURE DURATION</span>
                <span className="font-bold text-slate-800">{selectedAssessment.exposureDuration}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[10px] font-bold">PPE GEAR WORN</span>
                <span className="font-bold text-slate-800">{selectedAssessment.ppeUsed?.join(', ') || 'None'}</span>
              </div>
            </div>

            <div>
              <span className="text-slate-500 font-bold block mb-1">Reported Symptoms:</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedAssessment.symptoms?.map((s, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-red-50 text-red-700 text-xs font-bold border border-red-200">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button
                onClick={() => setSelectedAssessment(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs"
              >
                Close Audit
              </button>
            </div>

          </div>
        </Modal>
      )}

    </div>
  );
}
