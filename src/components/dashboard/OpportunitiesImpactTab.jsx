import React, { useState } from 'react';
import { 
  Zap, 
  CheckCircle2, 
  TrendingUp, 
  ArrowUpRight, 
  Flame, 
  Sliders, 
  Check, 
  Sparkles
} from 'lucide-react';

export default function OpportunitiesImpactTab() {
  const [filterCategory, setFilterCategory] = useState('all');
  const [completedIssues, setCompletedIssues] = useState(['fix-1', 'fix-4']);
  const [simulationModal, setSimulationModal] = useState(null);

  // 05 OPPORTUNITIES & IMPACT - CORE METRICS
  const metrics = [
    {
      id: 'open-issues',
      label: 'Open Issues',
      sublabel: 'Actionable optimization backlog',
      value: '27 Open',
      delta: '-4 this week',
      positive: true,
      fraction: 'Across 4 categories',
      badge: 'Active Sprint',
    },
    {
      id: 'critical-issues',
      label: 'Critical Issues',
      sublabel: 'Immediate conversion blockers',
      value: '5 Critical',
      delta: '-2 patched',
      positive: true,
      fraction: 'Priority 1',
      badge: 'High Stakes',
    },
    {
      id: 'fix-completion',
      label: 'Fix Completion',
      sublabel: 'Resolved backlog velocity',
      value: '68.4%',
      delta: '+12.5%',
      positive: true,
      fraction: '19 of 28 resolved',
      badge: 'On Track',
    },
    {
      id: 'experiment-success',
      label: 'Experiment Success',
      sublabel: 'A/B prompt test win rate',
      value: '84.6%',
      delta: '+6.1%',
      positive: true,
      fraction: '11 of 13 tests won',
      badge: 'Stat Significant',
    },
    {
      id: 'visibility-improvement',
      label: 'Visibility Improvement',
      sublabel: 'Net visibility surge post-fixes',
      value: '+14.8%',
      delta: '+3.2% vs target',
      positive: true,
      fraction: '68.4% current',
      badge: 'Compounding',
    },
    {
      id: 'accuracy-improvement',
      label: 'Accuracy Improvement',
      sublabel: 'Reduction in false model claims',
      value: '+21.5%',
      delta: '-14 hallucinations',
      positive: true,
      fraction: '78.4% current',
      badge: 'Trust Restored',
    },
    {
      id: 'recommendation-improvement',
      label: 'Recommendation Improvement',
      sublabel: 'Lift in #1 top-choice placement',
      value: '+18.2%',
      delta: '+362 prompts',
      positive: true,
      fraction: '42.8% current',
      badge: 'High Conversion',
    },
    {
      id: 'impact-per-fix',
      label: 'Impact per Fix',
      sublabel: 'Average visibility delta per patch',
      value: '+4.8%',
      delta: 'ROI: 8.4x',
      positive: true,
      fraction: 'Per verified fix',
      badge: 'High Leverage',
    },
  ];

  // Impact per Fix Decomposition
  const impactPerFixList = [
    {
      action: 'Schema.org JSON-LD Price & Entity Injection',
      category: 'Structured Data',
      avgLift: '+8.1%',
      metricImpacted: 'Pricing & Accuracy',
      confidence: '98%',
      color: 'bg-emerald-400',
    },
    {
      action: 'G2 & Review Directory Syndication',
      category: 'Third-Party Authority',
      avgLift: '+6.4%',
      metricImpacted: 'ChatGPT Search Citations & Rec Rate',
      confidence: '94%',
      color: 'bg-cyan-400',
    },
    {
      action: 'Wikidata & Knowledge Graph Disambiguation',
      category: 'Entity Grounding',
      avgLift: '+5.2%',
      metricImpacted: 'ChatGPT Grounding Consistency',
      confidence: '91%',
      color: 'bg-purple-400',
    },
    {
      action: 'Technical API Documentation Indexing & Sitemap Sync',
      category: 'RAG Retrieval',
      avgLift: '+4.6%',
      metricImpacted: 'GPT-4o Standard Citations',
      confidence: '89%',
      color: 'bg-amber-400',
    },
    {
      action: 'Competitor Comparative FAQ Content Injection',
      category: 'Content Gap',
      avgLift: '+4.1%',
      metricImpacted: 'Head-to-Head Win Rate',
      confidence: '86%',
      color: 'bg-rose-400',
    },
  ];

  // Actionable Opportunities Backlog
  const opportunities = [
    {
      id: 'fix-1',
      title: 'Deploy schema.org/PriceSpecification for $499/mo Pro Plan',
      category: 'Structured Data',
      critical: true,
      projectedLift: '+8.1% Accuracy',
      effort: 'Low (10 mins)',
      description: 'ChatGPT Search is citing an outdated $299 price tier. Injecting structured price schema forces immediate RAG ingestion.',
      status: 'Verified Patch',
    },
    {
      id: 'fix-2',
      title: 'Close G2 Category Grid Citation Gap vs Athena AI',
      category: 'Third-Party Authority',
      critical: true,
      projectedLift: '+6.4% Citations',
      effort: 'Medium (3 days)',
      description: 'Athena AI holds #1 position on G2 GEO Grid, driving 142 citations. Collecting 10 verified customer reviews closes the gap.',
      status: 'Open Action',
    },
    {
      id: 'fix-3',
      title: 'Remediate ChatGPT API Capabilities Hallucination',
      category: 'Entity Grounding',
      critical: true,
      projectedLift: '+5.8% Trust',
      effort: 'Low (1 hour)',
      description: 'ChatGPT is answering "Lacks native webhooks" on ungrounded technical queries. Publish api-specifications.json and link to official developer documentation.',
      status: 'Open Action',
    },
    {
      id: 'fix-4',
      title: 'Publish Multimodal API Benchmark Documentation',
      category: 'RAG Retrieval',
      critical: false,
      projectedLift: '+4.2% Visibility',
      effort: 'Medium (1 day)',
      description: 'Expose technical benchmarks comparing latency and accuracy to capture "fastest GEO platform for ChatGPT" prompt intents.',
      status: 'Verified Patch',
    },
    {
      id: 'fix-5',
      title: 'Inject Competitor Displacement FAQ on acme.com/alternatives',
      category: 'Content Gap',
      critical: false,
      projectedLift: '+3.9% Win Rate',
      effort: 'Medium (2 days)',
      description: 'Explicitly index comparison tables addressing GenerativeEdge and OmniPrompt feature gaps to sway comparative AI queries.',
      status: 'Open Action',
    },
  ];

  const handleToggleComplete = (id) => {
    if (completedIssues.includes(id)) {
      setCompletedIssues(completedIssues.filter((item) => item !== id));
    } else {
      setCompletedIssues([...completedIssues, id]);
    }
  };

  const filteredOpportunities = opportunities.filter((o) => {
    if (filterCategory === 'all') return true;
    if (filterCategory === 'critical') return o.critical;
    return o.category.toLowerCase().includes(filterCategory.toLowerCase());
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Tab Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950/40 via-[#0a0f1d] to-[#07090e] border border-amber-500/30 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-400 font-tech-mono text-[10px] uppercase tracking-wider font-bold">
                Remediation Backlog
              </span>
              <span className="text-xs font-tech-mono text-slate-400">
                Remediation Backlog & ROI Lift Attribution
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
              <Zap className="w-6 h-6 text-amber-400" />
              <span>OPPORTUNITIES & IMPACT</span>
            </h2>
            <p className="text-xs text-slate-300 font-mono mt-1 max-w-2xl leading-relaxed">
              Prioritize high-leverage technical and content optimizations with simulated ROI, tracking the exact visibility, accuracy, and recommendation lift delivered by every patch.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-tech-mono text-slate-400">Sprint Health:</span>
            <span className="px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-xs font-tech-mono text-emerald-300 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>68.4% Backlog Cleared</span>
            </span>
          </div>
        </div>
      </div>

      {/* 8 Core Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {metrics.map((m) => (
          <div 
            key={m.id}
            className="p-4 rounded-xl bg-[#090d16] border border-white/[0.08] hover:border-amber-500/40 transition-all flex flex-col justify-between group shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between text-[11px] font-tech-mono text-slate-400 mb-1">
                <span className="truncate">{m.label}</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/[0.04] text-slate-300 font-mono">
                  {m.badge}
                </span>
              </div>
              <div className="text-2xl font-bold font-tech-mono text-white mt-1 group-hover:text-amber-300 transition-colors">
                {m.value}
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">
                {m.sublabel}
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-tech-mono">
              <span className="text-slate-400 truncate">{m.fraction}</span>
              <span className="text-amber-400 font-bold flex items-center">
                <ArrowUpRight className="w-3 h-3" />
                {m.delta}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: Impact per Fix Decomposition + Sprint Velocity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* └─ Impact per Fix (2 Cols) */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl bg-[#080c14] border border-white/[0.08] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/[0.06]">
            <div>
              <div className="text-xs font-tech-mono uppercase tracking-widest text-amber-400 font-bold flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>IMPACT PER FIX (LEVERAGE DECOMPOSITION)</span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                Calculated ROI and generative lift delivered by each intervention type
              </div>
            </div>
            <span className="text-xs font-tech-mono text-slate-400">
              Avg Yield: <strong className="text-emerald-400">+4.8% per patch</strong>
            </span>
          </div>

          <div className="space-y-3.5 pt-1">
            {impactPerFixList.map((item) => (
              <div key={item.action} className="p-3.5 rounded-xl bg-[#06080e] border border-white/[0.06] space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs font-tech-mono">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{item.action}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/10">
                      {item.category}
                    </span>
                  </div>
                  <span className="text-emerald-400 font-bold text-sm">
                    {item.avgLift} Lift
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Targeted Metric: <strong className="text-slate-300">{item.metricImpacted}</strong></span>
                  <span className="text-slate-500">Confidence: {item.confidence}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 text-xs font-mono text-slate-400 border-t border-white/[0.04]">
            Summary: Structured schema injections yield the highest immediate accuracy delta (<strong className="text-emerald-400">+8.1%</strong>), while third-party citation acquisitions yield the largest long-term recommendation placement lift (<strong className="text-cyan-400">+6.4%</strong>).
          </div>
        </div>

        {/* Sprint Completion & Experiment Win Rate (1 Col) */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#080c14] border border-white/[0.08] flex flex-col justify-between space-y-5">
          <div>
            <div className="pb-3 border-b border-white/[0.06]">
              <div className="text-xs font-tech-mono uppercase tracking-widest text-amber-400 font-bold flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5" />
                <span>EXPERIMENT SUCCESS & FIX VELOCITY</span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                Remediation sprint execution velocity
              </div>
            </div>

            {/* Visual Gauge card */}
            <div className="my-4 p-4 rounded-xl bg-[#05070c] border border-white/[0.06] space-y-3">
              <div className="flex items-center justify-between text-xs font-tech-mono">
                <span className="text-slate-300">Fix Completion Progress</span>
                <span className="text-emerald-400 font-bold">68.4% (19/28)</span>
              </div>
              <div className="h-2 w-full bg-white/[0.06] rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: '68.4%' }} />
              </div>

              <div className="flex items-center justify-between text-xs font-tech-mono pt-2 border-t border-white/[0.06]">
                <span className="text-slate-300">A/B Experiment Win Rate</span>
                <span className="text-amber-400 font-bold">84.6% (11/13)</span>
              </div>
              <div className="h-2 w-full bg-white/[0.06] rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: '84.6%' }} />
              </div>
            </div>

            <div className="space-y-2 text-xs font-mono text-slate-400">
              <div className="flex justify-between">
                <span>Weekly Fix Velocity:</span>
                <span className="text-white font-tech-mono font-bold">4.2 items / wk</span>
              </div>
              <div className="flex justify-between">
                <span>Time to Recrawl Indexing:</span>
                <span className="text-emerald-400 font-tech-mono font-bold">~4.5 Days</span>
              </div>
              <div className="flex justify-between">
                <span>Net Visibility Surge:</span>
                <span className="text-emerald-400 font-tech-mono font-bold">+14.8% net</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/[0.06] text-center">
            <button
              onClick={() => alert('New A/B prompt experiment queued for OpenAI ChatGPT response channels.')}
              className="w-full py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-amber-950 font-tech-mono text-xs font-bold transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)] cursor-pointer"
            >
              + Launch New Prompt Experiment
            </button>
          </div>
        </div>

      </div>

      {/* Prioritized Optimization Backlog Table */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#080c14] border border-white/[0.08] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
          <div>
            <h3 className="text-base font-bold text-white font-tech-mono flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              <span>PRIORITIZED REMEDIATION BACKLOG</span>
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Rank-ordered interventions with simulated generative ranking impact
            </p>
          </div>

          <div className="flex items-center gap-2">
            {['all', 'critical', 'structured', 'authority'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-tech-mono uppercase transition-colors cursor-pointer ${
                  filterCategory === cat
                    ? 'bg-white/10 text-white font-bold border border-white/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filteredOpportunities.map((opp) => {
            const isCompleted = completedIssues.includes(opp.id);
            return (
              <div 
                key={opp.id}
                className={`p-4 rounded-xl border transition-all ${
                  isCompleted 
                    ? 'bg-emerald-950/15 border-emerald-500/30 opacity-80' 
                    : 'bg-[#06080e] border-white/[0.06] hover:border-amber-500/40'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      {opp.critical && (
                        <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-tech-mono uppercase font-bold">
                          Critical Blocker
                        </span>
                      )}
                      <span className="text-[10px] font-tech-mono px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/10">
                        {opp.category}
                      </span>
                      <span className="text-xs font-tech-mono text-emerald-400 font-bold">
                        {opp.projectedLift}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">
                        • Effort: {opp.effort}
                      </span>
                      {isCompleted && (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-tech-mono flex items-center gap-1 font-bold">
                          <Check className="w-3 h-3" />
                          <span>Resolved</span>
                        </span>
                      )}
                    </div>

                    <div className="text-sm font-bold text-white">
                      {opp.title}
                    </div>

                    <div className="text-xs text-slate-400 font-mono leading-relaxed">
                      {opp.description}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 self-start md:self-center flex-shrink-0">
                    <button
                      onClick={() => setSimulationModal(opp)}
                      className="px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-tech-mono text-slate-200 transition-colors cursor-pointer"
                    >
                      Simulate Impact
                    </button>
                    <button
                      onClick={() => handleToggleComplete(opp.id)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-tech-mono font-bold transition-colors cursor-pointer ${
                        isCompleted
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-400 hover:bg-amber-300 text-amber-950'
                      }`}
                    >
                      {isCompleted ? 'Mark Reopen' : 'Mark Resolved'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal for Simulated Impact */}
      {simulationModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0c101b] border border-white/[0.12] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h4 className="text-sm font-bold text-white font-tech-mono">
                  Monte Carlo Impact Simulation
                </h4>
              </div>
              <button
                onClick={() => setSimulationModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-lg bg-black/40 border border-white/[0.06]">
                <span className="text-[10px] uppercase font-tech-mono text-slate-500 block">Proposed Fix</span>
                <span className="text-white font-bold text-sm">{simulationModal.title}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-[11px] font-tech-mono">
                <div className="p-2.5 rounded bg-emerald-950/20 border border-emerald-500/30">
                  <span className="text-slate-400 block">PROJECTED LIFT</span>
                  <span className="text-emerald-400 font-bold text-base">{simulationModal.projectedLift}</span>
                </div>
                <div className="p-2.5 rounded bg-white/[0.02] border border-white/[0.06]">
                  <span className="text-slate-400 block">ESTIMATED EFFORT</span>
                  <span className="text-white font-bold text-base">{simulationModal.effort}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-tech-mono text-slate-500 block">Simulated Model Response After Fix</span>
                <p className="text-slate-300 mt-1 leading-relaxed bg-[#06080e] p-3 rounded-lg border border-white/[0.08]">
                  Predictive vectors show +14.2% increased inclusion probability across OpenAI ChatGPT Search and GPT-4o queries within 72 hours of patch deployment.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setSimulationModal(null)}
                className="px-4 py-1.5 rounded-lg bg-white/5 text-slate-300 text-xs font-tech-mono"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleToggleComplete(simulationModal.id);
                  setSimulationModal(null);
                }}
                className="px-4 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold text-xs font-tech-mono"
              >
                Execute & Mark Resolved
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
