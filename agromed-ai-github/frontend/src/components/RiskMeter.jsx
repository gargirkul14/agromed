import React from 'react';
import { ShieldCheck, AlertTriangle, AlertCircle } from 'lucide-react';

export default function RiskMeter({ score = 75, riskLevel = 'LOW' }) {
  let color = 'text-green-600 bg-green-50 border-green-200';
  let badgeColor = 'bg-green-100 text-green-800 border-green-300';
  let barColor = 'bg-green-600';
  let statusText = 'Good Safety Level';
  let Icon = ShieldCheck;

  if (riskLevel === 'HIGH' || score <= 39) {
    color = 'text-red-600 bg-red-50 border-red-200';
    badgeColor = 'bg-red-100 text-red-800 border-red-300';
    barColor = 'bg-red-600';
    statusText = 'High Hazard Alert';
    Icon = AlertCircle;
  } else if (riskLevel === 'MEDIUM' || score <= 74) {
    color = 'text-amber-600 bg-amber-50 border-amber-200';
    badgeColor = 'bg-amber-100 text-amber-800 border-amber-300';
    barColor = 'bg-amber-500';
    statusText = 'Moderate Risk - Needs Improvement';
    Icon = AlertTriangle;
  }

  return (
    <div className={`rounded-2xl border p-5 ${color} transition-all`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Icon className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Health Safety Index</span>
        </div>
        <span className={`text-xs font-black uppercase px-2.5 py-0.5 rounded-full border ${badgeColor}`}>
          {riskLevel} RISK
        </span>
      </div>

      <div className="flex items-baseline space-x-2 my-2">
        <span className="text-4xl sm:text-5xl font-black tracking-tight">{score}</span>
        <span className="text-sm font-semibold opacity-70">/ 100</span>
        <span className="text-xs font-bold ml-auto opacity-90">{statusText}</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200/80 h-2.5 rounded-full overflow-hidden mt-3">
        <div
          className={`h-full ${barColor} rounded-full transition-all duration-700`}
          style={{ width: `${Math.max(5, Math.min(100, score))}%` }}
        />
      </div>

      <div className="flex justify-between text-[10px] font-semibold opacity-60 mt-1.5">
        <span>0 (Critical Risk)</span>
        <span>50 (Moderate)</span>
        <span>100 (Optimal Safety)</span>
      </div>
    </div>
  );
}
