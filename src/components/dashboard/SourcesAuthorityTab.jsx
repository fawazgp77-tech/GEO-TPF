import React, { useState } from 'react';
import { 
  Layers, 
  Globe, 
  AlertCircle, 
  ArrowUpRight, 
  ExternalLink, 
  Clock, 
  Sparkles
} from 'lucide-react';

export default function SourcesAuthorityTab() {
  const [gapOutreachModal, setGapOutreachModal] = useState(null);

  // 04 SOURCES & AUTHORITY - CORE METRICS
  const metrics = [
    {
      id: 'citation-rate',
      label: 'Citation Rate',
      sublabel: '% answers with attributed footnotes',
      value: '54.6%',
      delta: '+6.2%',
      positive: true,
      fraction: '1,420 citations logged',
      badge: 'High Attribution',
    },
    {
      id: 'official-source-usage',
      label: 'Official Source Usage',
      sublabel: 'Citations from primary acme.com domain',
      value: '62.4%',
      delta: '+8.5%',
      positive: true,
      fraction: '886 official URLs',
      badge: 'Direct Authority',
    },
    {
      id: 'source-coverage',
      label: 'Source Coverage',
      sublabel: 'Unique documentation pages indexed',
      value: '184 URLs',
      delta: '+24 pages',
      positive: true,
      fraction: '92% of docs indexed',
      badge: 'Extensive',
    },
    {
      id: 'source-accuracy',
      label: 'Source Accuracy',
      sublabel: 'Valid 200 HTTP links with live content',
      value: '91.8%',
      delta: '+1.4%',
      positive: true,
      fraction: '8.2% 404/legacy links',
      badge: 'Healthy',
    },
    {
      id: 'source-diversity',
      label: 'Source Diversity',
      sublabel: 'Spread across independent channels',
      value: '5 Channels',
      delta: 'Balanced',
      positive: true,
      fraction: 'Docs, G2, Reddit, News',
      badge: 'Multi-Provenance',
    },
    {
      id: 'source-freshness',
      label: 'Source Freshness',
      sublabel: 'Average age of cited reference content',
      value: '42 Days',
      delta: '-18 days',
      positive: true,
      fraction: '76% under 90 days',
      badge: 'Fresh Index',
    },
    {
      id: 'competitor-source-gap',
      label: 'Competitor Source Gap',
      sublabel: 'High-authority domains missing your brand',
      value: '28 Domains',
      delta: '-5 closed',
      positive: true,
      fraction: 'Citing Athena / Rivals',
      badge: 'High Opportunity',
    },
  ];

  // Source Diversity Breakdown
  const diversityChannels = [
    { name: 'Official Product & Docs (acme.com)', percentage: 42, count: 596, color: 'bg-emerald-400' },
    { name: 'Technical Review Platforms (G2, Capterra, Gartner)', percentage: 24, count: 341, color: 'bg-cyan-400' },
    { name: 'Community Discussions (Reddit, Hacker News)', percentage: 16, count: 227, color: 'bg-purple-400' },
    { name: 'Industry Press & Media (TechCrunch, VentureBeat)', percentage: 11, count: 156, color: 'bg-amber-400' },
    { name: 'Knowledge Bases & Wikis (Wikidata, Wikipedia)', percentage: 7, count: 100, color: 'bg-rose-400' },
  ];

  // Competitor Source Gap Table
  const competitorGaps = [
    {
      id: 'gap-1',
      domain: 'g2.com/categories/generative-engine-optimization',
      type: 'Review Directory',
      competitorCited: 'Athena AI (#1 Grid Leader)',
      citationsWon: '142 citations',
      status: 'Critical Deficit',
      recommendedAction: 'Claim profile & collect 10 verified customer G2 reviews',
    },
    {
      id: 'gap-2',
      domain: 'techcrunch.com/2026/08/the-future-of-ai-brand-telemetry',
      type: 'Tier 1 Tech Press',
      competitorCited: 'GenerativeEdge & Athena',
      citationsWon: '98 citations',
      status: 'High Deficit',
      recommendedAction: 'Editorial correction pitch regarding automated vector sweeps',
    },
    {
      id: 'gap-3',
      domain: 'reddit.com/r/martech/comments/best_geo_tools_2026',
      type: 'Community Thread',
      competitorCited: 'Athena AI',
      citationsWon: '64 citations',
      status: 'Medium Deficit',
      recommendedAction: 'Publish community benchmark guide and API reference',
    },
    {
      id: 'gap-4',
      domain: 'capterra.com/p/249102/ai-search-monitoring',
      type: 'Buyer Directory',
      competitorCited: 'OmniPrompt Labs',
      citationsWon: '48 citations',
      status: 'Medium Deficit',
      recommendedAction: 'Synchronize pricing tier and feature matrix schema',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Tab Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/40 via-[#0a0f1d] to-[#07090e] border border-purple-500/30 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded bg-purple-500/20 border border-purple-500/40 text-purple-400 font-tech-mono text-[10px] uppercase tracking-wider font-bold">
                Citation Provenance
              </span>
              <span className="text-xs font-tech-mono text-slate-400">
                ChatGPT Attribution Provenance & Backlinks
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
              <Globe className="w-6 h-6 text-purple-400" />
              <span>SOURCES & AUTHORITY</span>
            </h2>
            <p className="text-xs text-slate-300 font-mono mt-1 max-w-2xl leading-relaxed">
              Track the exact sources, documentation URLs, and high-authority third-party publications that OpenAI ChatGPT relies upon to cite your brand and formulate recommendations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-tech-mono text-slate-400">Citation Index:</span>
            <span className="px-3 py-1.5 rounded-lg bg-purple-500/20 border border-purple-500/40 text-xs font-tech-mono text-purple-300 font-bold">
              1,420 Footnotes Logged
            </span>
          </div>
        </div>
      </div>

      {/* 7 Core Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3.5">
        {metrics.map((m) => (
          <div 
            key={m.id}
            className="p-4 rounded-xl bg-[#090d16] border border-white/[0.08] hover:border-purple-500/40 transition-all flex flex-col justify-between group shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between text-[11px] font-tech-mono text-slate-400 mb-1">
                <span className="truncate">{m.label}</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/[0.04] text-slate-300 font-mono">
                  {m.badge}
                </span>
              </div>
              <div className="text-2xl font-bold font-tech-mono text-white mt-1 group-hover:text-purple-300 transition-colors">
                {m.value}
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">
                {m.sublabel}
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-tech-mono">
              <span className="text-slate-400 truncate">{m.fraction}</span>
              <span className="text-purple-400 font-bold flex items-center">
                <ArrowUpRight className="w-3 h-3" />
                {m.delta}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Source Diversity Breakdown + Source Freshness */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Source Diversity Stacked Breakdown (2 Cols) */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl bg-[#080c14] border border-white/[0.08] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/[0.06]">
            <div>
              <div className="text-xs font-tech-mono uppercase tracking-widest text-purple-400 font-bold flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>SOURCE DIVERSITY DISTRIBUTION</span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                Provenance spread across official pages, reviews, forums, and news
              </div>
            </div>
            <span className="text-xs font-tech-mono text-slate-400">
              Official Ratio: <strong className="text-emerald-400">62.4% Primary</strong>
            </span>
          </div>

          {/* Diversity Progress Bars */}
          <div className="space-y-3.5 pt-1">
            {diversityChannels.map((chan) => (
              <div key={chan.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-tech-mono">
                  <span className="text-slate-300 font-medium">{chan.name}</span>
                  <span className="text-white font-bold">{chan.percentage}% ({chan.count} citations)</span>
                </div>
                <div className="h-2 w-full bg-white/[0.06] rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${chan.color}`}
                    style={{ width: `${chan.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 text-xs font-mono text-slate-400 border-t border-white/[0.04]">
            Key Takeaway: <strong className="text-white">OpenAI ChatGPT</strong> pulls heavily from G2 and verified directory listings, while prioritizing official schema-embedded documentation for technical accuracy.
          </div>
        </div>

        {/* Source Freshness Index (1 Col) */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#080c14] border border-white/[0.08] flex flex-col justify-between space-y-4">
          <div>
            <div className="pb-3 border-b border-white/[0.06]">
              <div className="text-xs font-tech-mono uppercase tracking-widest text-purple-400 font-bold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>SOURCE FRESHNESS DECAY</span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                Average age of cited URLs across LLM caches
              </div>
            </div>

            <div className="my-5 p-4 rounded-xl bg-[#05070c] border border-white/[0.06] text-center space-y-1">
              <span className="text-3xl font-bold font-tech-mono text-emerald-400">42 Days</span>
              <div className="text-xs font-tech-mono text-slate-400 uppercase">Average Citation Age</div>
              <div className="text-[10px] text-emerald-400/80 font-mono">
                18 days fresher than competitor average (60 days)
              </div>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-300">
                <span>&lt; 30 Days Old:</span>
                <span className="text-emerald-400 font-tech-mono font-bold">54% of citations</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>30 - 90 Days:</span>
                <span className="text-cyan-400 font-tech-mono font-bold">22% of citations</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>&gt; 90 Days (Stale):</span>
                <span className="text-amber-400 font-tech-mono font-bold">24% of citations</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/[0.06] text-[11px] font-tech-mono text-slate-500">
            LLM Cache Ingestion Latency: ~7-14 days
          </div>
        </div>

      </div>

      {/* └─ Competitor Source Gap (Domains citing competitors where you are missing) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#080c14] border border-white/[0.08] space-y-4">
        <div className="pb-3 border-b border-white/[0.06] flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white font-tech-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-purple-400" />
              <span>COMPETITOR SOURCE GAP (CITATION BLINDSPOTS)</span>
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              28 high-authority external domains citing competitors where your brand is currently omitted
            </p>
          </div>
          <span className="text-xs font-tech-mono text-purple-400">
            Total Impact: ~350 Citations at Stake
          </span>
        </div>

        <div className="space-y-3">
          {competitorGaps.map((gap) => (
            <div 
              key={gap.id}
              className="p-4 rounded-xl bg-[#06080e] border border-white/[0.06] hover:border-purple-500/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                    <ExternalLink className="w-3.5 h-3.5 text-purple-400" />
                    <span>{gap.domain}</span>
                  </span>
                  <span className="text-[10px] font-tech-mono px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/10">
                    {gap.type}
                  </span>
                </div>

                <div className="text-xs text-slate-300 font-mono">
                  Competitor Cited: <strong className="text-cyan-300">{gap.competitorCited}</strong> ({gap.citationsWon})
                </div>

                <div className="text-[11px] text-slate-400 font-mono">
                  Strategy: {gap.recommendedAction}
                </div>
              </div>

              <div className="flex items-center gap-2 self-start md:self-auto flex-shrink-0">
                <button
                  onClick={() => setGapOutreachModal(gap)}
                  className="px-3.5 py-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-xs font-tech-mono text-purple-300 font-bold transition-colors cursor-pointer"
                >
                  Generate Outreach Brief
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Gap Outreach Brief */}
      {gapOutreachModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0c101b] border border-white/[0.12] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <h4 className="text-sm font-bold text-white font-tech-mono">
                  Synthesized Gap Outreach Brief
                </h4>
              </div>
              <button
                onClick={() => setGapOutreachModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-lg bg-black/40 border border-white/[0.06]">
                <span className="text-[10px] uppercase font-tech-mono text-slate-500 block">Target Publication</span>
                <span className="text-white font-bold text-sm">{gapOutreachModal.domain}</span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-tech-mono text-slate-500 block">Recommended Pitch Angle</span>
                <p className="text-slate-300 mt-1 leading-relaxed bg-[#06080e] p-3 rounded-lg border border-white/[0.08]">
                  Highlight that Acme recently released automated Monte Carlo sweeps for OpenAI ChatGPT, outperforming {gapOutreachModal.competitorCited} in citation attribution speed and API accuracy.
                </p>
              </div>

              <div className="p-2.5 rounded bg-purple-950/20 border border-purple-500/20 text-purple-300 text-[11px]">
                Potential Impact: +{gapOutreachModal.citationsWon} additional AI footnotes once indexed.
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setGapOutreachModal(null)}
                className="px-4 py-1.5 rounded-lg bg-white/5 text-slate-300 text-xs font-tech-mono"
              >
                Close
              </button>
              <button
                onClick={() => {
                  alert('Outreach brief exported to clipboard and queued for PR team.');
                  setGapOutreachModal(null);
                }}
                className="px-4 py-1.5 rounded-lg bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs font-tech-mono"
              >
                Copy Brief
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
