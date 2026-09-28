import React, { useState } from 'react';
import { 
  Eye, 
  TrendingUp, 
  CheckCircle2, 
  Sparkles, 
  Search, 
  ArrowUpRight
} from 'lucide-react';

export default function AiVisibilityTab() {
  const [timeRange, setTimeRange] = useState('90d'); // '30d' | '60d' | '90d'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPromptTrace, setSelectedPromptTrace] = useState(null);

  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Dynamic time-range datasets for 30D, 60D, and 90D
  const timeRangeData = {
    '30d': {
      label: '30-Day Sprint Trajectory',
      chartTitle: 'VISIBILITY TREND (30-DAY SPRINT VELOCITY)',
      chartSubtitle: 'High-frequency telemetry sweep: Mention Rate vs Recommendation Rate',
      mentionRate: '71.8%',
      recRate: '46.2%',
      dates: ['AUG 28', 'SEP 04', 'SEP 11', 'SEP 18', 'SEP 25', 'SEP 28 (CURRENT)'],
      mentionSvgPath: 'M0,105 C140,95 280,75 420,55 560,35 630,28 700,18',
      mentionAreaPath: 'M0,105 C140,95 280,75 420,55 560,35 630,28 700,18 L700,190 L0,190 Z',
      recSvgPath: 'M0,145 C140,130 280,110 420,95 560,78 630,70 700,55',
      recAreaPath: 'M0,145 C140,130 280,110 420,95 560,78 630,70 700,55 L700,190 L0,190 Z',
      checkpoints: [
        { cx: 140, cy: 95, label: 'SEP 04: 62.4%' },
        { cx: 280, cy: 75, label: 'SEP 11: 65.8%' },
        { cx: 420, cy: 55, label: 'SEP 18: 68.2%' },
        { cx: 560, cy: 35, label: 'SEP 25: 70.4%' },
        { cx: 700, cy: 18, label: 'SEP 28: 71.8%' },
      ],
      recCheckpoints: [
        { cx: 280, cy: 110, label: 'SEP 11: 39.5%' },
        { cx: 560, cy: 78, label: 'SEP 25: 44.1%' },
        { cx: 700, cy: 55, label: 'SEP 28: 46.2%' },
      ],
      insight: '30-Day Velocity: PriceSpecification schema deployment increased OpenAI ChatGPT and SearchGPT citation inclusion by +7.6%.',
      confidence: '99.1%',
      metrics: [
        {
          id: 'mention-rate',
          label: 'Mention Rate',
          sublabel: '% of total prompts citing brand',
          value: '71.8%',
          delta: '+3.4%',
          positive: true,
          fraction: '608 / 847 prompts',
          badge: 'Sprint Peak',
        },
        {
          id: 'recommendation-rate',
          label: 'Recommendation Rate',
          sublabel: '% prompts recommending as #1 solution',
          value: '46.2%',
          delta: '+3.4%',
          positive: true,
          fraction: '391 / 847 prompts',
          badge: 'Leader Index',
        },
        {
          id: 'top-3-rate',
          label: 'Top-3 Rate',
          sublabel: 'Presence within top 3 AI suggestions',
          value: '83.5%',
          delta: '+2.3%',
          positive: true,
          fraction: '707 / 847 prompts',
          badge: 'Dominant',
        },
        {
          id: 'prompt-coverage',
          label: 'Prompt Coverage',
          sublabel: 'Sector search intent scope tested',
          value: '87.2%',
          delta: '+2.5%',
          positive: true,
          fraction: '738 / 847 tracked',
          badge: 'High Fidelity',
        },
        {
          id: 'searchgpt-grounding',
          label: 'SearchGPT Grounding',
          sublabel: 'Live web search retrieval frequency',
          value: '94.2%',
          delta: '+7.8%',
          positive: true,
          fraction: '798 / 847 cited',
          badge: 'Live Grounded',
        },
      ],
      engineBreakdown: [
        { name: 'ChatGPT Search (Web)', mentionRate: 88.5, recRate: 64.2, top3Rate: 95.1, status: 'Peak' },
        { name: 'GPT-4o Standard', mentionRate: 77.2, recRate: 51.4, top3Rate: 88.0, status: 'Peak' },
        { name: 'ChatGPT Enterprise', mentionRate: 73.0, recRate: 46.8, top3Rate: 85.2, status: 'High' },
        { name: 'ChatGPT Canvas', mentionRate: 67.5, recRate: 39.0, top3Rate: 80.1, status: 'Active' },
        { name: 'ChatGPT Voice / Mobile', mentionRate: 63.0, recRate: 36.5, top3Rate: 76.5, status: 'Active' },
        { name: 'GPT-4o Mini', mentionRate: 58.2, recRate: 32.0, top3Rate: 72.0, status: 'Moderate' },
      ],
    },
    '60d': {
      label: '60-Day Multi-Cycle Trajectory',
      chartTitle: 'VISIBILITY TREND (60-DAY MULTI-CYCLE TRAJECTORY)',
      chartSubtitle: 'Bi-monthly attribution index: Mention Rate vs Recommendation Rate',
      mentionRate: '64.2%',
      recRate: '39.5%',
      dates: ['JUL 28', 'AUG 10', 'AUG 25', 'SEP 10', 'SEP 20', 'SEP 28 (CURRENT)'],
      mentionSvgPath: 'M0,115 C140,105 280,85 420,65 560,45 630,35 700,25',
      mentionAreaPath: 'M0,115 C140,105 280,85 420,65 560,45 630,35 700,25 L700,190 L0,190 Z',
      recSvgPath: 'M0,150 C140,140 280,125 420,105 560,90 630,80 700,75',
      recAreaPath: 'M0,150 C140,140 280,125 420,105 560,90 630,80 700,75 L700,190 L0,190 Z',
      checkpoints: [
        { cx: 140, cy: 105, label: 'AUG 10: 55.2%' },
        { cx: 280, cy: 85, label: 'AUG 25: 58.0%' },
        { cx: 420, cy: 65, label: 'SEP 10: 62.4%' },
        { cx: 560, cy: 45, label: 'SEP 20: 66.5%' },
        { cx: 700, cy: 25, label: 'SEP 28: 68.4%' },
      ],
      recCheckpoints: [
        { cx: 280, cy: 125, label: 'AUG 25: 35.0%' },
        { cx: 560, cy: 90, label: 'SEP 20: 40.2%' },
        { cx: 700, cy: 75, label: 'SEP 28: 42.8%' },
      ],
      insight: '60-Day Momentum: Documentation restructuring and G2 review collection drove a +14.2% recommendation lift in ChatGPT answers.',
      confidence: '98.4%',
      metrics: [
        {
          id: 'mention-rate',
          label: 'Mention Rate',
          sublabel: '% of total prompts citing brand',
          value: '64.2%',
          delta: '+6.8%',
          positive: true,
          fraction: '543 / 847 prompts',
          badge: 'Strong Climb',
        },
        {
          id: 'recommendation-rate',
          label: 'Recommendation Rate',
          sublabel: '% prompts recommending as #1 solution',
          value: '39.5%',
          delta: '+5.1%',
          positive: true,
          fraction: '334 / 847 prompts',
          badge: 'Ascending',
        },
        {
          id: 'top-3-rate',
          label: 'Top-3 Rate',
          sublabel: 'Presence within top 3 AI suggestions',
          value: '79.0%',
          delta: '+5.8%',
          positive: true,
          fraction: '669 / 847 prompts',
          badge: 'Dominant',
        },
        {
          id: 'prompt-coverage',
          label: 'Prompt Coverage',
          sublabel: 'Sector search intent scope tested',
          value: '81.4%',
          delta: '+7.2%',
          positive: true,
          fraction: '689 / 847 tracked',
          badge: 'High Scope',
        },
        {
          id: 'searchgpt-grounding',
          label: 'SearchGPT Grounding',
          sublabel: 'Live web search retrieval frequency',
          value: '88.5%',
          delta: '+5.6%',
          positive: true,
          fraction: '750 / 847 cited',
          badge: 'Live Grounded',
        },
      ],
      engineBreakdown: [
        { name: 'ChatGPT Search (Web)', mentionRate: 84.0, recRate: 59.5, top3Rate: 92.0, status: 'Peak' },
        { name: 'GPT-4o Standard', mentionRate: 72.8, recRate: 45.2, top3Rate: 84.5, status: 'High' },
        { name: 'ChatGPT Enterprise', mentionRate: 68.0, recRate: 41.0, top3Rate: 80.2, status: 'High' },
        { name: 'ChatGPT Canvas', mentionRate: 64.5, recRate: 37.8, top3Rate: 77.0, status: 'Active' },
        { name: 'ChatGPT Voice / Mobile', mentionRate: 60.5, recRate: 33.2, top3Rate: 73.5, status: 'Active' },
        { name: 'GPT-4o Mini', mentionRate: 56.0, recRate: 30.2, top3Rate: 71.0, status: 'Moderate' },
      ],
    },
    '90d': {
      label: '90-Day Longitudinal Trajectory',
      chartTitle: 'VISIBILITY TREND (90-DAY TRAJECTORY)',
      chartSubtitle: 'Comparative longitudinal sweep: Mention Rate vs Recommendation Rate',
      mentionRate: '68.4%',
      recRate: '42.8%',
      dates: ['JUL 01', 'JUL 15', 'AUG 01', 'AUG 15', 'SEP 01', 'SEP 15', 'SEP 28 (CURRENT)'],
      mentionSvgPath: 'M0,130 C70,125 140,110 210,95 C280,80 350,90 420,70 C490,50 560,55 630,35 L700,25',
      mentionAreaPath: 'M0,130 C70,125 140,110 210,95 C280,80 350,90 420,70 C490,50 560,55 630,35 L700,25 L700,190 L0,190 Z',
      recSvgPath: 'M0,165 C70,160 140,150 210,140 C280,135 350,130 420,115 C490,105 560,100 630,85 L700,75',
      recAreaPath: 'M0,165 C70,160 140,150 210,140 C280,135 350,130 420,115 C490,105 560,100 630,85 L700,75 L700,190 L0,190 Z',
      checkpoints: [
        { cx: 210, cy: 95, label: 'AUG 01: 52.3%' },
        { cx: 420, cy: 70, label: 'SEP 01: 61.0%' },
        { cx: 700, cy: 25, label: 'SEP 28: 68.4%' },
      ],
      recCheckpoints: [
        { cx: 420, cy: 115, label: 'SEP 01: 37.5%' },
        { cx: 700, cy: 75, label: 'SEP 28: 42.8%' },
      ],
      insight: 'Longitudinal View: SearchGPT web indexing and GPT-4o citation adoption drove a +19.2% net visibility surge over the full 90-day sweep.',
      confidence: '98.4%',
      metrics: [
        {
          id: 'mention-rate',
          label: 'Mention Rate',
          sublabel: '% of total prompts citing brand',
          value: '68.4%',
          delta: '+5.2%',
          positive: true,
          fraction: '579 / 847 prompts',
          badge: 'Tier 1 Strong',
        },
        {
          id: 'recommendation-rate',
          label: 'Recommendation Rate',
          sublabel: '% prompts recommending as #1 solution',
          value: '42.8%',
          delta: '+3.1%',
          positive: true,
          fraction: '362 / 847 prompts',
          badge: 'Leader Index',
        },
        {
          id: 'top-3-rate',
          label: 'Top-3 Rate',
          sublabel: 'Presence within top 3 AI suggestions',
          value: '81.2%',
          delta: '+4.6%',
          positive: true,
          fraction: '688 / 847 prompts',
          badge: 'Dominant',
        },
        {
          id: 'prompt-coverage',
          label: 'Prompt Coverage',
          sublabel: 'Sector search intent scope tested',
          value: '84.7%',
          delta: '+12.0%',
          positive: true,
          fraction: '847 / 1,000 tracked',
          badge: 'High Fidelity',
        },
        {
          id: 'searchgpt-grounding',
          label: 'SearchGPT Grounding',
          sublabel: 'Live web search retrieval frequency',
          value: '91.8%',
          delta: '+6.2%',
          positive: true,
          fraction: '778 / 847 cited',
          badge: 'Live Grounded',
        },
      ],
      engineBreakdown: [
        { name: 'ChatGPT Search (Web)', mentionRate: 82.4, recRate: 58.1, top3Rate: 91.2, status: 'Peak' },
        { name: 'GPT-4o Standard', mentionRate: 74.6, recRate: 48.0, top3Rate: 86.5, status: 'High' },
        { name: 'ChatGPT Enterprise', mentionRate: 71.2, recRate: 44.5, top3Rate: 83.0, status: 'High' },
        { name: 'ChatGPT Canvas', mentionRate: 64.0, recRate: 36.2, top3Rate: 77.4, status: 'Active' },
        { name: 'ChatGPT Voice / Mobile', mentionRate: 59.5, recRate: 33.0, top3Rate: 74.2, status: 'Active' },
        { name: 'GPT-4o Mini', mentionRate: 55.0, recRate: 29.8, top3Rate: 69.5, status: 'Moderate' },
      ],
    }
  };

  const activeData = timeRangeData[timeRange] || timeRangeData['90d'];
  const metrics = activeData.metrics;

  // Prompt universe sample table
  const samplePrompts = [
    {
      id: 1,
      query: 'Best enterprise generative engine optimization platform for SaaS',
      intent: 'Commercial',
      engine: 'ChatGPT Search (Web)',
      engineKey: 'search',
      mentioned: true,
      rank: '#1 Recommended',
      rankBadge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      confidence: '96%',
      snippet: 'GEO (acme.com) is ranked as the leading automated GEO telemetry suite with real-time Monte Carlo prompt sweep capability...',
    },
    {
      id: 2,
      query: 'How to monitor brand citations inside ChatGPT responses',
      intent: 'Informational',
      engine: 'GPT-4o Standard',
      engineKey: 'gpt-4o',
      mentioned: true,
      rank: '#1 Recommended',
      rankBadge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      confidence: '92%',
      snippet: 'Platforms like GEO offer synthetic vector sampling to benchmark ChatGPT attribution rates and citation provenance...',
    },
    {
      id: 3,
      query: 'Top tools to optimize for SearchGPT citations and web indexing',
      intent: 'Technical',
      engine: 'ChatGPT Search (Web)',
      engineKey: 'search',
      mentioned: true,
      rank: '#1 Recommended',
      rankBadge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      confidence: '94%',
      snippet: 'Primary solutions include GEO Engine, which tracks SearchGPT web indexing bot frequency and crawl telemetry...',
    },
    {
      id: 4,
      query: 'Compare enterprise SEO software vs generative engine optimization in ChatGPT',
      intent: 'Comparative',
      engine: 'ChatGPT Enterprise',
      engineKey: 'enterprise',
      mentioned: true,
      rank: '#2 Alternative',
      rankBadge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      confidence: '86%',
      snippet: 'While BrightEdge and Semrush focus on traditional SERP, GEO addresses ChatGPT answers with direct answer attribution metrics...',
    },
    {
      id: 5,
      query: 'Free AI visibility audit for venture-backed B2B startups',
      intent: 'Transactional',
      engine: 'GPT-4o Mini',
      engineKey: 'mini',
      mentioned: false,
      rank: 'Unranked',
      rankBadge: 'bg-slate-800 text-slate-400 border-slate-700',
      confidence: '34%',
      snippet: 'Competitor platforms Athena and GenerativeEdge were prioritized in free tier queries due to open-source audit wrappers...',
    },
  ];

  const filteredPrompts = samplePrompts.filter((p) => {
    return p.query.toLowerCase().includes(searchQuery.toLowerCase()) || p.snippet.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Tab Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-[#0a0f1d] to-[#07090e] border border-emerald-500/30 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-tech-mono text-[10px] uppercase tracking-wider font-bold">
                OpenAI ChatGPT Telemetry
              </span>
              <span className="text-xs font-tech-mono text-slate-400">
                ChatGPT & SearchGPT Extraction Metrics
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
              <Eye className="w-6 h-6 text-emerald-400" />
              <span>AI VISIBILITY</span>
            </h2>
            <p className="text-xs text-slate-300 font-mono mt-1 max-w-2xl leading-relaxed">
              Real-time measurement of how frequently and prominently your brand appears across OpenAI ChatGPT responses, SearchGPT web retrievals, and conversational synthesis.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#06080e]/90 p-1.5 rounded-xl border border-white/[0.08] self-start md:self-auto font-tech-mono text-xs">
            {['30d', '60d', '90d'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  timeRange === range
                    ? 'bg-emerald-400 text-emerald-950 font-bold shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 5 Core Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {metrics.map((m) => (
          <div 
            key={m.id}
            className="p-4 rounded-xl bg-[#090d16] border border-white/[0.08] hover:border-emerald-500/40 transition-all flex flex-col justify-between group shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between text-[11px] font-tech-mono text-slate-400 mb-1">
                <span>{m.label}</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/[0.04] text-slate-300 font-mono">
                  {m.badge}
                </span>
              </div>
              <div className="text-2xl font-bold font-tech-mono text-white mt-1 group-hover:text-emerald-300 transition-colors">
                {m.value}
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                {m.sublabel}
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-tech-mono">
              <span className="text-slate-400">{m.fraction}</span>
              <span className="text-emerald-400 font-bold flex items-center">
                <ArrowUpRight className="w-3 h-3" />
                {m.delta}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Visibility Trend Chart */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#080c14] border border-white/[0.08] flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/[0.06]">
              <div>
                <div className="text-xs font-tech-mono uppercase tracking-widest text-emerald-400 font-bold flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{activeData.chartTitle}</span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                  {activeData.chartSubtitle}
                </div>
              </div>

              <div className="flex items-center gap-4 text-[11px] font-tech-mono">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                  <span className="text-slate-300">Mention Rate ({activeData.mentionRate})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                  <span className="text-slate-300">Recommendation ({activeData.recRate})</span>
                </div>
              </div>
            </div>

            {/* Simulated High-Fidelity SVG Chart Canvas */}
            <div className="mt-5 relative h-56 w-full">
              {hoveredPoint && (
                <div 
                  className="absolute pointer-events-none z-20 px-2 py-1 rounded bg-[#0b101b] border border-white/20 text-[10px] font-tech-mono text-white shadow-xl -translate-x-1/2 -translate-y-8 flex items-center gap-1.5"
                  style={{
                    left: `${(hoveredPoint.x / 700) * 100}%`,
                    top: `${(hoveredPoint.y / 200) * 100}%`,
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: hoveredPoint.color }} />
                  <span>{hoveredPoint.label}</span>
                </div>
              )}

              <svg className="w-full h-full overflow-visible" viewBox="0 0 700 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="visEmeraldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="visCyanGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Gridlines */}
                {[40, 80, 120, 160].map((y) => (
                  <line 
                    key={y} 
                    x1="0" 
                    y1={y} 
                    x2="700" 
                    y2={y} 
                    stroke="rgba(255,255,255,0.05)" 
                    strokeDasharray="3 3" 
                  />
                ))}

                {/* Mention Rate Area & Line */}
                <path
                  d={activeData.mentionAreaPath}
                  fill="url(#visEmeraldGrad)"
                  className="transition-all duration-500 ease-in-out"
                />
                <path
                  d={activeData.mentionSvgPath}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                  className="transition-all duration-500 ease-in-out"
                />

                {/* Recommendation Rate Area & Line */}
                <path
                  d={activeData.recAreaPath}
                  fill="url(#visCyanGrad)"
                  className="transition-all duration-500 ease-in-out"
                />
                <path
                  d={activeData.recSvgPath}
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                  className="transition-all duration-500 ease-in-out"
                />

                {/* Live Checkpoint markers for Mention Rate */}
                {activeData.checkpoints.map((pt, idx) => {
                  const isLast = idx === activeData.checkpoints.length - 1;
                  return (
                    <circle
                      key={`mention-pt-${idx}`}
                      cx={pt.cx}
                      cy={pt.cy}
                      r={isLast ? 5 : 4}
                      fill={isLast ? '#34d399' : '#10b981'}
                      stroke={isLast ? '#fff' : 'none'}
                      strokeWidth={isLast ? 2 : 0}
                      className="cursor-pointer transition-all hover:scale-125"
                      onMouseEnter={() => setHoveredPoint({ x: pt.cx, y: pt.cy, label: pt.label, color: '#10b981' })}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />
                  );
                })}

                {/* Live Checkpoint markers for Recommendation Rate */}
                {activeData.recCheckpoints.map((pt, idx) => {
                  const isLast = idx === activeData.recCheckpoints.length - 1;
                  return (
                    <circle
                      key={`rec-pt-${idx}`}
                      cx={pt.cx}
                      cy={pt.cy}
                      r={4}
                      fill="#22d3ee"
                      stroke="#fff"
                      strokeWidth={isLast ? 1.5 : 1}
                      className="cursor-pointer transition-all hover:scale-125"
                      onMouseEnter={() => setHoveredPoint({ x: pt.cx, y: pt.cy, label: pt.label, color: '#22d3ee' })}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />
                  );
                })}
              </svg>
            </div>

            {/* Timeline X-Axis markers */}
            <div className="flex justify-between text-[10px] font-tech-mono text-slate-500 pt-2 border-t border-white/[0.04]">
              {activeData.dates.map((date, idx) => {
                const isCurrent = idx === activeData.dates.length - 1;
                return (
                  <span 
                    key={date} 
                    className={isCurrent ? "text-emerald-400 font-bold" : ""}
                  >
                    {date}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono gap-2">
            <span className="text-slate-400">
              Insight: <span className="text-slate-200">{activeData.insight}</span>
            </span>
            <span className="text-emerald-400 font-tech-mono text-[11px] whitespace-nowrap">
              Confidence: {activeData.confidence}
            </span>
          </div>
      </div>

      {/* Filterable Prompt Matrix Universe */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#080c14] border border-white/[0.08] space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/[0.06]">
          <div>
            <h3 className="text-base font-bold text-white font-tech-mono flex items-center gap-2">
              <Search className="w-4 h-4 text-emerald-400" />
              <span>PROMPT UNIVERSE & INTENT AUDIT</span>
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Individual synthetic prompt runs, rank placement, and ChatGPT response attribution
            </p>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter prompt or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-[#05070c] border border-white/[0.1] rounded-lg text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/80 w-56 sm:w-72"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-white/[0.08] text-[11px] font-tech-mono uppercase text-slate-400 bg-white/[0.01]">
                <th className="py-2.5 px-3">Prompt Query</th>
                <th className="py-2.5 px-3">Search Intent</th>
                <th className="py-2.5 px-3">Brand Mentioned</th>
                <th className="py-2.5 px-3">Rank Placement</th>
                <th className="py-2.5 px-3">Confidence</th>
                <th className="py-2.5 px-3 text-right">Output Trace</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredPrompts.map((row) => (
                <tr key={row.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="py-3 px-3 max-w-xs font-medium text-white group-hover:text-emerald-300 transition-colors">
                    <div className="truncate" title={row.query}>{row.query}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-slate-300">
                      {row.intent}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    {row.mentioned ? (
                      <span className="inline-flex items-center gap-1 text-emerald-400 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Yes</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-slate-500 text-[11px]">
                        <span>No</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded border text-[10px] font-tech-mono font-bold ${row.rankBadge}`}>
                      {row.rank}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-tech-mono text-slate-400">{row.confidence}</td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => setSelectedPromptTrace(row)}
                      className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-tech-mono text-slate-300 hover:text-white transition-colors cursor-pointer"
                    >
                      Inspect Trace
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* Modal for Prompt Trace Inspection */}
      {selectedPromptTrace && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0c101b] border border-white/[0.12] rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <h4 className="text-sm font-bold text-white font-tech-mono">
                  ChatGPT Output Attribution Trace
                </h4>
              </div>
              <button
                onClick={() => setSelectedPromptTrace(null)}
                className="text-slate-400 hover:text-white p-1 rounded"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <span className="text-[10px] uppercase text-slate-500 block font-tech-mono">Prompt Query</span>
                <p className="text-white mt-0.5 p-2.5 rounded bg-black/40 border border-white/[0.06]">
                  "{selectedPromptTrace.query}"
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-[11px] font-tech-mono">
                <div className="p-2.5 rounded bg-white/[0.02] border border-white/[0.06]">
                  <span className="text-slate-500 block">TARGET MODEL</span>
                  <span className="text-white font-bold">OpenAI ChatGPT</span>
                </div>
                <div className="p-2.5 rounded bg-white/[0.02] border border-white/[0.06]">
                  <span className="text-slate-500 block">PLACEMENT</span>
                  <span className="text-emerald-400 font-bold">{selectedPromptTrace.rank}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase text-slate-500 block font-tech-mono">ChatGPT Synthesized Response Snippet</span>
                <p className="text-slate-300 mt-0.5 p-3 rounded bg-[#06080e] border border-white/[0.08] leading-relaxed text-xs">
                  {selectedPromptTrace.snippet}
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedPromptTrace(null)}
                className="px-4 py-1.5 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-tech-mono text-xs font-bold transition-colors cursor-pointer"
              >
                Close Trace
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
