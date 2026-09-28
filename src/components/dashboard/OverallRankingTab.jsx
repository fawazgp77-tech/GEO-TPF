import React from 'react';
import { TrendingUp, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function OverallRankingTab() {
  const trendPoints = [
    { date: 'Jul 26', rank: 8, x: 20, y: 35 },
    { date: 'Aug 02', rank: 18, x: 75, y: 75 },
    { date: 'Aug 15', rank: 11, x: 140, y: 48 },
    { date: 'Aug 30', rank: 7, x: 200, y: 28 },
    { date: 'Sep 10', rank: 14, x: 265, y: 60 },
    { date: 'Sep 18', rank: 15, x: 320, y: 64 },
    { date: 'Sep 26', rank: 12, x: 380, y: 52 },
  ];

  const categoryRanks = [
    { category: 'Product', rank: '#8', score: 85, color: 'bg-emerald-400' },
    { category: 'Comparison', rank: '#18', score: 45, color: 'bg-amber-400' },
    { category: 'Pricing', rank: '#11', score: 72, color: 'bg-emerald-400' },
    { category: 'Best-For', rank: '#7', score: 88, color: 'bg-emerald-400' },
    { category: 'Recommendation', rank: '#14', score: 62, color: 'bg-slate-400' },
  ];

  const metrics = [
    { label: 'AI MENTION RATE', value: '67%', delta: '+4.2%', sub: null },
    { label: 'CITATION RATE', value: '43%', delta: '+1.8%', sub: null },
    { label: 'CITATION SHARE', value: '18.2%', delta: '+0.5%', sub: null },
    { label: 'AI SHARE OF VOICE', value: '22%', delta: null, sub: 'Comp. view: 18%' },
    { label: 'RECOMMENDATION RATE', value: '54%', delta: '+3.0%', sub: null },
    { label: 'PAGE CITATION RATE', value: '31%', delta: '+2.4%', sub: null },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Title & Subtitle */}
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Overall AI Visibility
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 font-light mt-1">
          Comprehensive evaluation of search generative engine index presence and positional strength.
        </p>
      </div>

      {/* Top 2 Placement & Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Placement */}
        <div className="bg-[#0b0f17] border border-white/[0.08] rounded-xl p-5 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-tech-mono uppercase tracking-widest text-slate-400 mb-1">
              GLOBAL GEO PLACEMENT
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-tech-mono font-bold text-white tracking-tight">
                #12
              </span>
              <span className="text-xs font-tech-mono text-slate-400">
                of 250 brands
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-tech-mono font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+3 positions</span>
          </div>
        </div>

        {/* Card 2: Overall GEO Score */}
        <div className="bg-[#0b0f17] border border-white/[0.08] rounded-xl p-5 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-tech-mono uppercase tracking-widest text-slate-400 mb-1">
              OVERALL GEO SCORE
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-tech-mono font-bold text-emerald-400 tracking-tight">
                78
              </span>
              <span className="text-xs font-tech-mono text-slate-500">
                / 100
              </span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-emerald-500/30 border-t-emerald-400 flex items-center justify-center font-tech-mono text-xs font-bold text-emerald-400">
            78%
          </div>
        </div>
      </div>

      {/* Two Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Chart: Ranking Trend (90 Days) */}
        <div className="lg:col-span-7 bg-[#0b0f17] border border-white/[0.08] rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xs font-tech-mono uppercase tracking-wider text-slate-300 font-semibold">
                RANKING ACROSS ALL PROMPTS
              </div>
              <div className="text-[10px] font-tech-mono text-slate-500 mt-0.5">
                RANKING TREND (90 DAYS)
              </div>
            </div>
            <span className="text-xs font-tech-mono text-emerald-400 font-medium">
              Current: #12
            </span>
          </div>

          {/* SVG Trend Graph */}
          <div className="h-48 w-full relative pt-2">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 400 120" preserveAspectRatio="none">
              <defs>
                <linearGradient id="rankingTrendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="20" x2="400" y2="20" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
              <line x1="0" y1="60" x2="400" y2="60" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
              <line x1="0" y1="100" x2="400" y2="100" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />

              {/* Fill Area */}
              <path
                d="M 20 35 Q 50 65 75 75 T 140 48 T 200 28 T 265 60 T 320 64 T 380 52 L 380 120 L 20 120 Z"
                fill="url(#rankingTrendGradient)"
              />

              {/* Spline Line */}
              <path
                d="M 20 35 Q 50 65 75 75 T 140 48 T 200 28 T 265 60 T 320 64 T 380 52"
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
              />

              {/* Dots and Labels */}
              {trendPoints.map((pt, idx) => (
                <g key={idx}>
                  <circle cx={pt.x} cy={pt.y} r="4" fill="#10b981" className="cursor-pointer" />
                  <circle cx={pt.x} cy={pt.y} r="8" fill="#10b981" opacity="0.25" />
                  <text
                    x={pt.x}
                    y={pt.y - 10}
                    textAnchor="middle"
                    fill="#a7f3d0"
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    #{pt.rank}
                  </text>
                  <text
                    x={pt.x}
                    y={115}
                    textAnchor="middle"
                    fill="#64748b"
                    fontSize="8.5"
                    fontFamily="monospace"
                  >
                    {pt.date}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Right Chart: Rank Comparison by Prompt Category */}
        <div className="lg:col-span-5 bg-[#0b0f17] border border-white/[0.08] rounded-xl p-5 flex flex-col justify-between">
          <div className="text-xs font-tech-mono uppercase tracking-wider text-slate-300 font-semibold mb-4">
            RANK COMPARISON BY PROMPT CATEGORY
          </div>

          <div className="space-y-3.5">
            {categoryRanks.map((item) => (
              <div key={item.category}>
                <div className="flex items-center justify-between text-xs font-tech-mono mb-1">
                  <span className="text-slate-300">{item.category}</span>
                  <span className="text-emerald-400 font-bold">{item.rank}</span>
                </div>
                <div className="h-2 w-full bg-[#06080e] rounded-full overflow-hidden border border-white/[0.05]">
                  <div
                    className={`h-full ${item.color} rounded-full`}
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 mt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-tech-mono text-slate-500">
            <span>Benchmark: Sector Top 20</span>
            <span className="text-emerald-400">4 Categories Leading</span>
          </div>
        </div>

      </div>

      {/* 6 Metric Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {metrics.map((m, idx) => (
          <div key={idx} className="bg-[#0b0f17] border border-white/[0.08] rounded-xl p-3.5 flex flex-col justify-between">
            <div className="text-[9px] font-tech-mono uppercase tracking-wider text-slate-500">
              {m.label}
            </div>
            <div className="text-xl font-tech-mono font-bold text-white my-1">
              {m.value}
            </div>
            <div className="text-[10px] font-tech-mono">
              {m.delta && (
                <span className="text-emerald-400 font-medium">
                  {m.delta}
                </span>
              )}
              {m.sub && (
                <span className="text-slate-500 truncate block">
                  {m.sub}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Driver Cards: What's Driving Your GEO Performance? */}
      <div className="bg-[#0b0f17] border border-white/[0.08] rounded-xl p-6">
        <h3 className="text-sm font-tech-mono uppercase tracking-wider text-white font-semibold mb-4">
          What's Driving Your GEO Performance?
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Performance Drivers */}
          <div className="space-y-3 bg-[#070a10] border border-emerald-500/20 rounded-lg p-4">
            <div className="flex items-center gap-2 text-xs font-tech-mono font-bold text-emerald-400 uppercase tracking-wide">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>PERFORMANCE DRIVERS</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300 font-light leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>Frequently mentioned in product-specific queries.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>Strong citation presence across academic benchmark datasets.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>High recommendation rate in premium best-of categories.</span>
              </li>
            </ul>
          </div>

          {/* Optimization Required */}
          <div className="space-y-3 bg-[#070a10] border border-amber-500/20 rounded-lg p-4">
            <div className="flex items-center gap-2 text-xs font-tech-mono font-bold text-amber-400 uppercase tracking-wide">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>OPTIMIZATION REQUIRED</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300 font-light leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span>Weak visibility in direct competitor comparison queries.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span>Top competitors receive 12% more contextual citations.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span>Low presence in broad informational/problem-solving queries.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
}
