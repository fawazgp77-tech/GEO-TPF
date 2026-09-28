import React from 'react';
import { FileText } from 'lucide-react';

export default function IntelligenceArchive({ onOpenDispatch }) {
  return (
    <section id="intelligence-archive" className="py-24 px-4 sm:px-6 lg:px-8 border-b border-white/[0.06] relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Identifier */}
        <div className="text-xs font-tech-mono text-emerald-400 tracking-wider mb-4 uppercase">
          03 // INTELLIGENCE ARCHIVE
        </div>

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <h2 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl text-white font-normal tracking-tight mb-4">
              Previous Dispatches
            </h2>
            <p className="text-slate-400 text-base sm:text-lg font-light leading-relaxed max-w-2xl">
              Longitudinal studies on generative engine bias, algorithmic retrieval fluctuations, and commercial LLM re-indexing events.
            </p>
          </div>

          <button
            onClick={() => onOpenDispatch?.('SPEC-INDEX')}
            className="inline-flex items-center gap-2 text-xs font-tech-mono text-emerald-400 hover:text-emerald-300 transition-colors group self-start md:self-end"
          >
            <span>Explore All 48 Research Papers</span>
            <span className="text-sm transition-transform group-hover:translate-x-1">→</span>
          </button>
        </div>

        {/* Dispatch Case Studies Stack */}
        <div className="space-y-8">
          
          {/* Case 01 */}
          <div className="rounded-lg bg-[#080b12]/90 border border-white/[0.08] p-7 sm:p-8 hover:border-emerald-500/30 transition-all duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Content */}
              <div className="lg:col-span-8 space-y-4">
                <div className="flex flex-wrap items-center gap-2 text-[10px] font-tech-mono text-slate-500 tracking-wider uppercase">
                  <span className="text-emerald-400/90 font-semibold">SPEC-CASE-084</span>
                  <span>•</span>
                  <span>FINANCIAL TECHNOLOGY</span>
                  <span>•</span>
                  <span>240,000 QUERIES ANALYZED</span>
                  <span>•</span>
                  <span>OCTOBER 2024</span>
                </div>

                <h3 className="font-serif-display text-2xl sm:text-3xl text-white font-normal tracking-tight leading-snug">
                  Fintech Enterprise Index: The Cross-LLM Payment Gateway Matrix
                </h3>

                <p className="text-slate-400 text-xs sm:text-sm font-light leading-relaxed">
                  A 90-day diagnostic monitoring global tier-1 payment processor mentions across GPT-4o, Perplexity Pro, and Claude 3.5 Sonnet. How one enterprise inverted a 34% hallucinated fee rate into a verified #1 recommendation position through structured semantic anchor re-engineering.
                </p>

                <div className="pt-2">
                  <button
                    onClick={() => onOpenDispatch?.('SPEC-CASE-084')}
                    className="inline-flex items-center gap-2 text-xs font-tech-mono text-slate-300 hover:text-emerald-400 transition-colors group"
                  >
                    <FileText className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="underline underline-offset-4 decoration-white/20 group-hover:decoration-emerald-400">
                      Read Complete Dispatch PDF // 3.4 MB
                    </span>
                  </button>
                </div>
              </div>

              {/* Right Metric Card: Impact Delta */}
              <div className="lg:col-span-4">
                <div className="rounded bg-[#05070c] border border-white/[0.08] p-6 text-center lg:text-left flex flex-col justify-between h-full">
                  <div>
                    <div className="text-[10px] font-tech-mono uppercase tracking-widest text-slate-500 mb-2">
                      IMPACT DELTA POST-REMEDIATION
                    </div>
                    <div className="flex items-baseline gap-2 justify-center lg:justify-start">
                      <span className="font-tech-mono text-4xl sm:text-5xl font-bold text-emerald-400 tracking-tight">
                        +38pt
                      </span>
                      <span className="text-xs font-tech-mono text-slate-300 uppercase">
                        GEO Visibility
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-tech-mono">
                    <span className="text-slate-500">PRE: 44/100</span>
                    <span className="text-slate-400">→</span>
                    <span className="text-emerald-400 font-bold">POST: 82/100</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Case 02 */}
          <div className="rounded-lg bg-[#080b12]/90 border border-white/[0.08] p-7 sm:p-8 hover:border-red-500/30 transition-all duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Content */}
              <div className="lg:col-span-8 space-y-4">
                <div className="flex flex-wrap items-center gap-2 text-[10px] font-tech-mono text-slate-500 tracking-wider uppercase">
                  <span className="text-red-400/90 font-semibold">SPEC-CASE-091</span>
                  <span>•</span>
                  <span>B2B SAAS WORKSPACE</span>
                  <span>•</span>
                  <span>510,000 SIMULATIONS</span>
                  <span>•</span>
                  <span>NOVEMBER 2024</span>
                </div>

                <h3 className="font-serif-display text-2xl sm:text-3xl text-white font-normal tracking-tight leading-snug">
                  B2B Workspace Benchmark: Generative Disruption Following Model Weights Update
                </h3>

                <p className="text-slate-400 text-xs sm:text-sm font-light leading-relaxed">
                  Tracking the overnight erasure of an 8-year market leader from AI answer engines following the release of new reasoning models, and the rapid deployment of a vector-aligned documentation schema that restored their authoritative presence in 11 days.
                </p>

                <div className="pt-2">
                  <button
                    onClick={() => onOpenDispatch?.('SPEC-CASE-091')}
                    className="inline-flex items-center gap-2 text-xs font-tech-mono text-slate-300 hover:text-red-400 transition-colors group"
                  >
                    <FileText className="w-3.5 h-3.5 text-red-400" />
                    <span className="underline underline-offset-4 decoration-white/20 group-hover:decoration-red-400">
                      Read Complete Dispatch PDF // 4.1 MB
                    </span>
                  </button>
                </div>
              </div>

              {/* Right Metric Card: Algorithmic Shift */}
              <div className="lg:col-span-4">
                <div className="rounded bg-[#05070c] border border-white/[0.08] p-6 text-center lg:text-left flex flex-col justify-between h-full">
                  <div>
                    <div className="text-[10px] font-tech-mono uppercase tracking-widest text-slate-500 mb-2">
                      OBSERVED ALGORITHMIC SHIFT
                    </div>
                    <div className="flex items-baseline gap-2 justify-center lg:justify-start">
                      <span className="font-tech-mono text-4xl sm:text-5xl font-bold text-red-400 tracking-tight">
                        -42%
                      </span>
                      <span className="text-xs font-tech-mono text-slate-300 uppercase">
                        Zero-Shot Citations
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-tech-mono">
                    <span className="text-slate-500">BEFORE WEIGHT UPDATE</span>
                    <span className="text-slate-400">→</span>
                    <span className="text-red-400 font-medium">COLLAPSE VECTOR IDENTIFIED</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
