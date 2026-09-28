import React from 'react';
import { 
  Users, 
  Target, 
  Trophy, 
  ArrowUpRight, 
  ArrowDownRight, 
  Sparkles
} from 'lucide-react';

export default function CompetitivePositionTab() {

  // 02 COMPETITIVE POSITION - CORE METRICS
  const metrics = [
    {
      id: 'share-of-voice',
      label: 'Share of Voice',
      sublabel: 'Share of total sector AI mentions',
      value: '34.2%',
      delta: '+3.8%',
      positive: true,
      fraction: '#1 in Sector',
      badge: 'Market Leader',
    },
    {
      id: 'competitor-visibility',
      label: 'Competitor Visibility',
      sublabel: 'Average visibility of peer cohort',
      value: '58.2%',
      delta: '-1.4%',
      positive: false,
      fraction: 'Top 4 peers avg',
      badge: 'Cohort Index',
    },
    {
      id: 'visibility-gap',
      label: 'Visibility Gap',
      sublabel: 'Delta vs closest rival (Athena AI)',
      value: '+10.2%',
      delta: '+2.1%',
      positive: true,
      fraction: '68.4% vs 58.2%',
      badge: 'Lead Expanding',
    },
    {
      id: 'competitive-win-rate',
      label: 'Competitive Win Rate',
      sublabel: 'Direct "Brand vs Competitor" queries',
      value: '64.7%',
      delta: '+5.4%',
      positive: true,
      fraction: '110 of 170 queries',
      badge: 'Decisive Win',
    },
    {
      id: 'competitor-rec-rate',
      label: 'Competitor Rec Rate',
      sublabel: 'Average rival #1 recommendation',
      value: '24.1%',
      delta: '-3.2%',
      positive: false,
      fraction: 'vs your 42.8%',
      badge: 'Displaced',
    },
    {
      id: 'competitor-citation-rate',
      label: 'Competitor Citation Rate',
      sublabel: 'Peer footnote citation frequency',
      value: '286 avg',
      delta: '-18 citations',
      positive: false,
      fraction: 'vs your 412 cited',
      badge: 'Citation Edge',
    },
  ];

  // Competitor Roster Data
  const competitors = [
    {
      id: 'acme',
      name: 'Acme (Your Brand)',
      isSelf: true,
      sov: 34.2,
      visibility: 68.4,
      winRate: 64.7,
      recRate: 42.8,
      citations: 412,
      color: 'bg-emerald-400',
      badge: 'Primary Entity',
      strongestEngine: 'ChatGPT Search (84%)',
      vulnerability: 'Pricing schema recrawl',
    },
    {
      id: 'athena',
      name: 'Athena AI',
      isSelf: false,
      sov: 28.6,
      visibility: 58.2,
      winRate: 35.3,
      recRate: 26.5,
      citations: 345,
      color: 'bg-cyan-400',
      badge: 'Nearest Rival',
      strongestEngine: 'GPT-4o Standard (64%)',
      vulnerability: 'Missing schema ground truth',
    },
    {
      id: 'generative-edge',
      name: 'GenerativeEdge',
      isSelf: false,
      sov: 21.4,
      visibility: 49.0,
      winRate: 21.2,
      recRate: 18.0,
      citations: 260,
      color: 'bg-purple-400',
      badge: 'Challenger',
      strongestEngine: 'ChatGPT Search (56%)',
      vulnerability: 'Outdated feature taxonomy',
    },
    {
      id: 'omniprompt',
      name: 'OmniPrompt Labs',
      isSelf: false,
      sov: 15.8,
      visibility: 41.5,
      winRate: 14.1,
      recRate: 12.7,
      citations: 188,
      color: 'bg-amber-400',
      badge: 'Niche Player',
      strongestEngine: 'GPT-4o Mini (45%)',
      vulnerability: 'No SearchGPT indexing',
    },
  ];

  // Head to Head Query Comparison Table
  const headToHeadQueries = [
    {
      id: 1,
      query: 'Acme vs Athena AI for enterprise citation monitoring',
      intent: 'Head-to-Head Comparison',
      winner: 'Acme',
      verdictBadge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      verdictText: 'Win (+18pt advantage)',
      enginesAgreed: '10 of 10 test vectors',
      keyReason: 'Acme cited in ChatGPT for superior Monte Carlo simulation and API coverage.',
    },
    {
      id: 2,
      query: 'Best alternative to Athena AI with automated schema generation',
      intent: 'Displacement Query',
      winner: 'Acme',
      verdictBadge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      verdictText: 'Win (#1 Pick)',
      enginesAgreed: 'SearchGPT & GPT-4o Standard',
      keyReason: 'Acme positioned as modern replacement with JSON-LD ground truth feed.',
    },
    {
      id: 3,
      query: 'GenerativeEdge vs Acme pricing for seed-stage startups',
      intent: 'Pricing Comparison',
      winner: 'GenerativeEdge',
      verdictBadge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      verdictText: 'Competitor Edge',
      enginesAgreed: 'ChatGPT Free & Plus Tiers',
      keyReason: 'GenerativeEdge offers free tier; Acme enterprise plan perceived as premium ($499/mo).',
    },
    {
      id: 4,
      query: 'Who has better real-time telemetry: Acme or OmniPrompt?',
      intent: 'Technical Benchmark',
      winner: 'Acme',
      verdictBadge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      verdictText: 'Decisive Win',
      enginesAgreed: 'All ChatGPT Environments',
      keyReason: 'OmniPrompt lacks real-time hallucination triage; Acme leads across all benchmarks.',
    },
    {
      id: 5,
      query: 'Top 3 tools for monitoring LLM hallucinations and brand misquotes',
      intent: 'List / Inclusion Query',
      winner: 'Split / Tied',
      verdictBadge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      verdictText: 'Both Included (Acme #1, Athena #2)',
      enginesAgreed: 'Search & Canvas Modes',
      keyReason: 'Both brands included in top tier; Acme ranked #1 for accuracy.',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Tab Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-[#0a0f1d] to-[#07090e] border border-cyan-500/30 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 font-tech-mono text-[10px] uppercase tracking-wider font-bold">
                Competitive Landscape
              </span>
              <span className="text-xs font-tech-mono text-slate-400">
                Comparative Landscape & Share of Voice
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
              <Target className="w-6 h-6 text-cyan-400" />
              <span>COMPETITIVE POSITION</span>
            </h2>
            <p className="text-xs text-slate-300 font-mono mt-1 max-w-2xl leading-relaxed">
              Benchmark your generative footprint directly against category competitors across Share of Voice, head-to-head prompt win rates, and citation dominance.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-tech-mono text-slate-400">Competitive Scope:</span>
            <span className="px-3 py-1.5 rounded-lg bg-[#06080e] border border-white/[0.1] text-xs font-tech-mono text-emerald-400 font-bold">
              4 Monitored Peers
            </span>
          </div>
        </div>
      </div>

      {/* 6 Core Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {metrics.map((m) => (
          <div 
            key={m.id}
            className="p-4 rounded-xl bg-[#090d16] border border-white/[0.08] hover:border-cyan-500/40 transition-all flex flex-col justify-between group shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between text-[11px] font-tech-mono text-slate-400 mb-1">
                <span className="truncate">{m.label}</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/[0.04] text-slate-300 font-mono">
                  {m.badge}
                </span>
              </div>
              <div className="text-2xl font-bold font-tech-mono text-white mt-1 group-hover:text-cyan-300 transition-colors">
                {m.value}
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">
                {m.sublabel}
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-tech-mono">
              <span className="text-slate-400 truncate">{m.fraction}</span>
              <span className={`font-bold flex items-center ${m.positive ? 'text-emerald-400' : 'text-slate-400'}`}>
                {m.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {m.delta}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Share of Voice Stacked Bar & Sector Breakdown */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#080c14] border border-white/[0.08] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/[0.06]">
          <div>
            <div className="text-xs font-tech-mono uppercase tracking-widest text-cyan-400 font-bold flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5" />
              <span>SHARE OF VOICE (SOV) & COHORT DISTRIBUTION</span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-0.5">
              Proportion of total LLM brand mentions across 847 synthetic prompts
            </div>
          </div>
          <span className="text-xs font-tech-mono text-slate-400">
            Sector Total: <strong className="text-white">100.0% (1,684 mentions)</strong>
          </span>
        </div>

        {/* Stacked Percentage Bar */}
        <div className="space-y-2">
          <div className="h-5 w-full bg-white/[0.05] rounded-xl overflow-hidden flex p-1 gap-1">
            <div 
              style={{ width: '34.2%' }} 
              className="bg-emerald-400 rounded-lg h-full transition-all group relative cursor-pointer"
              title="Acme: 34.2% Share of Voice"
            />
            <div 
              style={{ width: '28.6%' }} 
              className="bg-cyan-400 rounded-lg h-full transition-all group relative cursor-pointer"
              title="Athena AI: 28.6% Share of Voice"
            />
            <div 
              style={{ width: '21.4%' }} 
              className="bg-purple-400 rounded-lg h-full transition-all group relative cursor-pointer"
              title="GenerativeEdge: 21.4% Share of Voice"
            />
            <div 
              style={{ width: '15.8%' }} 
              className="bg-amber-400 rounded-lg h-full transition-all group relative cursor-pointer"
              title="OmniPrompt: 15.8% Share of Voice"
            />
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 text-xs font-tech-mono">
            {competitors.map((c) => (
              <div key={c.id} className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                <div className={`w-3 h-3 rounded ${c.color}`} />
                <div className="truncate">
                  <span className="text-white font-medium block truncate">{c.name}</span>
                  <span className="text-slate-400 text-[10px]">{c.sov}% SoV</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Competitor Benchmark Comparison Matrix */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#080c14] border border-white/[0.08] space-y-4">
        <div className="pb-3 border-b border-white/[0.06] flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white font-tech-mono flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>COMPETITOR VISIBILITY & WIN-RATE MATRIX</span>
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Comparative performance across visibility, recommendation probability, and citations
            </p>
          </div>
          <span className="text-xs font-tech-mono text-emerald-400">
            Updated: Real-time telemetry
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-white/[0.08] text-[11px] font-tech-mono uppercase text-slate-400 bg-white/[0.01]">
                <th className="py-3 px-3">Competitor Entity</th>
                <th className="py-3 px-3">Visibility Score</th>
                <th className="py-3 px-3">Competitive Win Rate</th>
                <th className="py-3 px-3">Recommendation Rate</th>
                <th className="py-3 px-3">Citations Logged</th>
                <th className="py-3 px-3">Top ChatGPT Domain</th>
                <th className="py-3 px-3">Primary Vulnerability</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {competitors.map((c) => (
                <tr 
                  key={c.id} 
                  className={`transition-colors ${
                    c.isSelf ? 'bg-emerald-950/20 hover:bg-emerald-950/30' : 'hover:bg-white/[0.02]'
                  }`}
                >
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${c.color}`} />
                      <span className={`font-medium ${c.isSelf ? 'text-emerald-300 font-bold' : 'text-white'}`}>
                        {c.name}
                      </span>
                      {c.isSelf && (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-tech-mono uppercase">
                          You
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-3 font-tech-mono font-bold text-white">
                    {c.visibility}%
                  </td>
                  <td className="py-3.5 px-3 font-tech-mono">
                    <span className={c.isSelf ? 'text-emerald-400 font-bold' : 'text-slate-300'}>
                      {c.winRate}%
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-tech-mono">
                    <span className={c.isSelf ? 'text-emerald-400 font-bold' : 'text-slate-300'}>
                      {c.recRate}%
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-tech-mono text-slate-300">
                    {c.citations} citations
                  </td>
                  <td className="py-3.5 px-3 text-slate-300 text-[11px] font-tech-mono">
                    {c.strongestEngine}
                  </td>
                  <td className="py-3.5 px-3 text-slate-400 text-[11px]">
                    {c.vulnerability}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Head-to-Head Comparison Query Audit Table */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#080c14] border border-white/[0.08] space-y-4">
        <div className="pb-3 border-b border-white/[0.06] flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white font-tech-mono flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>HEAD-TO-HEAD PROMPT BATTLEGROUND</span>
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Direct commercial evaluation queries and ChatGPT comparative verdict
            </p>
          </div>
          <span className="text-xs font-tech-mono text-slate-400">
            Win Ratio: <strong className="text-emerald-400">64.7% (110 / 170)</strong>
          </span>
        </div>

        <div className="space-y-3">
          {headToHeadQueries.map((battle) => (
            <div 
              key={battle.id}
              className="p-4 rounded-xl bg-[#06080e] border border-white/[0.06] hover:border-cyan-500/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-tech-mono px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/10 uppercase">
                    {battle.intent}
                  </span>
                  <span className="text-[11px] font-tech-mono text-slate-500">
                    Consensus: {battle.enginesAgreed}
                  </span>
                </div>
                <div className="text-sm font-medium text-white truncate">
                  "{battle.query}"
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  {battle.keyReason}
                </div>
              </div>

              <div className="flex items-center gap-3 self-start md:self-auto flex-shrink-0">
                <div className="text-right">
                  <div className="text-[10px] font-tech-mono text-slate-500 uppercase">ChatGPT Verdict</div>
                  <span className={`px-2.5 py-1 rounded text-xs font-tech-mono font-bold border inline-block mt-0.5 ${battle.verdictBadge}`}>
                    {battle.verdictText}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
