import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import api from '../services/api';
import RiskMeter from '../components/RiskMeter';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  Bot,
  ArrowRight,
  Printer,
  Calendar,
  Clock,
  Loader2,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export default function AssessmentResultPage() {
  const { id } = useParams();
  const location = useLocation();

  const [assessment, setAssessment] = useState(location.state?.result || null);
  const [loading, setLoading] = useState(!location.state?.result);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!assessment && id) {
      async function fetchAssessment() {
        try {
          const res = await api.get(`/health-assessment/${id}`);
          if (res.data.success) {
            setAssessment(res.data.assessment);
          } else {
            setError(res.data.message || 'Assessment record not found.');
          }
        } catch (err) {
          setError('Failed to load assessment results.');
        } finally {
          setLoading(false);
        }
      }
      fetchAssessment();
    }
  }, [id, assessment]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Loader2 className="w-10 h-10 text-agri-600 animate-spin mb-3" />
        <p className="text-sm font-medium text-slate-500">Retrieving safety score evaluation...</p>
      </div>
    );
  }

  if (error || !assessment) {
    return (
      <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-4 max-w-lg mx-auto">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-lg font-bold text-slate-800">Result Not Found</h2>
        <p className="text-xs text-slate-500">{error || 'Could not locate assessment record.'}</p>
        <Link to="/assessment" className="inline-block px-5 py-2.5 rounded-xl bg-agri-600 text-white text-xs font-bold">
          Take New Assessment
        </Link>
      </div>
    );
  }

  const isHighRisk = assessment.riskLevel === 'HIGH';
  const isMediumRisk = assessment.riskLevel === 'MEDIUM';

  const riskFactors = assessment.identifiedRiskFactors || [];
  const precautions = assessment.immediatePrecautions || [];
  const recommendations = assessment.recommendations || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* 1. TOP RESULT HEADER & SCORE METER */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-agri-700 bg-agri-100 px-3 py-1 rounded-full">
              Assessment Evaluation
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              Occupational Risk Assessment Report
            </h1>
            <p className="text-xs text-slate-500 mt-1 flex items-center space-x-2">
              <Calendar className="w-3.5 h-3.5 inline" />
              <span>Conducted on {new Date(assessment.createdAt).toLocaleString()}</span>
            </p>
          </div>

          <button
            onClick={() => window.print()}
            className="hidden sm:inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        </div>

        {/* Core Meter Component */}
        <RiskMeter score={assessment.safetyScore} riskLevel={assessment.riskLevel} />
      </div>

      {/* 2. PROMINENT HIGH RISK WARNING (If High Risk) */}
      {isHighRisk && (
        <div className="rounded-3xl bg-red-600 text-white p-6 sm:p-7 shadow-lg flex items-start space-x-4">
          <AlertCircle className="w-8 h-8 text-white shrink-0 mt-1 animate-pulse" />
          <div className="space-y-2">
            <h2 className="text-lg font-black tracking-wide">
              CRITICAL HEALTH & SAFETY ADVISORY
            </h2>
            <p className="text-sm text-red-50 leading-relaxed font-medium">
              Your reported symptoms may indicate a significant health or chemical exposure risk. Stop the activity immediately, move to fresh open air, and seek professional medical assistance or visit a primary healthcare clinic if symptoms are severe, worsening, or persistent.
            </p>
            <div className="pt-2">
              <span className="inline-block px-3 py-1 bg-white text-red-700 font-extrabold text-xs rounded-full shadow">
                Emergency Medical Helpline: Dial 108 / 112
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 3. TASK CONTEXT SUMMARY */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
          <span className="text-slate-400 font-bold block mb-0.5">ACTIVITY</span>
          <span className="text-sm font-bold text-slate-800">{assessment.activityType}</span>
        </div>
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
          <span className="text-slate-400 font-bold block mb-0.5">CHEMICAL</span>
          <span className="text-sm font-bold text-slate-800 truncate block">
            {assessment.chemicalUsed || 'None specified'}
          </span>
        </div>
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
          <span className="text-slate-400 font-bold block mb-0.5">EXPOSURE TIME</span>
          <span className="text-sm font-bold text-slate-800">{assessment.exposureDuration}</span>
        </div>
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
          <span className="text-slate-400 font-bold block mb-0.5">PPE WORN</span>
          <span className="text-sm font-bold text-slate-800 truncate block">
            {assessment.ppeUsed?.join(', ') || 'None'}
          </span>
        </div>
      </div>

      {/* 4. IDENTIFIED RISK FACTORS */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center space-x-2.5 pb-2 border-b border-slate-100">
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Identified Risk Factors</h2>
        </div>

        {riskFactors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {riskFactors.map((factor, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 text-xs font-semibold text-amber-900 flex items-start space-x-2.5"
              >
                <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <span>{factor}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">No high hazard risk factors identified for this activity.</p>
        )}
      </div>

      {/* 5. IMMEDIATE PRECAUTIONS */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center space-x-2.5 pb-2 border-b border-slate-100">
          <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Immediate Precautions</h2>
        </div>

        <div className="space-y-2.5">
          {precautions.map((prec, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start space-x-3"
            >
              <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span className="font-semibold">{prec}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 6. PERSONALIZED RECOMMENDATIONS */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center space-x-2.5 pb-2 border-b border-slate-100">
          <div className="w-8 h-8 rounded-xl bg-agri-50 text-agri-600 flex items-center justify-center">
            <Lightbulb className="w-4 h-4" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Safety Recommendations</h2>
        </div>

        <div className="space-y-2.5">
          {recommendations.map((rec, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-agri-50/50 border border-agri-200/70 text-xs text-agri-950 flex items-start space-x-3"
            >
              <ShieldCheck className="w-4 h-4 text-agri-600 shrink-0 mt-0.5" />
              <span className="font-medium leading-relaxed">{rec}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 7. MEDICAL DISCLAIMER BANNER */}
      <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-500 leading-relaxed text-center">
        <span className="font-bold text-slate-700">Medical Awareness Notice: </span>
        AgroMed AI provides health and safety awareness information and is not a medical diagnosis system. If symptoms worsen, consult a qualified physician or agricultural occupational health officer immediately.
      </div>

      {/* 8. NEXT ACTION BUTTONS */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <Link
          to="/assessment"
          className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition text-center"
        >
          ← Take Another Assessment
        </Link>
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <Link
            to="/chatbot"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow transition text-center"
          >
            <Bot className="w-4 h-4" />
            <span>Ask AI About Symptoms</span>
          </Link>
          <Link
            to="/recommendations"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-agri-600 hover:bg-agri-700 text-white font-bold text-xs shadow-md shadow-agri-600/30 transition text-center"
          >
            <span>View All Recommendations</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

    </div>
  );
}
