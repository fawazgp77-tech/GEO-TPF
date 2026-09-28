import React from 'react';

export default function SeoScoreTab() {
  const tiers = [
    { name: 'Technical Crawler Indexing', status: '86% Complete', score: 86, color: 'bg-emerald-400' },
    { name: 'Semantic Context Structuring', status: '68% Moderate', score: 68, color: 'bg-amber-400' },
    { name: 'Source Domain Authority Index', status: '71% Strong', score: 71, color: 'bg-emerald-400' },
  ];

  const subMetrics = [
    { label: 'TECHNICAL SEO', score: 85, color: 'text-emerald-400', bar: 'bg-emerald-400' },
    { label: 'CONTENT QUALITY', score: 74, color: 'text-emerald-400', bar: 'bg-emerald-400' },
    { label: 'CONTENT RELEVANCE', score: 68, color: 'text-amber-400', bar: 'bg-amber-400' },
    { label: 'AUTHORITY INDEX', score: 71, color: 'text-emerald-400', bar: 'bg-emerald-400' },
    { label: 'STRUCTURED DATA', score: 62, color: 'text-amber-400', bar: 'bg-amber-400' },
    { label: 'CRAWLABILITY SCORE', score: 88, color: 'text-emerald-400', bar: 'bg-emerald-400' },
    { label: 'CONTENT FRESHNESS', score: 65, color: 'text-amber-400', bar: 'bg-amber-400' },
    { label: 'AI READABILITY', score: 70, color: 'text-emerald-400', bar: 'bg-emerald-400' },
    { label: 'CITATION POTENTIAL', score: 58, color: 'text-amber-400', bar: 'bg-amber-400' },
  ];

  const criticalOpportunities = [
    {
      deficit: 'Missing structured FAQ schema',
      severity: 'High',
      severityColor: 'bg-red-950/80 border-red-500/40 text-red-400',
      impact: "Limits AI's ability to extract direct answers.",
      step: 'Deploy structured JSON-LD Schema to top 20 transactional pages.',
    },
    {
      deficit: 'Thin content on target pricing views',
      severity: 'High',
      severityColor: 'bg-red-950/80 border-red-500/40 text-red-400',
      impact: 'Reduces citation potential inside comparison outputs.',
      step: 'Expand content matrices detailing comparative value tiers.',
    },
    {
      deficit: 'Outdated meta tags',
      severity: 'Medium',
      severityColor: 'bg-amber-950/80 border-amber-500/40 text-amber-400',
      impact: 'Affects AI conversational summary snippets.',
      step: 'Revise meta headers with entity-rich semantic verbs.',
    },
    {
      deficit: 'Slow mobile core load priority',
      severity: 'Medium',
      severityColor: 'bg-amber-950/80 border-amber-500/40 text-amber-400',
      impact: 'Limits crawler pass frequency and crawl budget.',
      step: 'Optimize resource paths and defer heavy analytical scripts.',
    },
    {
      deficit: 'Missing verified author bio records',
      severity: 'Low',
      severityColor: 'bg-slate-900 border-white/10 text-slate-400',
      impact: 'Limits authority index signals for advice queries.',
      step: 'Bind blog posts to validated individual bio markup structures.',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Title & Subtitle */}
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          SEO / GEO Readiness Score
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 font-light mt-1">
          Technical and semantic metrics scoring search engine friendliness for modern conversational crawlers.
        </p>
      </div>

      {/* Top Gauge & Tier Readiness */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Overall Ready Rating Circular Gauge */}
        <div className="lg:col-span-5 bg-[#0b0f17] border border-white/[0.08] rounded-xl p-6 flex flex-col items-center justify-center text-center">
          <div className="text-xs font-tech-mono uppercase tracking-wider text-slate-400 mb-4">
            OVERALL READY RATING
          </div>

          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* Circular Ring SVG */}
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#10b981"
                strokeWidth="8"
                strokeDasharray="251.2"
                strokeDashoffset="70.3"
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-tech-mono font-bold text-white tracking-tight">
                72
              </span>
              <span className="text-[10px] font-tech-mono text-slate-500">
                / 100
              </span>
            </div>
          </div>

          <span className="mt-4 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-[11px] font-tech-mono text-emerald-400 font-semibold">
            STATUS: READY FOR CONVERSATIONAL INGESTION
          </span>
        </div>

        {/* Ready Status by Tier */}
        <div className="lg:col-span-7 bg-[#0b0f17] border border-white/[0.08] rounded-xl p-6 flex flex-col justify-between">
          <div className="text-xs font-tech-mono uppercase tracking-wider text-slate-300 font-semibold mb-4">
            READY STATUS BY TIER
          </div>

          <div className="space-y-4">
            {tiers.map((tier) => (
              <div key={tier.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-tech-mono">
                  <span className="text-slate-300 font-medium">{tier.name}</span>
                  <span className="text-emerald-400 font-bold">{tier.status}</span>
                </div>
                <div className="h-2 w-full bg-[#06080e] rounded-full overflow-hidden border border-white/[0.05]">
                  <div
                    className={`h-full ${tier.color} rounded-full`}
                    style={{ width: `${tier.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-white/[0.06] text-[11px] font-tech-mono text-slate-500 flex items-center justify-between">
            <span>Aggregated from 847 prompt evaluation passes</span>
            <span className="text-slate-400">Next pass: 14 hrs</span>
          </div>
        </div>

      </div>

      {/* 9 Sub-Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3">
        {subMetrics.map((sm, idx) => (
          <div key={idx} className="bg-[#0b0f17] border border-white/[0.08] rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-tech-mono uppercase tracking-wider text-slate-400">
                {sm.label}
              </span>
              <span className={`text-base font-tech-mono font-bold ${sm.color}`}>
                {sm.score}
              </span>
            </div>
            <div className="h-1.5 w-full bg-[#06080e] rounded-full overflow-hidden border border-white/[0.04]">
              <div
                className={`h-full ${sm.bar} rounded-full`}
                style={{ width: `${sm.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Critical System Opportunities Table */}
      <div className="bg-[#0b0f17] border border-white/[0.08] rounded-xl p-5 overflow-hidden">
        <div className="text-xs font-tech-mono uppercase tracking-wider text-white font-semibold mb-4">
          CRITICAL SYSTEM OPPORTUNITIES
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-tech-mono text-xs">
            <thead>
              <tr className="border-b border-white/[0.08] text-[10px] uppercase text-slate-500 tracking-wider">
                <th className="pb-3 font-normal">IDENTIFIED DEFICIT</th>
                <th className="pb-3 font-normal">SEVERITY</th>
                <th className="pb-3 font-normal">SYSTEMIC IMPACT</th>
                <th className="pb-3 font-normal">RECOMMENDED STEP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {criticalOpportunities.map((row, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 text-white font-medium pr-4">{row.deficit}</td>
                  <td className="py-3.5 pr-4">
                    <span className={`px-2 py-0.5 rounded border text-[10px] uppercase font-bold ${row.severityColor}`}>
                      {row.severity}
                    </span>
                  </td>
                  <td className="py-3.5 text-slate-300 font-sans text-xs pr-4">{row.impact}</td>
                  <td className="py-3.5 text-emerald-400/90 font-sans text-xs">{row.step}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
