import React from 'react';
import { ExternalLink } from 'lucide-react';

export default function DataAccuracyTab() {
  const accuracyItems = [
    { label: 'Business Information', score: '92%', status: 'GOOD', color: 'text-emerald-400', badge: 'bg-emerald-950/80 border-emerald-500/40 text-emerald-400' },
    { label: 'Pricing Info', score: '58%', status: 'WARNING', color: 'text-amber-400', badge: 'bg-amber-950/80 border-amber-500/40 text-amber-400' },
    { label: 'Contact Information', score: '95%', status: 'GOOD', color: 'text-emerald-400', badge: 'bg-emerald-950/80 border-emerald-500/40 text-emerald-400' },
    { label: 'Content Freshness', score: '62%', status: 'WARNING', color: 'text-amber-400', badge: 'bg-amber-950/80 border-amber-500/40 text-amber-400' },
    { label: 'Product/Service Info', score: '78%', status: 'GOOD', color: 'text-emerald-400', badge: 'bg-emerald-950/80 border-emerald-500/40 text-emerald-400' },
    { label: 'Features Accuracy', score: '81%', status: 'GOOD', color: 'text-emerald-400', badge: 'bg-emerald-950/80 border-emerald-500/40 text-emerald-400' },
    { label: 'Office Locations', score: '90%', status: 'GOOD', color: 'text-emerald-400', badge: 'bg-emerald-950/80 border-emerald-500/40 text-emerald-400' },
    { label: 'Cross Source Consistency', score: '68%', status: 'WARNING', color: 'text-amber-400', badge: 'bg-amber-950/80 border-amber-500/40 text-amber-400' },
  ];

  const sourceAudits = [
    { source: 'acme.com/products', pages: 12, freq: 234, updated: 'Sep 24', accuracy: '92%', importance: 'CRITICAL', impColor: 'bg-red-950/80 border-red-500/40 text-red-400' },
    { source: 'acme.com/pricing', pages: 4, freq: 156, updated: 'Aug 12', accuracy: '58%', importance: 'HIGH', impColor: 'bg-amber-950/80 border-amber-500/40 text-amber-400' },
    { source: 'acme.com/blog', pages: 28, freq: 189, updated: 'Sep 25', accuracy: '88%', importance: 'HIGH', impColor: 'bg-amber-950/80 border-amber-500/40 text-amber-400' },
    { source: 'g2.com/acme', pages: 3, freq: 98, updated: 'Sep 20', accuracy: '79%', importance: 'MEDIUM', impColor: 'bg-slate-900 border-white/10 text-slate-300' },
    { source: 'trustpilot.com/acme', pages: 2, freq: 67, updated: 'Sep 18', accuracy: '84%', importance: 'MEDIUM', impColor: 'bg-slate-900 border-white/10 text-slate-300' },
    { source: 'wikipedia.org/acme', pages: 1, freq: 145, updated: 'Jul 03', accuracy: '64%', importance: 'HIGH', impColor: 'bg-amber-950/80 border-amber-500/40 text-amber-400' },
    { source: 'techcrunch.com/acme', pages: 5, freq: 78, updated: 'Sep 15', accuracy: '89%', importance: 'MEDIUM', impColor: 'bg-slate-900 border-white/10 text-slate-300' },
  ];

  const outdatedLogs = [
    {
      title: 'Outdated pricing schema on pricing page',
      severity: 'High Severity',
      severityColor: 'bg-red-950/80 border-red-500/40 text-red-400',
      source: 'acme.com/pricing',
      issue: 'Conversational LLM crawlers are actively referencing Q1 2026 pricing layers',
      action: 'Update pricing schema coordinates and manually resubmit schema indexes to crawl layers',
    },
    {
      title: 'Missing enterprise product documentation',
      severity: 'Medium Severity',
      severityColor: 'bg-amber-950/80 border-amber-500/40 text-amber-400',
      source: 'acme.com/products',
      issue: 'Enterprise tiers and collaborative workspace modules are not explicitly detailed on technical index sheets',
      action: 'Add robust Enterprise product structure grids and clear descriptive product metadata tags',
    },
    {
      title: 'Conflicting structural meta profiles',
      severity: 'Low Severity',
      severityColor: 'bg-slate-900 border-white/10 text-slate-300',
      source: 'Wikipedia vs Crunchbase API',
      issue: 'Wikipedia profile indexes founding year as 2019 while Crunchbase registers 2018, causing verification issues',
      action: 'Correct historical year values inside active Wikipedia directory and verify metadata consistency',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Title & Subtitle */}
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Data Accuracy
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 font-light mt-1">
          Technical scoring measuring content data integrity, freshness, and retrieval consistency across search networks.
        </p>
      </div>

      {/* Top Section: Overall Accuracy Score + Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Score Gauge */}
        <div className="lg:col-span-4 bg-[#0b0f17] border border-white/[0.08] rounded-xl p-6 flex flex-col items-center justify-center text-center">
          <div className="text-xs font-tech-mono uppercase tracking-wider text-slate-400 mb-4">
            OVERALL ACCURACY SCORE
          </div>

          <div className="relative w-36 h-36 flex items-center justify-center">
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
                strokeDashoffset="65.3"
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-tech-mono font-bold text-white tracking-tight">
                74
              </span>
              <span className="text-[10px] font-tech-mono text-slate-500">
                / 100
              </span>
            </div>
          </div>

          <span className="mt-4 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-[11px] font-tech-mono text-emerald-400 font-semibold">
            STATUS: 74% GROUNDED
          </span>
        </div>

        {/* Breakdown Grid of 8 items */}
        <div className="lg:col-span-8 bg-[#0b0f17] border border-white/[0.08] rounded-xl p-5">
          <div className="text-xs font-tech-mono uppercase tracking-wider text-slate-300 font-semibold mb-4">
            DATA INTEGRITY BREAKDOWN
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {accuracyItems.map((item, idx) => (
              <div key={idx} className="bg-[#070a10] border border-white/[0.05] rounded-lg p-3 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-300 font-medium">
                    {item.label}
                  </div>
                  <div className={`text-sm font-tech-mono font-bold ${item.color} mt-0.5`}>
                    {item.score}
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded border text-[10px] font-tech-mono font-bold ${item.badge}`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Source Intelligence Audit Table */}
      <div className="bg-[#0b0f17] border border-white/[0.08] rounded-xl p-5 overflow-hidden">
        <div className="text-xs font-tech-mono uppercase tracking-wider text-white font-semibold mb-4">
          SOURCE INTELLIGENCE AUDIT
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-tech-mono text-xs">
            <thead>
              <tr className="border-b border-white/[0.08] text-[10px] uppercase text-slate-500 tracking-wider">
                <th className="pb-3 font-normal">SOURCE / DOMAIN</th>
                <th className="pb-3 font-normal">PAGES CITED</th>
                <th className="pb-3 font-normal">FREQ</th>
                <th className="pb-3 font-normal">LAST UPDATED</th>
                <th className="pb-3 font-normal">ACCURACY</th>
                <th className="pb-3 font-normal">IMPORTANCE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {sourceAudits.map((row, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 text-emerald-400 font-mono pr-4 flex items-center gap-1.5">
                    <span>{row.source}</span>
                    <ExternalLink className="w-3 h-3 opacity-40 hover:opacity-100" />
                  </td>
                  <td className="py-3 text-slate-300 pr-4">{row.pages}</td>
                  <td className="py-3 text-slate-300 pr-4">{row.freq}</td>
                  <td className="py-3 text-slate-400 pr-4">{row.updated}</td>
                  <td className="py-3 font-bold text-white pr-4">{row.accuracy}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${row.impColor}`}>
                      {row.importance}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Incorrect & Outdated Information Log */}
      <div className="bg-[#0b0f17] border border-white/[0.08] rounded-xl p-6">
        <h3 className="text-sm font-tech-mono uppercase tracking-wider text-white font-semibold mb-4">
          INCORRECT & OUTDATED INFORMATION LOG
        </h3>

        <div className="space-y-4">
          {outdatedLogs.map((log, idx) => (
            <div key={idx} className="bg-[#070a10] border border-white/[0.06] hover:border-white/15 rounded-lg p-4 space-y-2.5 transition-all">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-tech-mono font-bold text-white tracking-wide">
                  {log.title}
                </h4>
                <span className={`px-2 py-0.5 rounded border text-[9px] font-tech-mono uppercase font-bold ${log.severityColor}`}>
                  {log.severity}
                </span>
              </div>

              <div className="text-[11px] font-tech-mono text-emerald-400">
                <strong>Source:</strong> {log.source}
              </div>

              <div className="text-xs text-slate-300 font-light">
                <strong className="text-slate-400 font-normal">Issue:</strong> {log.issue}
              </div>

              <div className="text-xs text-slate-400 font-light pt-2 border-t border-white/[0.05]">
                <strong className="text-emerald-400 font-tech-mono">Action Items:</strong> {log.action}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
