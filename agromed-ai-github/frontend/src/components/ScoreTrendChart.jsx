import React from 'react';

export default function ScoreTrendChart({ assessments = [] }) {
  if (!assessments || assessments.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center bg-slate-50 border border-slate-200 border-dashed rounded-xl text-slate-400 text-sm">
        No assessment history recorded yet.
      </div>
    );
  }

  // Reverse chronological to chronological for graph (oldest -> newest)
  const sorted = [...assessments].reverse();
  const scores = sorted.map(a => a.safetyScore);
  const labels = sorted.map(a => new Date(a.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }));

  const maxScore = 100;
  const height = 160;
  const width = 500;
  const paddingX = 40;
  const paddingY = 25;

  const chartWidth = width - (paddingX * 2);
  const chartHeight = height - (paddingY * 2);

  // Compute SVG coordinates
  const points = scores.map((score, index) => {
    const x = paddingX + (index / Math.max(1, scores.length - 1)) * chartWidth;
    const y = paddingY + (1 - (score / maxScore)) * chartHeight;
    return { x, y, score, label: labels[index] };
  });

  const pathD = points.length === 1
    ? `M ${points[0].x} ${points[0].y}`
    : points.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`, '');

  // Fill area under path
  const areaD = points.length > 1
    ? `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`
    : '';

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-44 overflow-visible font-sans">
        {/* Background Grid Lines */}
        <line x1={paddingX} y1={paddingY} x2={width - paddingX} y2={paddingY} stroke="#e2e8f0" strokeDasharray="3 3" />
        <text x={paddingX - 8} y={paddingY + 3} textAnchor="end" className="text-[9px] fill-slate-400 font-medium">100</text>

        <line x1={paddingX} y1={paddingY + chartHeight * 0.5} x2={width - paddingX} y2={paddingY + chartHeight * 0.5} stroke="#e2e8f0" strokeDasharray="3 3" />
        <text x={paddingX - 8} y={paddingY + chartHeight * 0.5 + 3} textAnchor="end" className="text-[9px] fill-slate-400 font-medium">50</text>

        <line x1={paddingX} y1={height - paddingY} x2={width - paddingX} y2={height - paddingY} stroke="#cbd5e1" />
        <text x={paddingX - 8} y={height - paddingY + 3} textAnchor="end" className="text-[9px] fill-slate-400 font-medium">0</text>

        {/* Gradient fill */}
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Area fill */}
        {areaD && <path d={areaD} fill="url(#scoreGradient)" />}

        {/* Line */}
        <path d={pathD} fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

        {/* Points & Value labels */}
        {points.map((pt, i) => (
          <g key={i}>
            <circle cx={pt.x} cy={pt.y} r="5" fill="#ffffff" stroke="#16a34a" strokeWidth="2.5" />
            <text
              x={pt.x}
              y={pt.y - 8}
              textAnchor="middle"
              className="text-[10px] font-bold fill-slate-700"
            >
              {pt.score}
            </text>
            <text
              x={pt.x}
              y={height - paddingY + 15}
              textAnchor="middle"
              className="text-[9px] font-semibold fill-slate-500"
            >
              {pt.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
