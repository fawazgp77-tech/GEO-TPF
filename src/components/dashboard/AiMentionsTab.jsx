import React from 'react';
import { ThumbsUp, HelpCircle, ThumbsDown } from 'lucide-react';

export default function AiMentionsTab() {

  const categories = [
    { name: 'Product', count: '324 (25%)', pct: 25 },
    { name: 'Features', count: '276 (21%)', pct: 21 },
    { name: 'Pricing', count: '198 (15%)', pct: 15 },
    { name: 'Quality', count: '156 (12%)', pct: 12 },
    { name: 'Use Cases', count: '112 (9%)', pct: 9 },
    { name: 'Reliability', count: '89 (7%)', pct: 7 },
    { name: 'Customer Exp', count: '78 (6%)', pct: 6 },
    { name: 'Industry Expert', count: '51 (4%)', pct: 4 },
  ];

  const optimizations = [
    {
      title: 'STRENGTHEN COMPARISON CONTENT',
      priority: 'HIGH PRIORITY',
      priorityColor: 'bg-red-950/80 border-red-500/40 text-red-400',
      reason: 'Low visibility in comparison prompts (38% vs competitor average 52%)',
      impact: '+8-12% recommendation rate',
      action: 'Create detailed comparison pages against top 3 competitors',
    },
    {
      title: 'IMPROVE PRICING TRANSPARENCY',
      priority: 'HIGH PRIORITY',
      priorityColor: 'bg-red-950/80 border-red-500/40 text-red-400',
      reason: 'AI conversational engines frequently retrieve outdated Pricing metadata',
      impact: '+5% citation accuracy',
      action: 'Update core pricing pages with rich structured JSON schema data',
    },
    {
      title: 'EXPAND USE CASE DOCUMENTATION',
      priority: 'MEDIUM PRIORITY',
      priorityColor: 'bg-amber-950/80 border-amber-500/40 text-amber-400',
      reason: '112 category mentions documented but performs slightly below market tier average',
      impact: '+15% mention rate in use-case queries',
      action: 'Publish 5 detailed technical use case articles',
    },
    {
      title: 'ADD CUSTOMER TESTIMONIALS MARKUP',
      priority: 'MEDIUM PRIORITY',
      priorityColor: 'bg-amber-950/80 border-amber-500/40 text-amber-400',
      reason: 'Relatively low volume of direct customer experience mentions (78 recorded)',
      impact: '+10% positive sentiment mention rate',
      action: 'Add active review schemas to modern testimonials layout sections',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Title & Subtitle */}
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          AI Mentions & Recommendations
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 font-light mt-1">
          Comprehensive tracking of conversational engine references, sentiment weightings, and key category recommendation rates.
        </p>
      </div>

      {/* Top 3 Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#0b0f17] border border-white/[0.08] rounded-xl p-5">
          <div className="text-[10px] font-tech-mono uppercase tracking-widest text-slate-400 mb-1">
            TOTAL AI MENTIONS
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-tech-mono font-bold text-white tracking-tight">
              1,284
            </span>
            <span className="text-xs font-tech-mono text-slate-400">
              queries
            </span>
          </div>
        </div>

        <div className="bg-[#0b0f17] border border-white/[0.08] rounded-xl p-5">
          <div className="text-[10px] font-tech-mono uppercase tracking-widest text-slate-400 mb-1">
            MENTION RATE
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-tech-mono font-bold text-emerald-400 tracking-tight">
              67%
            </span>
            <span className="text-xs font-tech-mono text-emerald-400">
              +4.2%
            </span>
          </div>
        </div>

        <div className="bg-[#0b0f17] border border-white/[0.08] rounded-xl p-5">
          <div className="text-[10px] font-tech-mono uppercase tracking-widest text-slate-400 mb-1">
            RECOMMENDATION RATE
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-tech-mono font-bold text-white tracking-tight">
              54%
            </span>
            <span className="text-xs font-tech-mono text-slate-400">
              overall
            </span>
          </div>
        </div>
      </div>

      {/* Sentiment Breakdown Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#070a10] border border-emerald-500/20 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ThumbsUp className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-tech-mono text-slate-300">POSITIVE MENTIONS</span>
          </div>
          <span className="font-tech-mono text-sm font-bold text-emerald-400">812 (63.2%)</span>
        </div>

        <div className="bg-[#070a10] border border-cyan-500/20 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-tech-mono text-slate-300">NEUTRAL MENTIONS</span>
          </div>
          <span className="font-tech-mono text-sm font-bold text-cyan-400">341 (26.6%)</span>
        </div>

        <div className="bg-[#070a10] border border-red-500/20 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ThumbsDown className="w-4 h-4 text-red-400" />
            <span className="text-xs font-tech-mono text-slate-300">NEGATIVE MENTIONS</span>
          </div>
          <span className="font-tech-mono text-sm font-bold text-red-400">131 (10.2%)</span>
        </div>
      </div>

      {/* Filter Bar & Mention Frequency Trends (JUL - SEP 2026) */}
      <div className="bg-[#0b0f17] border border-white/[0.08] rounded-xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5 pb-4 border-b border-white/[0.06]">
          <div>
            <div className="text-xs font-tech-mono uppercase tracking-wider text-slate-300 font-semibold">
              MENTION FREQUENCY TRENDS (JUL - SEP 2026)
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs font-tech-mono">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#070a10] border border-white/10 text-slate-300">
              <span className="text-slate-500">Engine:</span>
              <span>All</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#070a10] border border-white/10 text-slate-300">
              <span className="text-slate-500">Category:</span>
              <span>All</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#070a10] border border-white/10 text-slate-300">
              <span>Last 90 Days</span>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-5 text-xs font-tech-mono mb-4 text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span>All Mentions</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <span>Positive</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <span>Negative</span>
          </div>
        </div>

        {/* SVG Multi-Line Chart */}
        <div className="h-44 w-full relative">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 500 120" preserveAspectRatio="none">
            <line x1="0" y1="20" x2="500" y2="20" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
            <line x1="0" y1="60" x2="500" y2="60" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
            <line x1="0" y1="100" x2="500" y2="100" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />

            {/* All Mentions curve (emerald) */}
            <path
              d="M 20 80 Q 90 60 160 45 T 300 30 T 400 40 T 480 25"
              fill="none"
              stroke="#10b981"
              strokeWidth="2.5"
            />
            {/* Positive curve (cyan) */}
            <path
              d="M 20 95 Q 90 80 160 65 T 300 50 T 400 55 T 480 40"
              fill="none"
              stroke="#06b6d4"
              strokeWidth="2"
            />
            {/* Negative curve (red) */}
            <path
              d="M 20 110 Q 90 105 160 100 T 300 102 T 400 98 T 480 105"
              fill="none"
              stroke="#f43f5e"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
          </svg>
          <div className="flex justify-between text-[10px] font-tech-mono text-slate-500 pt-2">
            <span>Jul 26</span>
            <span>Aug 02</span>
            <span>Aug 15</span>
            <span>Aug 30</span>
            <span>Sep 10</span>
            <span>Sep 18</span>
            <span>Sep 26</span>
          </div>
        </div>
      </div>

      {/* Two Middle Panels: Distribution & Recommendation Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Mention Distribution by Category */}
        <div className="lg:col-span-6 bg-[#0b0f17] border border-white/[0.08] rounded-xl p-5">
          <div className="text-xs font-tech-mono uppercase tracking-wider text-slate-300 font-semibold mb-4">
            MENTION DISTRIBUTION BY CATEGORY
          </div>

          <div className="space-y-3">
            {categories.map((c) => (
              <div key={c.name}>
                <div className="flex items-center justify-between text-xs font-tech-mono mb-1">
                  <span className="text-slate-300">{c.name}</span>
                  <span className="text-emerald-400 font-medium">{c.count}</span>
                </div>
                <div className="h-1.5 w-full bg-[#06080e] rounded-full overflow-hidden border border-white/[0.04]">
                  <div
                    className="h-full bg-emerald-400 rounded-full"
                    style={{ width: `${c.pct * 3.5}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendation Analysis */}
        <div className="lg:col-span-6 bg-[#0b0f17] border border-white/[0.08] rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="text-xs font-tech-mono uppercase tracking-wider text-slate-300 font-semibold mb-4">
              RECOMMENDATION ANALYSIS
            </div>

            {/* When AI Recommends Acme */}
            <div className="space-y-2.5 mb-5">
              <div className="text-[10px] font-tech-mono uppercase tracking-wider text-slate-400">
                WHEN AI RECOMMENDS ACME
              </div>
              <div>
                <div className="flex justify-between text-xs font-tech-mono mb-1">
                  <span className="text-slate-300">Product queries</span>
                  <span className="text-emerald-400 font-bold">72%</span>
                </div>
                <div className="h-1.5 bg-[#06080e] rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: '72%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-tech-mono mb-1">
                  <span className="text-slate-300">Best-for queries</span>
                  <span className="text-emerald-400 font-bold">61%</span>
                </div>
                <div className="h-1.5 bg-[#06080e] rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: '61%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-tech-mono mb-1">
                  <span className="text-slate-300">Comparison queries</span>
                  <span className="text-amber-400 font-bold">38%</span>
                </div>
                <div className="h-1.5 bg-[#06080e] rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: '38%' }} />
                </div>
              </div>
            </div>

            {/* Competitor Recommended Instead */}
            <div className="space-y-1.5 mb-5 pt-3 border-t border-white/[0.06]">
              <div className="text-[10px] font-tech-mono uppercase tracking-wider text-slate-400">
                COMPETITOR RECOMMENDED INSTEAD
              </div>
              <div className="flex items-center justify-between text-xs font-tech-mono">
                <span className="text-slate-300">rival.io</span>
                <span className="text-red-400 font-medium">34%</span>
              </div>
              <div className="flex items-center justify-between text-xs font-tech-mono">
                <span className="text-slate-300">nextgen.com</span>
                <span className="text-red-400 font-medium">28%</span>
              </div>
            </div>
          </div>

          {/* Strongest Recommendation Themes */}
          <div className="pt-3 border-t border-white/[0.06]">
            <div className="text-[10px] font-tech-mono uppercase tracking-wider text-slate-400 mb-2">
              STRONGEST RECOMMENDATION THEMES
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 font-tech-mono text-[11px]">
                Enterprise solutions
              </span>
              <span className="px-2.5 py-1 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 font-tech-mono text-[11px]">
                API integrations
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Actionable AI Recommendation Optimizations */}
      <div className="bg-[#0b0f17] border border-white/[0.08] rounded-xl p-6">
        <h3 className="text-sm font-tech-mono uppercase tracking-wider text-white font-semibold mb-4">
          ACTIONABLE AI RECOMMENDATION OPTIMIZATIONS
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {optimizations.map((item, idx) => (
            <div key={idx} className="bg-[#070a10] border border-white/[0.06] hover:border-white/15 rounded-lg p-4 space-y-2 transition-all">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-tech-mono font-bold text-white tracking-wide">
                  {item.title}
                </h4>
                <span className={`px-2 py-0.5 rounded border text-[9px] font-tech-mono uppercase font-bold ${item.priorityColor}`}>
                  {item.priority}
                </span>
              </div>

              <div className="text-[11px] text-slate-400 font-light">
                <strong className="text-slate-300">Reason:</strong> {item.reason}
              </div>

              <div className="text-[11px] font-tech-mono text-emerald-400">
                <strong>Expected Impact:</strong> {item.impact}
              </div>

              <div className="text-[11px] text-slate-300 pt-1 border-t border-white/[0.05]">
                <strong className="text-slate-400">Action:</strong> {item.action}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
