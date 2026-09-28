import React from 'react';
import { ShieldAlert } from 'lucide-react';

export default function CompetitiveAnalysisTab() {
  const metricLeaders = [
    { metric: 'AI Mention Rate', yourShare: '67%', leader: 'rival.io', leaderShare: '34% SOV' },
    { metric: 'Citation Rate', yourShare: '43%', leader: 'rival.io', leaderShare: '31% SOV' },
    { metric: 'Citation Share', yourShare: '18%', leader: 'acme.com', leaderShare: 'You Lead' },
    { metric: 'Share of Voice', yourShare: '22%', leader: 'rival.io', leaderShare: '28% SOV' },
    { metric: 'Rec. Rate', yourShare: '54%', leader: 'altbase.co', leaderShare: '61% SOV' },
    { metric: 'Page Citation', yourShare: '31%', leader: 'rival.io', leaderShare: '39% SOV' },
    { metric: 'GEO Score', yourShare: '78%', leader: 'acme.com', leaderShare: 'You Lead' },
    { metric: 'Crawl Priority', yourShare: '82%', leader: 'acme.com', leaderShare: 'You Lead' },
  ];

  const competitors = [
    { tag: 'A', name: 'rival.io', type: 'Direct Competitor A', sov: '34% SOV', color: 'border-red-500/40 text-red-400' },
    { tag: 'B', name: 'nextgen.com', type: 'Direct Competitor B', sov: '25% SOV', color: 'border-amber-500/40 text-amber-400' },
    { tag: 'C', name: 'altbase.co', type: 'Niche Peer C', sov: '19% SOV', color: 'border-cyan-500/40 text-cyan-400' },
    { tag: 'D', name: 'primestack.io', type: 'Inbound Peer D', sov: '14% SOV', color: 'border-purple-500/40 text-purple-400' },
  ];

  const matrixRows = [
    { category: 'Product prompts', you: 'high', rival: 'high', nextgen: 'med', altbase: 'low' },
    { category: 'Comparison prompts', you: 'low', rival: 'high', nextgen: 'med', altbase: 'med' },
    { category: 'Pricing prompts', you: 'high', rival: 'med', nextgen: 'high', altbase: 'low' },
    { category: 'Best-for prompts', you: 'med', rival: 'high', nextgen: 'low', altbase: 'high' },
    { category: 'Recommendation prompts', you: 'med', rival: 'med', nextgen: 'low', altbase: 'high' },
    { category: 'Problem-solving prompts', you: 'low', rival: 'med', nextgen: 'high', altbase: 'med' },
    { category: 'Industry prompts', you: 'low', rival: 'low', nextgen: 'high', altbase: 'med' },
    { category: 'Feature prompts', you: 'high', rival: 'high', nextgen: 'med', altbase: 'med' },
  ];

  const getBadge = (level) => {
    if (level === 'high') {
      return <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-[10px] font-tech-mono uppercase font-bold">high</span>;
    }
    if (level === 'med') {
      return <span className="px-2 py-0.5 rounded bg-amber-950/80 border border-amber-500/40 text-amber-400 text-[10px] font-tech-mono uppercase font-semibold">med</span>;
    }
    return <span className="px-2 py-0.5 rounded bg-slate-900 border border-white/10 text-slate-500 text-[10px] font-tech-mono uppercase">low</span>;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Title & Subtitle */}
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Your Brand vs Competitors
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 font-light mt-1">
          Direct competitive mapping across 4 primary generative platform peers.
        </p>
      </div>

      {/* Top Section: Metric Leader Summary + Competing Domains */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Metric Leader Summary */}
        <div className="lg:col-span-7 bg-[#0b0f17] border border-white/[0.08] rounded-xl p-5">
          <div className="text-xs font-tech-mono uppercase tracking-wider text-slate-300 font-semibold mb-4">
            METRIC LEADER SUMMARY
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {metricLeaders.map((item, idx) => (
              <div key={idx} className="bg-[#070a10] border border-white/[0.05] rounded-lg p-3 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-300 font-medium">
                    {item.metric}
                  </div>
                  <div className="text-[10px] font-tech-mono text-emerald-400">
                    Your Share: {item.yourShare}
                  </div>
                </div>

                <div className="text-right font-tech-mono">
                  <div className="text-xs font-semibold text-white">
                    {item.leader}
                  </div>
                  <div className="text-[9px] text-slate-400">
                    {item.leaderShare}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Competing Domains In Scope */}
        <div className="lg:col-span-5 bg-[#0b0f17] border border-white/[0.08] rounded-xl p-5 flex flex-col justify-between">
          <div className="text-xs font-tech-mono uppercase tracking-wider text-slate-300 font-semibold mb-4">
            COMPETING DOMAINS IN SCOPE
          </div>

          <div className="space-y-3">
            {competitors.map((comp) => (
              <div key={comp.tag} className="bg-[#070a10] border border-white/[0.05] rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded border ${comp.color} flex items-center justify-center font-tech-mono text-xs font-bold`}>
                    {comp.tag}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white font-tech-mono">
                      {comp.name}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {comp.type}
                    </div>
                  </div>
                </div>

                <span className="text-xs font-tech-mono text-slate-300 font-medium">
                  {comp.sov}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-white/[0.06] text-[10px] font-tech-mono text-slate-500 text-center">
            MONITORING 4 FRONTIER ADJACENCY VECTORS
          </div>
        </div>

      </div>

      {/* Competitive Prompt Performance Matrix Table */}
      <div className="bg-[#0b0f17] border border-white/[0.08] rounded-xl p-5 overflow-hidden">
        <div className="text-xs font-tech-mono uppercase tracking-wider text-slate-300 font-semibold mb-4">
          COMPETITIVE PROMPT PERFORMANCE MATRIX
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-tech-mono text-xs">
            <thead>
              <tr className="border-b border-white/[0.08] text-[10px] uppercase text-slate-500 tracking-wider">
                <th className="pb-3 font-normal">PROMPT CATEGORY</th>
                <th className="pb-3 font-normal text-emerald-400">acme.com (You)</th>
                <th className="pb-3 font-normal">rival.io</th>
                <th className="pb-3 font-normal">nextgen.com</th>
                <th className="pb-3 font-normal">altbase.co</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {matrixRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 text-slate-300 font-sans text-xs">{row.category}</td>
                  <td className="py-3">{getBadge(row.you)}</td>
                  <td className="py-3">{getBadge(row.rival)}</td>
                  <td className="py-3">{getBadge(row.nextgen)}</td>
                  <td className="py-3">{getBadge(row.altbase)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Identified Competitive Gaps & Opportunities */}
      <div className="bg-[#0b0f17] border border-white/[0.08] rounded-xl p-6">
        <h3 className="text-sm font-tech-mono uppercase tracking-wider text-white font-semibold mb-4">
          IDENTIFIED COMPETITIVE Gaps & Opportunities
        </h3>

        <div className="space-y-4">
          {/* Gap 1 */}
          <div className="bg-[#070a10] border border-amber-500/20 rounded-lg p-4 space-y-2">
            <div className="text-xs font-tech-mono font-bold text-amber-400 uppercase tracking-wide flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>COMPARISON QUERIES GAP</span>
            </div>
            <p className="text-xs text-slate-300 font-light leading-relaxed">
              <span className="font-semibold text-white">rival.io</span> appears 42% more often in comparison templates.
            </p>
            <p className="text-[11px] font-tech-mono text-emerald-400/90">
              Recommended Action: Publish head-to-head architectural analysis sheets to feed generator knowledge index layers.
            </p>
          </div>

          {/* Gap 2 */}
          <div className="bg-[#070a10] border border-amber-500/20 rounded-lg p-4 space-y-2">
            <div className="text-xs font-tech-mono font-bold text-amber-400 uppercase tracking-wide flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>INDUSTRY AUTHORITY DEFICIT</span>
            </div>
            <p className="text-xs text-slate-300 font-light leading-relaxed">
              <span className="font-semibold text-white">nextgen.com</span> receives 2.4x more research-grade citations.
            </p>
            <p className="text-[11px] font-tech-mono text-emerald-400/90">
              Recommended Action: Release quarterly benchmark reports; AI crawlers regularly index authoritative industry assets.
            </p>
          </div>

          {/* Gap 3 */}
          <div className="bg-[#070a10] border border-amber-500/20 rounded-lg p-4 space-y-2">
            <div className="text-xs font-tech-mono font-bold text-amber-400 uppercase tracking-wide flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>DEFICIT IN RECOMMENDATION LISTS</span>
            </div>
            <p className="text-xs text-slate-300 font-light leading-relaxed">
              <span className="font-semibold text-white">altbase.co</span> is favored in 18 out of 25 structured lists.
            </p>
            <p className="text-[11px] font-tech-mono text-emerald-400/90">
              Recommended Action: Optimize structural meta-tags for recommended-by segments on product pages.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
