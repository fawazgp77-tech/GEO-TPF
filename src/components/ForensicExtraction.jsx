import React from 'react';
import { Activity, ShieldAlert, GitGraph } from 'lucide-react';

export default function ForensicExtraction({ onOpenAudit }) {
  const pillars = [
    {
      num: 'CORE PILLAR 01',
      title: 'Continuous Synthesis Auditing',
      description: 'Executing multi-turn Monte Carlo prompt simulations across enterprise use cases to track rank volatility, sentiment drift, and prompt sensitivity thresholds.',
      tag: '24/7 CHATGPT RESPONSE TELEMETRY',
      icon: Activity,
    },
    {
      num: 'CORE PILLAR 02',
      title: 'Citation & Hallucination Checks',
      description: 'Comparing frontier model responses with ground-truth corporate knowledge graphs to pinpoint outdated pricing, fabricated capabilities, and competitor misattributions.',
      tag: 'GROUND-TRUTH VALIDATION',
      icon: ShieldAlert,
    },
    {
      num: 'CORE PILLAR 03',
      title: 'Entity Relationship Mapping',
      description: 'Analyzing the exact phrases, entity associations, and brand positioning ChatGPT surfaces when prompted across diverse enterprise buying scenarios.',
      tag: 'BRAND ATTRIBUTION MAPPING',
      icon: GitGraph,
    },
  ];

  return (
    <section id="forensic-extraction" className="py-24 px-4 sm:px-6 lg:px-8 border-b border-white/[0.06] relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Identifier Tag */}
        <div className="text-xs font-tech-mono text-emerald-400 tracking-wider mb-4 uppercase">
          01 // FORENSIC EXTRACTION ENGINE
        </div>

        {/* Section Heading & Subheading */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-start">
          <div className="lg:col-span-6">
            <h2 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl text-white font-normal tracking-tight leading-[1.08]">
              See what AI sees.
              <span className="block text-slate-100 font-light mt-1">Before it informs your buyer.</span>
            </h2>
          </div>

          <div className="lg:col-span-6">
            <p className="text-slate-400 text-base sm:text-lg font-light leading-relaxed">
              ChatGPT generates answers by synthesizing web information and authoritative references into direct conversational recommendations. GEO sends targeted test prompts and rigorously analyzes the resulting text responses—evaluating entity mentions, positional rankings, cited sources, and factual accuracy to determine whether your enterprise is recommended or omitted.
            </p>
          </div>
        </div>

        {/* Paradigm Comparison: Old vs New */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Old Paradigm */}
          <div className="rounded-lg bg-[#080b12]/80 border border-white/[0.08] p-7 transition-all">
            <div className="text-[10px] font-tech-mono tracking-widest text-slate-500 uppercase mb-2">
               OLD PARADIGM: INDEX RANKING
            </div>
            <h3 className="text-xl sm:text-2xl font-serif-display text-slate-300 font-normal mb-3">
              Search Engine Optimization
            </h3>
            <p className="text-slate-400 text-sm font-light leading-relaxed">
              Rank determined by static backlink equity, meta title anchors, and surface crawling indices.
            </p>
          </div>

          {/* New Frontier */}
          <div className="rounded-lg bg-gradient-to-br from-[#0a121c] via-[#09141f] to-[#070b12] border border-emerald-500/40 p-7 relative overflow-hidden shadow-[0_0_25px_-5px_rgba(16,185,129,0.15)]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="text-[10px] font-tech-mono tracking-widest text-emerald-400 uppercase mb-2 font-semibold">
              NEW FRONTIER: GENERATIVE ENGINE OPTIMIZATION
            </div>
            <h3 className="text-xl sm:text-2xl font-serif-display text-white font-normal mb-3">
              Generative Engine Optimization
            </h3>
            <p className="text-slate-300 text-sm font-light leading-relaxed">
              Brand mention frequency, answer ranking placement, structured factual verification, and citation source fidelity.
            </p>
          </div>
        </div>

        {/* Three Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="rounded-lg bg-[#080b12]/90 border border-white/[0.08] hover:border-emerald-500/40 p-7 flex flex-col justify-between transition-all duration-300 group hover:shadow-[0_10px_30px_-10px_rgba(16,185,129,0.15)]"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-tech-mono uppercase tracking-widest text-slate-500">
                      {pillar.num}
                    </span>
                    <Icon className="w-4 h-4 text-emerald-400/70 group-hover:text-emerald-400 transition-colors" />
                  </div>

                  <h4 className="text-lg font-medium text-white mb-3 group-hover:text-emerald-300 transition-colors">
                    {pillar.title}
                  </h4>

                  <p className="text-slate-400 text-xs sm:text-sm font-light leading-relaxed mb-6">
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/[0.06]">
                  <button
                    onClick={onOpenAudit}
                    className="inline-flex items-center gap-1.5 text-[10px] font-tech-mono font-medium text-emerald-400 tracking-wider hover:text-emerald-300 cursor-pointer"
                  >
                    <span>{pillar.tag}</span>
                    <span className="text-xs transition-transform group-hover:translate-x-0.5">→</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
