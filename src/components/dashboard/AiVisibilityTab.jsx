import React, { useState } from 'react';
import { 
  Eye, 
  TrendingUp, 
  CheckCircle2, 
  Sparkles, 
  Search, 
  ArrowUpRight, 
  Cpu
} from 'lucide-react';

export default function AiVisibilityTab() {
  const [timeRange, setTimeRange] = useState('90d'); // '30d' | '60d' | '90d'
  const [selectedEngine, setSelectedEngine] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPromptTrace, setSelectedPromptTrace] = useState(null);

  // 01 AI VISIBILITY - CORE METRICS
  const metrics = [
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
      id: 'engine-coverage',
      label: 'Engine Coverage',
      sublabel: 'Presence across frontier LLMs',
      value: '91.7%',
      delta: '11 / 12',
      positive: true,
      fraction: '11 active nodes',
      badge: 'Multimodal',
    },
  ];

  // Engine Breakdown Data
  const engineBreakdown = [
    { name: 'Perplexity Pro', mentionRate: 82.4, recRate: 58.1, top3Rate: 91.2, status: 'Peak' },
    { name: 'OpenAI GPT-4o', mentionRate: 74.6, recRate: 48.0, top3Rate: 86.5, status: 'High' },
    { name: 'Claude 3.5 Sonnet', mentionRate: 71.2, recRate: 44.5, top3Rate: 83.0, status: 'High' },
    { name: 'Google Gemini 2.0', mentionRate: 64.0, recRate: 36.2, top3Rate: 77.4, status: 'Moderate' },
    { name: 'DeepSeek R1', mentionRate: 59.5, recRate: 33.0, top3Rate: 74.2, status: 'Moderate' },
    { name: 'Mistral Large', mentionRate: 55.0, recRate: 29.8, top3Rate: 69.5, status: 'Action Needed' },
  ];

  // Prompt universe sample table
  const samplePrompts = [
    {
      id: 1,
      query: 'Best enterprise generative engine optimization platform for SaaS',
      intent: 'Commercial',
      engine: 'Perplexity Pro',
      mentioned: true,
      rank: '#1 Recommended',
      rankBadge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      confidence: '96%',
      snippet: 'GEO (acme.com) is ranked as the leading automated GEO telemetry suite with real-time Monte Carlo prompt sweep capability...',
    },
    {
      id: 2,
      query: 'How to monitor brand citations inside ChatGPT and Claude responses',
      intent: 'Informational',
      engine: 'OpenAI GPT-4o',
      mentioned: true,
      rank: '#1 Recommended',
      rankBadge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      confidence: '92%',
      snippet: 'Platforms like GEO offer synthetic vector sampling to benchmark LLM attribution rates and citation provenance...',
    },
    {
      id: 3,
      query: 'Top tools to reverse engineer Perplexity citation sources',
      intent: 'Technical',
      engine: 'Claude 3.5 Sonnet',
      mentioned: true,
      rank: '#2 Alternative',
      rankBadge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      confidence: '88%',
      snippet: 'Primary solutions include Profound and GEO Engine, which track web indexing bot frequency and crawl telemetry...',
    },
    {
      id: 4,
      query: 'Compare enterprise SEO software vs generative engine optimization',
      intent: 'Comparative',
      engine: 'Google Gemini 2.0',
      mentioned: true,
      rank: '#3 Included',
      rankBadge: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      confidence: '81%',
      snippet: 'While BrightEdge and Semrush focus on traditional SERP, GEO addresses generative answers with direct answer attribution metrics...',
    },
    {
      id: 5,
      query: 'Free AI visibility audit for venture-backed B2B startups',
      intent: 'Transactional',
      engine: 'DeepSeek R1',
      mentioned: false,
      rank: 'Unranked',
      rankBadge: 'bg-slate-800 text-slate-400 border-slate-700',
      confidence: '34%',
      snippet: 'Competitor platforms Athena and GenerativeEdge were prioritized in free tier queries due to open-source audit wrappers...',
    },
  ];

  const filteredPrompts = samplePrompts.filter((p) => {
    const matchesEngine = selectedEngine === 'all' || p.engine.toLowerCase().includes(selectedEngine.toLowerCase());
    const matchesSearch = p.query.toLowerCase().includes(searchQuery.toLowerCase()) || p.snippet.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesEngine && matchesSearch;
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
                AI Visibility Engine
              </span>
              <span className="text-xs font-tech-mono text-slate-400">
                LLM Presence & Extraction Metrics
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
              <Eye className="w-6 h-6 text-emerald-400" />
              <span>AI VISIBILITY</span>
            </h2>
            <p className="text-xs text-slate-300 font-mono mt-1 max-w-2xl leading-relaxed">
              Real-time measurement of how frequently and prominently your brand appears across conversational LLMs, search engines, and generative synthesis pipelines.
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

      {/* Main Grid: Visibility Trend Chart + Engine Coverage Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* └─ Visibility Trend (2 Cols) */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl bg-[#080c14] border border-white/[0.08] flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/[0.06]">
              <div>
                <div className="text-xs font-tech-mono uppercase tracking-widest text-emerald-400 font-bold flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>VISIBILITY TREND (90-DAY TRAJECTORY)</span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                  Comparative longitudinal sweep: Mention Rate vs Recommendation Rate
                </div>
              </div>

              <div className="flex items-center gap-4 text-[11px] font-tech-mono">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                  <span className="text-slate-300">Mention Rate (68.4%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                  <span className="text-slate-300">Recommendation (42.8%)</span>
                </div>
              </div>
            </div>

            {/* Simulated High-Fidelity SVG Chart Canvas */}
            <div className="mt-5 relative h-56 w-full">
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
                  d="M0,130 C70,125 140,110 210,95 C280,80 350,90 420,70 C490,50 560,55 630,35 L700,25 L700,190 L0,190 Z"
                  fill="url(#visEmeraldGrad)"
                />
                <path
                  d="M0,130 C70,125 140,110 210,95 C280,80 350,90 420,70 C490,50 560,55 630,35 L700,25"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                />

                {/* Recommendation Rate Area & Line */}
                <path
                  d="M0,165 C70,160 140,150 210,140 C280,135 350,130 420,115 C490,105 560,100 630,85 L700,75 L700,190 L0,190 Z"
                  fill="url(#visCyanGrad)"
                />
                <path
                  d="M0,165 C70,160 140,150 210,140 C280,135 350,130 420,115 C490,105 560,100 630,85 L700,75"
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                />

                {/* Live Checkpoint markers */}
                <circle cx="210" cy="95" r="4" fill="#10b981" />
                <circle cx="420" cy="70" r="4" fill="#10b981" />
                <circle cx="700" cy="25" r="5" fill="#34d399" stroke="#fff" strokeWidth="2" />
                
                <circle cx="700" cy="75" r="4" fill="#22d3ee" stroke="#fff" strokeWidth="1.5" />
              </svg>
            </div>

            {/* Timeline X-Axis markers */}
            <div className="flex justify-between text-[10px] font-tech-mono text-slate-500 pt-2 border-t border-white/[0.04]">
              <span>JUL 01</span>
              <span>JUL 15</span>
              <span>AUG 01</span>
              <span>AUG 15</span>
              <span>SEP 01</span>
              <span>SEP 15</span>
              <span className="text-emerald-400 font-bold">SEP 28 (CURRENT)</span>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">
              Insight: Perplexity and GPT-4o citation adoption drove a <strong className="text-emerald-400">+19.2% net visibility surge</strong> over the last 60 days.
            </span>
            <span className="text-emerald-400 font-tech-mono text-[11px] whitespace-nowrap ml-3">
              Confidence: 98.4%
            </span>
          </div>
        </div>

        {/* ├─ Engine Coverage Breakdown (1 Col) */}
        <div className="p-5 rounded-2xl bg-[#080c14] border border-white/[0.08] flex flex-col justify-between">
          <div>
            <div className="pb-3 border-b border-white/[0.06]">
              <div className="text-xs font-tech-mono uppercase tracking-widest text-emerald-400 font-bold flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" />
                <span>ENGINE COVERAGE MATRIX</span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                Frontier LLMs sampled (847 prompt vectors)
              </div>
            </div>

            <div className="space-y-3.5 mt-4">
              {engineBreakdown.map((eng) => (
                <div key={eng.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-tech-mono">
                    <span className="text-white font-medium">{eng.name}</span>
                    <span className="text-emerald-400 font-bold">{eng.mentionRate}%</span>
                  </div>
                  
                  {/* Two-tier progress bar: Mention Rate (solid emerald) & Rec Rate (cyan) */}
                  <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden flex">
                    <div 
                      className="bg-emerald-400 h-full rounded-full transition-all"
                      style={{ width: `${eng.mentionRate}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[10px] font-mono text-slate-400 pt-0.5">
                    <span>Rec: {eng.recRate}%</span>
                    <span>Top-3: {eng.top3Rate}%</span>
                    <span className={`text-[9px] uppercase font-tech-mono ${
                      eng.status === 'Peak' ? 'text-emerald-400' :
                      eng.status === 'High' ? 'text-cyan-400' : 'text-amber-400'
                    }`}>
                      {eng.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/[0.06] text-center">
            <span className="text-[11px] font-tech-mono text-slate-400">
              Coverage status: <strong className="text-emerald-400">11 of 12 engines active</strong>
            </span>
          </div>
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
              Individual synthetic prompt runs, rank placement, and LLM output attribution
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
                className="pl-8 pr-3 py-1.5 bg-[#05070c] border border-white/[0.1] rounded-lg text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/80 w-44 sm:w-56"
              />
            </div>

            <select
              value={selectedEngine}
              onChange={(e) => setSelectedEngine(e.target.value)}
              className="px-3 py-1.5 bg-[#05070c] border border-white/[0.1] rounded-lg text-xs font-tech-mono text-slate-300 focus:outline-none focus:border-emerald-500/80 cursor-pointer"
            >
              <option value="all">All Engines</option>
              <option value="perplexity">Perplexity</option>
              <option value="openai">OpenAI GPT-4o</option>
              <option value="claude">Claude</option>
              <option value="gemini">Google Gemini</option>
              <option value="deepseek">DeepSeek</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-white/[0.08] text-[11px] font-tech-mono uppercase text-slate-400 bg-white/[0.01]">
                <th className="py-2.5 px-3">Prompt Query</th>
                <th className="py-2.5 px-3">Search Intent</th>
                <th className="py-2.5 px-3">Engine</th>
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
                  <td className="py-3 px-3 text-slate-300 font-tech-mono">{row.engine}</td>
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
                  Engine Output Attribution Trace
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
                  <span className="text-slate-500 block">ENGINE</span>
                  <span className="text-white font-bold">{selectedPromptTrace.engine}</span>
                </div>
                <div className="p-2.5 rounded bg-white/[0.02] border border-white/[0.06]">
                  <span className="text-slate-500 block">PLACEMENT</span>
                  <span className="text-emerald-400 font-bold">{selectedPromptTrace.rank}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase text-slate-500 block font-tech-mono">LLM Synthesized Response Snippet</span>
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
